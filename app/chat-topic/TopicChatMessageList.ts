import ChatMessageList from "../chat/ChatMessageList.js";

export default class TopicChatMessageList extends ChatMessageList {
  constructor(public topic: string) {
    super(".topic-chat-message-list", "No messages yet.");
  }
}
