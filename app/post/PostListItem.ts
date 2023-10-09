import { DomNode, el, MaterialIcon, Router } from "common-dapp-module";
import Post from "../database-interface/Post.js";
import SignedUserManager from "../user/SignedUserManager.js";

export default class PostListItem extends DomNode {
  constructor(private post: Post) {
    super(".post-list-item");
    this.append(
      el(".author-profile-image", {
        style: { backgroundImage: `url(${post.author_avatar_url})` },
      }),
      el(
        "main",
        el(
          "header",
          el(
            ".author",
            el(".name", post.author_name),
            post.author_x_username ? el(".x-username", `@${post.author_x_username}`) : undefined,
          ),
          el("button.owner-menu", new MaterialIcon("more_vert"), {
            click: (event) => {
              event.stopPropagation();
            },
          }),
        ),
        el("p", post.message),
      ),
    );
    this.onDom("click", () => Router.go(`/post/${post.id}`));

    this.checkSigned();
    this.onDelegate(SignedUserManager, "userFetched", () => this.checkSigned());
  }

  private checkSigned() {
    if (this.post.author === SignedUserManager.userId) {
      this.addClass("owned");
    }
  }
}
