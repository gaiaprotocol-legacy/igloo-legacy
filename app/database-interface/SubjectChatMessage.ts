import ChatMessage from "./ChatMessag.js";

export default interface SubjectChatMessage extends ChatMessage {
  subject: string;
  post_ref?: number;
}
