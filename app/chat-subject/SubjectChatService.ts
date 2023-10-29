import { Supabase } from "common-app-module";
import UploadManager from "../UploadManager.js";
import { MessageType } from "../database-interface/ChatMessage.js";
import { UploadedFile } from "../database-interface/Rich.js";
import SubjectChatMessage from "../database-interface/SubjectChatMessage.js";
import SignedUserManager from "../user/SignedUserManager.js";

class SubjectChatService {
  private static readonly FETCH_MESSAGE_LIMIT = 100;

  public async sendMessage(subject: string, message: string) {
    const { data, error } = await Supabase.client.from("subject_chat_messages")
      .insert({ subject, message_type: MessageType.MESSAGE, message }).select()
      .single();
    if (error) throw error;
    return data.id;
  }

  public async uploadImage(subject: string, file: File) {
    if (!SignedUserManager.userId) throw new Error("User not signed in");

    const result = await UploadManager.uploadImage(
      "subject_chat_upload_files",
      SignedUserManager.userId,
      file,
      60 * 60 * 24 * 30,
      { width: 256, height: 256 },
    );

    const uploadedFile: UploadedFile = {
      url: result.url,
      thumbnailUrl: result.thumbnailUrl,
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
    };

    const { data, error } = await Supabase.client.from("subject_chat_messages")
      .insert({
        subject,
        message_type: MessageType.FILE_UPLOAD,
        rich: { files: [uploadedFile] },
      }).select()
      .single();
    if (error) throw error;
    return data.id;
  }

  public async fetchLatestMessages(subject: string) {
    const { data, error } = await Supabase.client.from("subject_chat_messages")
      .select().eq("subject", subject).order("created_at", { ascending: false })
      .limit(SubjectChatService.FETCH_MESSAGE_LIMIT);
    if (error) throw error;
    return data as SubjectChatMessage[];
  }
}

export default new SubjectChatService();
