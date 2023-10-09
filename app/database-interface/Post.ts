import { I18NText } from "common-dapp-module";
import { UploadedFile } from "./Rich.js";

export enum PostTarget {
  EVERYONE,
  KEY_HOLDERS,
}

interface Rich {
  files?: UploadedFile[];
}

export default interface Post {
  id: number;
  guild_id?: number;
  target: PostTarget;
  author: string;
  author_name: string;
  author_avatar_url?: string;
  author_x_username?: string;
  message: string;
  translated?: I18NText;
  rich?: Rich;
  post_ref?: number;
  created_at: string;
  updated_at?: string;
}

const isEqualRich = (a: Rich, b: Rich) => {
  return a.files?.length === b.files?.length && (
    a.files?.every((file, index) => {
      const otherFile = b.files?.[index];
      return file.url === otherFile?.url &&
        file.thumbnailURL === otherFile?.thumbnailURL &&
        file.fileName === otherFile?.fileName &&
        file.fileType === otherFile?.fileType &&
        file.fileSize === otherFile?.fileSize;
    }) ?? false
  );
};

export const isEqualPost = (a: Post | undefined, b: Post | undefined) =>
  a?.id === b?.id &&
  a?.guild_id === b?.guild_id &&
  a?.target === b?.target &&
  a?.author === b?.author &&
  a?.author_name === b?.author_name &&
  a?.author_avatar_url === b?.author_avatar_url &&
  a?.author_x_username === b?.author_x_username &&
  a?.message === b?.message &&
  isEqualRich(a?.rich ?? {}, b?.rich ?? {}) &&
  a?.post_ref === b?.post_ref;
