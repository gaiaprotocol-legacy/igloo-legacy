import { Supabase } from "common-dapp-module";
import SignedUserManager from "../user/SignedUserManager.js";

class PostService {
  public async publishSubjectPost(subject: string, message: string) {
    const { data, error } = await Supabase.client.from("subject_posts").insert({
      subject,
      author_name: SignedUserManager.name,
      author_avatar_url: SignedUserManager.avatarUrl,
      message,
    }).select().single();
    if (error) throw error;
    return data.id;
  }
}

export default new PostService();
