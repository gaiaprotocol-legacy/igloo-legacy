import { Message } from "sofi-module";

export default interface SubjectChatMessage extends Message {
  subject: string;
}
