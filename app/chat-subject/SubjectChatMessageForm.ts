import ChatMessageForm from "../chat/ChatMessageForm.js";

export default class SubjectChatMessageForm extends ChatMessageForm {
  constructor(subject: string) {
    super(".subject-chat-message-form");
  }

  protected sendMessage(message: string): void {
    throw new Error("Method not implemented.");
  }

  protected upload(file: File): void {
    throw new Error("Method not implemented.");
  }
}
