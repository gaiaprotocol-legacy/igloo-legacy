import ChatMessageForm from "../chat/ChatMessageForm.js";

export default class TopicChatMessageForm extends ChatMessageForm {
  constructor(topic: string) {
    super(".topic-chat-message-form");
  }

  protected sendMessage(message: string): void {
    throw new Error("Method not implemented.");
  }

  protected upload(file: File): void {
    throw new Error("Method not implemented.");
  }
}
