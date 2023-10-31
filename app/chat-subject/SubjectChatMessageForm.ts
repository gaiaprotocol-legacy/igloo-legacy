import ChatMessageForm from "../chat/ChatMessageForm.js";
import { MessageType } from "../database-interface/ChatMessage.js";
import SubjectChatMessage from "../database-interface/SubjectChatMessage.js";
import SubjectChatMessageList from "./SubjectChatMessageList.js";
import SubjectChatService from "./SubjectChatService.js";

export default class SubjectChatMessageForm extends ChatMessageForm {
  constructor(private messageList: SubjectChatMessageList) {
    super(".subject-chat-message-form");
  }

  protected async sendMessage(message: string) {
    const optimistic: SubjectChatMessage = {
      subject: this.messageList.subject,
      ...this.getOptimisticData(MessageType.MESSAGE, message),
    };

    const item = this.messageList.addMessage(optimistic, true).wait();
    const messageId = await SubjectChatService.sendMessage(
      this.messageList.subject,
      message,
    );

    this.messageList.findMessageItem(messageId)?.delete();
    item.message.id = messageId;
    item.done();
  }

  protected async upload(file: File) {
    await SubjectChatService.uploadImage(this.messageList.subject, file);
  }
}
