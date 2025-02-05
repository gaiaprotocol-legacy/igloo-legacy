import { Rich, UploadManager } from "@common-module/app";
import { MessageSelectQuery, MessageService } from "@common-module/social";
import SubjectChatMessage from "../database-interface/SubjectChatMessage.js";
import IglooSignedUserManager from "../user/IglooSignedUserManager.js";

class SubjectChatMessageService extends MessageService<SubjectChatMessage> {
  constructor() {
    super("subject_chat_messages", MessageSelectQuery, 100);
  }

  private async upload(files: File[]): Promise<Rich> {
    const rich: Rich = { files: [] };
    await Promise.all(files.map(async (file) => {
      if (IglooSignedUserManager.user) {
        const url = await UploadManager.uploadImage(
          "subject_chat_upload_files",
          IglooSignedUserManager.user.user_id,
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

  public async sendMessage(subject: string, message: string, files: File[]) {
    const rich = files.length ? await this.upload(files) : undefined;
    return await this.safeInsertAndSelect({ subject, message, rich });
  }
}

export default new SubjectChatMessageService();
