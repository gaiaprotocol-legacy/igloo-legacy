import { Supabase } from "common-dapp-module";
import Post, { PostTarget } from "../database-interface/Post.js";

class PostService {
  private static readonly LIMIT = 50;

  public async post(target: PostTarget, message: string) {
    const { data, error } = await Supabase.client.from("posts").insert({
      target,
      message,
    }).select().single();
    if (error) throw error;
    return data.id;
  }

  public async comment(ref: number, message: string) {
    const { data, error } = await Supabase.client.from("posts").insert({
      message,
      post_ref: ref,
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

  public async deletePost(id: number) {
    const { error } = await Supabase.client.from("posts").delete().eq("id", id);
    if (error) throw error;
  }

  public async fetchPost(id: number) {
    const { data, error } = await Supabase.client.from("posts").select().eq(
      "id",
      id,
    );
    if (error) throw error;
    return data?.[0];
  }

  public async fetchGlobalPosts(lastFetchedPostId?: number): Promise<Post[]> {
    const { data, error } = await Supabase.client.from("posts").select().lt(
      "id",
      lastFetchedPostId ?? Number.MAX_SAFE_INTEGER,
    ).order(
      "created_at",
      { ascending: false },
    ).limit(
      PostService.LIMIT,
    );
    if (error) throw error;
    return data;
  }

  public async fetchUserPosts(
    userId: string,
    lastFetchedPostId?: number,
  ): Promise<Post[]> {
    const { data, error } = await Supabase.client.from("posts").select().eq(
      "author",
      userId,
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
    const { data, error } = await Supabase.client.from("posts").select().in(
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
      "user_details",
    ).select().in(
      "wallet_address",
      subjects,
    );
    if (userError) throw userError;
    const keyOwnerIds = userData.map((u) => u.user_id);
    const { data, error } = await Supabase.client.from("posts").select().in(
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
    const { data, error } = await Supabase.client.from("posts").select().eq(
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
}

export default new PostService();
