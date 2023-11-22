import { ChatMessageForm } from "sofi-module";

export default class SubjectChatMessageForm extends ChatMessageForm {
  constructor() {
    super(".subject-chat-message-form");
  }

  protected sendMessage(message: string, files: File[]): void {
    throw new Error("Method not implemented.");
  }
}
