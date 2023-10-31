import {
  Button,
  Component,
  DomNode,
  el,
  MaterialIcon,
  Popup,
  Router,
  Snackbar,
} from "common-app-module";
import Post from "../database-interface/Post.js";
import { UploadedFile } from "../database-interface/Rich.js";
import SignedUserManager from "../user/SignedUserManager.js";
import PostService from "./PostService.js";

export default class PostCommentPopup extends Popup {
  public content: DomNode;

  private commentTextarea: DomNode<HTMLTextAreaElement>;
  private uploadInput: DomNode<HTMLInputElement>;
  private uploadButton: DomNode<HTMLButtonElement>;
  private commentButton: Button;

  private uploadedFile: UploadedFile | undefined;

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
                "button.upload",
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

    try {
      this.uploadedFile = await PostService.upload(file);
      this.uploadButton.empty().append(el("img", {
        src: this.uploadedFile.thumbnailUrl ?? this.uploadedFile.url,
      }));
    } catch (error) {
      console.error(error);
      this.uploadButton.empty().append(new MaterialIcon("image"));
    }

    this.uploadInput.domElement.value = "";
    this.uploadButton.domElement.disabled = false;
    this.uploadButton.deleteClass("loading");
  }

  private async postComment() {
    this.commentButton.disable().text = "Posting...";
    try {
      const postId = await PostService.comment(
        this.sourcePost.id,
        this.commentTextarea.domElement.value,
        this.uploadedFile,
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
      this.uploadButton.empty().append(new MaterialIcon("image"));
      this.commentButton.enable().text = "Post";
    }
  }
}
