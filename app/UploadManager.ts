import { Supabase } from "common-app-module";
import { v4 as uuidv4 } from "uuid";

class UploadManager {
  private async uploadFile(
    bucketId: string,
    folderPath: string,
    file: File,
  ): Promise<string> {
    const { data, error } = await Supabase.client
      .storage.from(bucketId).upload(
        `${folderPath}/${uuidv4()}_${file.name}`,
        file,
      );
    if (error) throw error;
    return data.path;
  }

  public async createSignedUrl(
    bucketId: string,
    path: string,
    expiresIn: number,
  ): Promise<string> {
    const { data, error } = await Supabase.client
      .storage.from(bucketId).createSignedUrl(path, expiresIn);
    if (error) throw error;
    return data.signedUrl;
  }

  public async uploadImage(
    bucketId: string,
    folderPath: string,
    file: File,
    expiresIn: number,
    thumnailSize: { width: number; height: number },
  ): Promise<{ url: string; /*thumbnailUrl: string*/ }> {
    const uploadPath = await this.uploadFile(bucketId, folderPath, file);
    const url = await this.createSignedUrl(bucketId, uploadPath, expiresIn);
    /*const { data, error } = await Supabase.client
      .storage.from(bucketId).createSignedUrl(uploadPath, expiresIn, {
        transform: thumnailSize,
      });
    if (error) throw error;*/
    return { url };//, thumbnailUrl: data.signedUrl };
  }
}

export default new UploadManager();
