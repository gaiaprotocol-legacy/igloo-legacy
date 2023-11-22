import { ChatMessageForm } from "sofi-module";

export default class TopicChatMessageForm extends ChatMessageForm {
  constructor() {
    super(".topic-chat-message-form");
  }

  protected sendMessage(message: string, files: File[]): void {
    throw new Error("Method not implemented.");
  }
}
