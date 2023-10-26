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
  private uploadInput: DomNode<HTMLInputElement>;
  private uploadButton: DomNode<HTMLButtonElement>;
  private commentButton: Button;

  constructor(private sourcePost: Post) {
    super({ barrierDismissible: true });
    this.append(
      this.content = new Component(
        ".popup.post-comment-popup",
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
              el("button", new MaterialIcon("close"), {
                click: () => this.delete(),
              }),
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
              this.uploadInput = el("input.upload", {
                type: "file",
                accept: "image/*",
                change: (event) => {
                  const file = event.target.files?.[0];
                  if (file) this.upload(file);
                },
              }),
              this.uploadButton = el(
                "button.icon-button",
                new MaterialIcon("image"),
                { click: () => this.uploadInput.domElement.click() },
              ),
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

  private async upload(file: File) {
    this.uploadButton.domElement.disabled = true;
    this.uploadButton.empty().addClass("loading");

    //TODO:

    this.uploadInput.domElement.value = "";
    this.uploadButton.domElement.disabled = false;
    this.uploadButton.deleteClass("loading");
    this.uploadButton.empty().append(new MaterialIcon("image"));
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
