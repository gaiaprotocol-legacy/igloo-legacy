import { Supabase } from "common-dapp-module";
import { MessageType } from "../database-interface/ChatMessage.js";
import TopicChatMessage from "../database-interface/TopicChatMessage.js";

class TopicChatService {
  private static readonly FETCH_MESSAGE_LIMIT = 100;

  public async sendMessage(topic: string, message: string): Promise<number> {
    const { data, error } = await Supabase.client.from("topic_chat_messages")
      .insert({ topic, message_type: MessageType.MESSAGE, message }).select()
      .single();
    if (error) throw error;
    return data.id;
  }

  public async upload(topic: string, file: File) {
    //TODO:
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
