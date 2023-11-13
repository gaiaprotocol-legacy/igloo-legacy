import { Supabase, UploadedFile } from "common-app-module";
import { Post, PostSelectQuery } from "sofi-module";
import UploadManager from "../UploadManager.js";
import SignedUserManager from "../user/SignedUserManager.js";

class PostService {
  private static readonly LIMIT = 50;


  public async comment(
    ref: number,
    message: string,
    uploadedFile: UploadedFile | undefined,
  ) {
    const { data, error } = await Supabase.client.from("posts").insert({
      message,
      post_ref: ref,
      rich: uploadedFile ? { files: [uploadedFile] } : undefined,
    }).select().single();
    if (error) throw error;
    return data.id;
  }

  public async repost(postId: number) {
    const { error } = await Supabase.client.from("reposts").insert({
      post_id: postId,
    });
    if (error) throw error;
  }

  public async unrepost(postId: number) {
    const { error } = await Supabase.client.from("reposts").delete().eq(
      "post_id",
      postId,
    );
    if (error) throw error;
  }

  public async checkRepost(postId: number, userId: string) {
    const { data, error } = await Supabase.client.from("reposts").select(
      "post_id",
    )
      .eq(
        "post_id",
        postId,
      ).eq(
        "user_id",
        userId,
      );
    if (error) throw error;
    return data?.[0] !== undefined;
  }

  public async checkMultipleRepost(postIds: number[], userId: string) {
    const { data, error } = await Supabase.client.from("reposts").select(
      "post_id",
    )
      .in(
        "post_id",
        postIds,
      ).eq(
        "user_id",
        userId,
      );
    if (error) throw error;
    return data ? (data as any).map((d: any) => d.post_id) : [];
  }

  public async like(postId: number) {
    const { error } = await Supabase.client.from("post_likes").insert({
      post_id: postId,
    });
    if (error) throw error;
  }

  public async unlike(postId: number) {
    const { error } = await Supabase.client.from("post_likes").delete().eq(
      "post_id",
      postId,
    );
    if (error) throw error;
  }

  public async checkLike(postId: number, userId: string) {
    const { data, error } = await Supabase.client.from("post_likes").select(
      "post_id",
    ).eq(
      "post_id",
      postId,
    ).eq(
      "user_id",
      userId,
    );
    if (error) throw error;
    return data?.[0] !== undefined;
  }

  public async checkMultipleLike(postIds: number[], userId: string) {
    const { data, error } = await Supabase.client.from("post_likes").select(
      "post_id",
    ).in(
      "post_id",
      postIds,
    ).eq(
      "user_id",
      userId,
    );
    if (error) throw error;
    return data ? (data as any).map((d: any) => d.post_id) : [];
  }

  public async deletePost(id: number) {
    const { error } = await Supabase.client.from("posts").delete().eq("id", id);
    if (error) throw error;
  }

  public async fetchPost(id: number) {
    const { data, error } = await Supabase.client.from("posts").select(
      PostSelectQuery,
    ).eq(
      "id",
      id,
    );
    if (error) throw error;
    return data?.[0];
  }

  public async fetchUserPosts(
    userId: string,
    lastFetchedPostId?: number,
  ): Promise<Post[]> {
    const { data, error } = await Supabase.client.from("posts").select(
      PostSelectQuery,
    ).eq(
      "author",
      userId,
    ).is(
      "post_ref",
      null,
    ).lt(
      "id",
      lastFetchedPostId ?? Number.MAX_SAFE_INTEGER,
    ).order(
      "created_at",
      { ascending: false },
    ).limit(PostService.LIMIT);
    if (error) throw error;
    return data;
  }

  public async fetchUserCommentPosts(
    userId: string,
    lastFetchedPostId?: number,
  ): Promise<Post[]> {
    const { data, error } = await Supabase.client.from("posts").select(
      PostSelectQuery,
    ).eq(
      "author",
      userId,
    ).not(
      "post_ref",
      "is",
      null,
    ).lt(
      "id",
      lastFetchedPostId ?? Number.MAX_SAFE_INTEGER,
    ).order(
      "created_at",
      { ascending: false },
    ).limit(PostService.LIMIT);
    if (error) throw error;
    return data;
  }

  public async fetchLikedPosts(
    userId: string,
    lastLikedAt?: string,
  ): Promise<{ post: Post; likedAt: string }[]> {
    const { data: likedData, error: likedError } = await Supabase.client.from(
      "post_likes",
    ).select().eq(
      "user_id",
      userId,
    ).gt(
      "created_at",
      lastLikedAt ?? "1970-01-01T00:00:00.000Z",
    );
    if (likedError) throw likedError;
    const likedPostIds = likedData.map((liked) => liked.post_id);
    const { data, error } = await Supabase.client.from("posts").select(
      PostSelectQuery,
    ).in(
      "id",
      likedPostIds,
    ).order(
      "created_at",
      { ascending: false },
    );
    if (error) throw error;
    return data.map((post) => ({
      post,
      likedAt: likedData.find((liked) => liked.post_id === post.id)
        ?.created_at!,
    }));
  }

  public async fetchReposts(
    userId: string,
    lastLikedAt?: string,
  ): Promise<{ post: Post; repostedAt: string }[]> {
    const { data: repostData, error: repostError } = await Supabase.client.from(
      "reposts",
    ).select().eq(
      "user_id",
      userId,
    ).gt(
      "created_at",
      lastLikedAt ?? "1970-01-01T00:00:00.000Z",
    );
    if (repostError) throw repostError;
    const repostedPostIds = repostData.map((liked) => liked.post_id);
    const { data, error } = await Supabase.client.from("posts").select(
      PostSelectQuery,
    ).in(
      "id",
      repostedPostIds,
    ).order(
      "created_at",
      { ascending: false },
    );
    if (error) throw error;
    return data.map((post) => ({
      post,
      repostedAt: repostData.find((liked) => liked.post_id === post.id)
        ?.created_at!,
    }));
  }

  public async fetchFollowingPosts(
    userId: string,
    lastFetchedPostId?: number,
  ): Promise<{ followeeIds: string[]; posts: Post[] }> {
    const { data: followsData, error: followsError } = await Supabase.client
      .from("follows").select().eq(
        "follower_id",
        userId,
      ).order(
        "followed_at",
        { ascending: false },
      );
    if (followsError) throw followsError;
    const followeeIds = followsData.map((follow) => follow.followee_id);
    const { data, error } = await Supabase.client.from("posts").select(
      PostSelectQuery,
    ).in(
      "author",
      followeeIds,
    ).lt(
      "id",
      lastFetchedPostId ?? Number.MAX_SAFE_INTEGER,
    ).order(
      "created_at",
      { ascending: false },
    ).limit(
      PostService.LIMIT,
    );
    if (error) throw error;
    return { followeeIds, posts: data };
  }

  public async fetchKeyHeldPosts(
    walletAddress: string,
    lastFetchedPostId?: number,
  ): Promise<{ keyOwnerIds: string[]; posts: Post[] }> {
    const { data: holderData, error: holderError } = await Supabase.client.from(
      "subject_key_holders",
    ).select().eq(
      "wallet_address",
      walletAddress,
    );
    if (holderError) throw holderError;
    const subjects = holderData.map((h) => h.subject);
    const { data: userData, error: userError } = await Supabase.client.from(
      "users_public",
    ).select().in(
      "wallet_address",
      subjects,
    );
    if (userError) throw userError;
    const keyOwnerIds = userData.map((u) => u.user_id);
    const { data, error } = await Supabase.client.from("posts").select(
      PostSelectQuery,
    ).in(
      "author",
      keyOwnerIds,
    ).lt(
      "id",
      lastFetchedPostId ?? Number.MAX_SAFE_INTEGER,
    ).order(
      "created_at",
      { ascending: false },
    ).limit(
      PostService.LIMIT,
    );
    if (error) throw error;
    return { keyOwnerIds, posts: data };
  }

  public async fetchComments(
    postId: number,
    lastFetchedPostId?: number,
  ): Promise<Post[]> {
    const { data, error } = await Supabase.client.from("posts").select(
      PostSelectQuery,
    ).eq(
      "post_ref",
      postId,
    ).lt(
      "id",
      lastFetchedPostId ?? Number.MAX_SAFE_INTEGER,
    ).order(
      "created_at",
      { ascending: false },
    ).limit(PostService.LIMIT);
    if (error) throw error;
    return data;
  }

  public async upload(file: File) {
    if (!SignedUserManager.userId) throw new Error("User not signed in");

    const result = await UploadManager.uploadImage(
      "post_upload_files",
      SignedUserManager.userId,
      file,
      60 * 60 * 24 * 30,
      { width: 256, height: 256 },
    );

    const uploadedFile: UploadedFile = {
      url: result.url,
      //thumbnailUrl: result.thumbnailUrl,
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
    };
    return uploadedFile;
  }
}

export default new PostService();
