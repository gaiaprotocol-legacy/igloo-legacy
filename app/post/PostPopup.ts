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
            el(
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
            el("textarea", { placeholder: "What's on your mind?" }),
          ),
          el(
            "footer",
            el("button.icon-button", new MaterialIcon("image")),
            new Button({
              tag: ".post-button",
              click: async (event, button) => {
              },
              title: "Post",
            }),
          ),
        ),
      ),
    );
  }
}
