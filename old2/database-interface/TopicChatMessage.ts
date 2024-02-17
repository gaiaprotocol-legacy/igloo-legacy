import { Message } from "@common-module/social";

export default interface TopicChatMessage extends Message {
  topic: string;
}
