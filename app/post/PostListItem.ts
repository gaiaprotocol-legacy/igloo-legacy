import { DomNode } from "common-dapp-module";
import Post from "../database-interface/Post.js";

export default class PostListItem extends DomNode {
  constructor(post: Post) {
    super(".post-list-item");
    this.append(
      post.message,
    );
  }
}
