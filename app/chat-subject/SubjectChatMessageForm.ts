import { ChatMessageForm } from "sofi-module";
import SubjectChatMessageService from "./SubjectChatMessageService.js";

export default class SubjectChatMessageForm extends ChatMessageForm {
  constructor(private subject: string) {
    super(".subject-chat-message-form");
  }

  protected async sendMessage(message: string, files: File[]) {
    const data = await SubjectChatMessageService.sendMessage(
      this.subject,
      message,
      files,
    );
    return data.id;
  }
}
