import { Supabase } from "common-dapp-module";
import Post, { PostTarget } from "../database-interface/Post.js";

class PostService {
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
    const limit = 50;
    const { data, error } = await Supabase.client.from("posts").select().order(
      "created_at",
      { ascending: false },
    ).lt("id", lastFetchedPostId ?? Number.MAX_SAFE_INTEGER).limit(limit);
    if (error) throw error;
    return data;
  }
}

export default new PostService();
