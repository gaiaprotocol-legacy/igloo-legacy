import ChatMessageForm from "../chat/ChatMessageForm.js";
import { MessageType } from "../database-interface/ChatMessage.js";
import TopicChatMessage from "../database-interface/TopicChatMessage.js";
import TopicChatMessageList from "./TopicChatMessageList.js";
import TopicChatService from "./TopicChatService.js";

export default class TopicChatMessageForm extends ChatMessageForm {
  constructor(private messageList: TopicChatMessageList) {
    super(".topic-chat-message-form");
  }

  protected async sendMessage(message: string) {
    const optimistic: TopicChatMessage = {
      topic: this.messageList.topic,
      ...this.getOptimisticData(MessageType.MESSAGE, message),
    };
    const item = this.messageList.addMessage(optimistic).wait();
    const messageId = await TopicChatService.sendMessage(
      this.messageList.topic,
      message,
    );
    //TODO:
    console.log(messageId);
  }

  protected upload(file: File) {
    throw new Error("Method not implemented.");
  }
}
