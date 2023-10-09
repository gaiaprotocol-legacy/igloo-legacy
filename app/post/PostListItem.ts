import { DomNode, el, Router } from "common-dapp-module";
import Post from "../database-interface/Post.js";

export default class PostListItem extends DomNode {
  constructor(post: Post) {
    super(".post-list-item");
    this.append(
      el(".author-profile-image", {
        style: { backgroundImage: `url(${post.author_avatar_url})` },
      }),
      el("main", el(".author-name", post.author_name), el("p", post.message)),
    );
    this.onDom("click", () => Router.go(`/post/${post.id}`));
  }
}
