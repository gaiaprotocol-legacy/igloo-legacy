import {
  Button,
  Component,
  DomNode,
  el,
  MaterialIcon,
  Popup,
  Router,
  Snackbar,
} from "common-dapp-module";
import Post from "../database-interface/Post.js";
import SignedUserManager from "../user/SignedUserManager.js";
import PostService from "./PostService.js";

export default class PostCommentPopup extends Popup {
  public content: DomNode;

  private commentTextarea: DomNode<HTMLTextAreaElement>;
  private commentButton: Button;

  constructor(private sourcePost: Post) {
    super({ barrierDismissible: true });
    this.append(
      this.content = new Component(
        ".popup.post-comment-popup",
        el(
          "header",
          el("button", new MaterialIcon("close"), {
            click: () => this.delete(),
          }),
        ),
        el(
          ".source",
          el(".author-profile-image", {
            style: {
              backgroundImage: `url(${this.sourcePost.author_avatar_url})`,
            },
          }),
          el(
            "main",
            el(
              "header",
              el(
                ".author",
                el(".name", this.sourcePost.author_name),
                this.sourcePost.author_x_username
                  ? el(".x-username", `@${this.sourcePost.author_x_username}`)
                  : undefined,
              ),
            ),
            el("p.message", this.sourcePost.message),
          ),
        ),
        el(
          ".form-wrapper",
          el(".signed-user", {
            style: { backgroundImage: `url(${SignedUserManager.avatarUrl})` },
          }),
          el(
            ".form",
            el(
              "main",
              this.commentTextarea = el("textarea", {
                placeholder: "What's on your mind?",
              }),
            ),
            el(
              "footer",
              el("button.icon-button", new MaterialIcon("image")),
              this.commentButton = new Button({
                tag: ".post-button",
                click: () => this.postComment(),
                title: "Post",
              }),
            ),
          ),
        ),
      ),
    );
    this.commentTextarea.domElement.focus();
  }

  private async postComment() {
    this.commentButton.disable().text = "Posting...";
    try {
      const postId = await PostService.comment(
        this.sourcePost.id,
        this.commentTextarea.domElement.value,
      );
      new Snackbar({
        message: "Your post has been successfully published.",
        action: {
          title: "View",
          click: () => Router.go(`/post/${postId}`),
        },
      });
      this.delete();
    } catch (error) {
      console.error(error);
      this.commentButton.enable().text = "Post";
    }
  }
}
