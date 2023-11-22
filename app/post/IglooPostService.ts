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
    const data = await this.safeFetch<IglooPost>((b) =>
      b.insert({ target, message, rich }).select(PostSelectQuery).single()
    );
    this.notifyNewGlobalPost(data!);
    return data!;
  }

  public async comment(parent: number, message: string, files: File[]) {
    const rich = files.length ? await this.upload(files) : undefined;
    const data = await this.safeFetch<IglooPost>((b) =>
      b.insert({ parent, message, rich }).select(PostSelectQuery).single()
    );
    return data!;
  }

  public async fetchKeyHeldPosts(
    userId: string,
    walletAddress: string,
    lastPostId?: number,
  ) {
    const { data, error } = await Supabase.client.rpc("get_key_held_posts", {
      p_user_id: userId,
      p_wallet_address: walletAddress,
      last_post_id: lastPostId,
      max_count: this.fetchLimit,
    });
    if (error) throw error;
    return this.enhancePostData(data ?? []);
  }
}

export default new IglooPostService();
