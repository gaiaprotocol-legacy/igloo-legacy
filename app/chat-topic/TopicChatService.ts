import { Supabase } from "common-dapp-module";
import { MessageType } from "../database-interface/ChatMessage.js";

class TopicChatService {
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
}

export default new TopicChatService();
