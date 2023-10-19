import ChatMessageForm from "../chat/ChatMessageForm.js";

export default class TopicChatMessageForm extends ChatMessageForm {
  constructor(topic: string) {
    super(".topic-chat-message-form");
  }
}
