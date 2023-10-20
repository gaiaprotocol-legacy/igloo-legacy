import { Supabase } from "common-dapp-module";

class SubjectChatService {
  public async sendMessage(subject: string, message: string) {
    const { data, error } = await Supabase.client.from("subject_chat_messages")
      .insert({ subject, message }).select().single();
    if (error) throw error;
    return data.id;
  }

  public async upload(subject: string, file: File) {
    //TODO:
  }
}

export default new SubjectChatService();
