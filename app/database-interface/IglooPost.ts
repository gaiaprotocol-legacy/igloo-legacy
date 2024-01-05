import { Post } from "@common-module/social";

export enum PostTarget {
  EVERYONE,
  KEY_HOLDERS,
}

export default interface IglooPost extends Post {
  target: PostTarget;
}
