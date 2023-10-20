import { Supabase } from "common-dapp-module";

class TopicChatService {
  public async sendMessage(topic: string, message: string) {
    const { data, error } = await Supabase.client.from("topic_chat_messages")
      .insert({ topic, message }).select().single();
    if (error) throw error;
    return data.id;
  }

  public async upload(topic: string, file: File) {
    //TODO:
  }
}

export default new TopicChatService();
