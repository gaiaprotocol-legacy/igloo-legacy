import {
  Button,
  Component,
  DomNode,
  el,
  MaterialIcon,
  Popup,
} from "common-dapp-module";

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
              el("option", { value: "everyone" }, "Everyone"),
              el("option", { value: "key-holders" }, "Key Holders"),
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
    console.log(this.targetSelect.domElement.value);
    console.log(this.textarea.domElement.value);
  }
}
