import ChatMessageList from "../chat/ChatMessageList.js";

export default class SubjectChatMessageList extends ChatMessageList {
  constructor(subject: string) {
    super(".subject-chat-message-list", "No messages yet.");
  }
}
