import { Rich, UploadManager } from "common-app-module";
import { MessageSelectQuery, MessageService } from "sofi-module";
import SubjectChatMessage from "../database-interface/SubjectChatMessage.js";
import SignedUserManager from "../user/SignedUserManager.js";

class SubjectChatMessageService extends MessageService<SubjectChatMessage> {
  constructor() {
    super("subject_chat_messages", MessageSelectQuery, 100);
  }

  private async upload(files: File[]): Promise<Rich> {
    const rich: Rich = { files: [] };
    await Promise.all(files.map(async (file) => {
      if (SignedUserManager.user) {
        const url = await UploadManager.uploadImage(
          "subject_chat_upload_files",
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

  public async sendMessage(subject: string, message: string, files: File[]) {
    const rich = files.length ? await this.upload(files) : undefined;
    const data = await this.safeFetch<SubjectChatMessage>((b) =>
      b.insert({ subject, message, rich }).select(this.selectQuery).single()
    );
    return data!;
  }
}

export default new SubjectChatMessageService();
