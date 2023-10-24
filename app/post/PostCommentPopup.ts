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

  private textarea: DomNode<HTMLTextAreaElement>;
  private postButton: Button;

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
              this.textarea = el("textarea", {
                placeholder: "What's on your mind?",
              }),
            ),
            el(
              "footer",
              el("button.icon-button", new MaterialIcon("image")),
              this.postButton = new Button({
                tag: ".post-button",
                click: () => this.post(),
                title: "Post",
              }),
            ),
          ),
        ),
      ),
    );
    this.textarea.domElement.focus();
  }

  private async post() {
    this.postButton.disable().text = "Posting...";
    try {
      const postId = await PostService.comment(
        this.sourcePost.id,
        this.textarea.domElement.value,
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
      this.postButton.enable().text = "Post";
    }
  }
}
