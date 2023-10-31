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
import { UploadedFile } from "../database-interface/Rich.js";
import SignedUserManager from "../user/SignedUserManager.js";
import PostService from "./PostService.js";

export default class PostPopup extends Popup {
  public content: DomNode;

  private targetSelect: DomNode<HTMLSelectElement>;
  private textarea: DomNode<HTMLTextAreaElement>;
  private uploadInput: DomNode<HTMLInputElement>;
  private uploadButton: DomNode<HTMLButtonElement>;
  private postButton: Button;

  private uploadedFile: UploadedFile | undefined;

  constructor() {
    super({ barrierDismissible: true });
    this.append(
      this.content = new Component(
        ".popup.post-popup",
        el(".signed-user", {
          style: { backgroundImage: `url(${SignedUserManager.avatarUrl})` },
        }),
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
    }

    /*this.uploadInput.domElement.value = "";
    this.uploadButton.domElement.disabled = false;
    this.uploadButton.deleteClass("loading");
    this.uploadButton.empty().append(new MaterialIcon("image"));*/
  }

  private async post() {
    this.postButton.disable().text = "Posting...";
    try {
      const postId = await PostService.post(
        parseInt(this.targetSelect.domElement.value),
        this.textarea.domElement.value,
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
      this.postButton.enable().text = "Post";
    }
  }
}
