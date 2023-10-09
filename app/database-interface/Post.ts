import { I18NText } from "common-dapp-module";
import { Emoji, UploadedFile } from "./Rich.js";

export default interface Post {
  id: number;
  author: string;
  author_name: string;
  author_avatar_url?: string;
  message: string;
  translated?: I18NText;
  rich?: {
    files?: UploadedFile[];
    emojis?: Emoji[];
  };
  created_at: string;
  updated_at?: string;
}
