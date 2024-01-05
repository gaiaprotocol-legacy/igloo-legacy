import { I18NText, Rich } from "@common-module/app";

export enum MessageType {
  MESSAGE,
  FILE_UPLOAD,
  POST_REF,
}

export default interface ChatMessage {
  id: number;
  author: string;
  author_name: string;
  author_avatar_url?: string;
  author_x_username?: string;
  message_type: MessageType;
  message?: string;
  translated?: I18NText;
  rich?: Rich;
  created_at: string;
  updated_at?: string;
}
