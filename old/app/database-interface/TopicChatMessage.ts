import ChatMessage from "./ChatMessage.js";

export default interface TopicChatMessage extends ChatMessage {
  topic: string;
}
