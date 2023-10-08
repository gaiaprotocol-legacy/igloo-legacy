import { I18NText } from "common-dapp-module";
import { Emoji, UploadedFile } from "./Rich.js";

export enum MessageType {
  MESSAGE,
  FILE_UPLOAD,
  EMOJI,
}

export default interface SubjectChatMessage {
  id: number;
  subject: string;
  author: string;
  author_name: string;
  author_avatar_url?: string;
  message_type: MessageType;
  message?: string;
  translated?: I18NText;
  rich?: {
    files?: UploadedFile[];
    emojis?: Emoji[];
  };
  post_ref?: number;
  created_at: string;
  updated_at?: string;
}
