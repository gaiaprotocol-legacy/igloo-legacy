import ChatMessageForm from "../chat/ChatMessageForm.js";

export default class SubjectChatMessageForm extends ChatMessageForm {
  constructor(subject: string) {
    super(".subject-chat-message-form");
  }
}
