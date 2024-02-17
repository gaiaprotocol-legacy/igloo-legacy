import { Message } from "@common-module/social";

export default interface SubjectChatMessage extends Message {
  subject: string;
}
