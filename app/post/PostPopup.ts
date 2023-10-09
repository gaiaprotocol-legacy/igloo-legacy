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
import PostService from "./PostService.js";

export default class PostPopup extends Popup {
  public content: DomNode;

  private targetSelect: DomNode<HTMLSelectElement>;
  private textarea: DomNode<HTMLTextAreaElement>;
  private postButton: Button;

  constructor() {
    super({ barrierDismissible: true });
    this.append(
      this.content = new Component(
        ".popup.post-popup",
        el(".signed-user"),
        el(
          ".form",
          el(
            "header",
            this.targetSelect = el(
              "select",
              el("option", { value: "0" }, "Everyone"),
              el("option", { value: "1" }, "Key Holders"),
            ),
            el("button", new MaterialIcon("close"), {
              click: () => this.delete(),
            }),
          ),
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
    );
    this.textarea.domElement.focus();
  }

  private async post() {
    this.postButton.disable().text = "Posting...";
    try {
      const postId = await PostService.publishUserPost(
        parseInt(this.targetSelect.domElement.value),
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
