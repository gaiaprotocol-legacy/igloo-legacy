import { Rich, Supabase, UploadManager } from "common-app-module";
import { PostSelectQuery, PostService } from "sofi-module";
import IglooPost from "../database-interface/IglooPost.js";
import SignedUserManager from "../user/SignedUserManager.js";

class IglooPostService extends PostService<IglooPost> {
  constructor() {
    super("posts", "reposts", "post_likes", PostSelectQuery, 50);
  }

  private async upload(files: File[]): Promise<Rich> {
    const rich: Rich = { files: [] };
    await Promise.all(files.map(async (file) => {
      if (SignedUserManager.user) {
        const url = await UploadManager.uploadImage(
          "post_upload_files",
          SignedUserManager.user.user_id,
          file,
          60 * 60 * 24 * 30,
        );
        rich.files?.push({
          url,
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
        });
      }
    }));
    return rich;
  }

  public async post(target: number, message: string, files: File[]) {
    const rich = files.length ? await this.upload(files) : undefined;
    const data = await this.safeFetch((b) =>
      b.insert({ target, message, rich }).select(PostSelectQuery).single()
    );
    this.notifyNewGlobalPost(data);
    return data.id;
  }

  public async fetchKeyHeldPosts(
    walletAddress: string,
    lastPostId?: number,
  ): Promise<IglooPost[]> {
    const { data, error } = await Supabase.client.rpc("get_key_held_posts", {
      p_wallet_address: walletAddress,
      last_post_id: lastPostId,
      max_count: this.fetchLimit,
    });
    if (error) throw error;
    const posts = Supabase.safeResult(data) ?? [];
    for (const post of posts) {
      post.author = {
        user_id: post.author,
        display_name: post.author_display_name,
        profile_image: post.author_profile_image,
        profile_image_thumbnail: post.author_profile_image_thumbnail,
        x_username: post.author_x_username,
      };
    }
    return posts;
  }
}

export default new IglooPostService();
