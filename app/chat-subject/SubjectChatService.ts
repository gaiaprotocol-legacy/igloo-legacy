import { Supabase } from "common-dapp-module";
import { MessageType } from "../database-interface/ChatMessage.js";
import SubjectChatMessage from "../database-interface/SubjectChatMessage.js";

class SubjectChatService {
  private static readonly FETCH_MESSAGE_LIMIT = 100;

  public async sendMessage(subject: string, message: string) {
    const { data, error } = await Supabase.client.from("subject_chat_messages")
      .insert({ subject, message_type: MessageType.MESSAGE, message }).select()
      .single();
    if (error) throw error;
    return data.id;
  }

  public async upload(subject: string, file: File) {
    //TODO:
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
