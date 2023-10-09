import { Supabase } from "common-dapp-module";
import { PostTarget } from "../database-interface/Post.js";

class PostService {
  public async publishUserPost(target: PostTarget, message: string) {
    const { data, error } = await Supabase.client.from("user_posts").insert({
      target,
      message,
    }).select().single();
    if (error) throw error;
    return data.id;
  }
}

export default new PostService();
