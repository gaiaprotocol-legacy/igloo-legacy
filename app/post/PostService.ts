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

  public async deletePost(id: number) {
    const { error } = await Supabase.client.from("posts").delete().eq("id", id);
    if (error) throw error;
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
    ).limit(
      PostService.LIMIT,
    );
    if (error) throw error;
    return data;
  }
}

export default new PostService();
