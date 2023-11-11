import { Post } from "sofi-module";

export enum PostTarget {
  EVERYONE,
  KEY_HOLDERS,
}

export default interface IglooPost extends Post {
  target: PostTarget;
}
