import { Supabase, UploadedFile } from "common-app-module";
import UploadManager from "../UploadManager.js";
import { MessageType } from "../database-interface/ChatMessage.js";
import TopicChatMessage from "../database-interface/TopicChatMessage.js";
import SignedUserManager from "../user/SignedUserManager.js";

class TopicChatService {
  private static readonly FETCH_MESSAGE_LIMIT = 100;

  public async sendMessage(topic: string, message: string): Promise<number> {
    const { data, error } = await Supabase.client.from("topic_chat_messages")
      .insert({ topic, message_type: MessageType.MESSAGE, message }).select()
      .single();
    if (error) throw error;
    return data.id;
  }

  public async uploadImage(topic: string, file: File) {
    if (!SignedUserManager.userId) throw new Error("User not signed in");

    const result = await UploadManager.uploadImage(
      "topic_chat_upload_files",
      SignedUserManager.userId,
      file,
      60 * 60 * 24 * 30,
      { width: 256, height: 256 },
    );

    const uploadedFile: UploadedFile = {
      url: result.url,
      //thumbnailUrl: result.thumbnailUrl,
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
    };

    const { data, error } = await Supabase.client.from("topic_chat_messages")
      .insert({
        topic,
        message_type: MessageType.FILE_UPLOAD,
        rich: { files: [uploadedFile] },
      }).select()
      .single();
    if (error) throw error;
    return data.id;
  }

  public async fetchLatestMessages(topic: string) {
    const { data, error } = await Supabase.client.from("topic_chat_messages")
      .select().eq("topic", topic).order("created_at", { ascending: false })
      .limit(TopicChatService.FETCH_MESSAGE_LIMIT);
    if (error) throw error;
    return data as TopicChatMessage[];
  }
}

export default new TopicChatService();
