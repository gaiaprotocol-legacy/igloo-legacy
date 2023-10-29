import { I18NText } from "common-app-module";
import { UploadedFile } from "./Rich.js";

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
  rich?: {
    files?: UploadedFile[];
  };
  created_at: string;
  updated_at?: string;
}
