import { Rich, UploadManager } from "common-app-module";
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
}

export default new IglooPostService();
