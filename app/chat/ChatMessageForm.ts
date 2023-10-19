import { Button, DomNode, el, MaterialIcon } from "common-dapp-module";

export default abstract class ChatMessageForm extends DomNode {
  private uploadInput: DomNode<HTMLInputElement>;
  private uploadButton: DomNode<HTMLButtonElement>;
  private messageInput: DomNode<HTMLInputElement>;

  constructor(tag: string) {
    super(tag + ".chat-message-form");
    this.append(
      this.uploadInput = el("input.upload", {
        type: "file",
        accept: "image/*",
        change: (event) => {
          const file = event.target.files?.[0];
          if (file) {
            //this.upload(file);
          }
        },
      }),
      this.uploadButton = el("button.upload", new MaterialIcon("upload"), {}),
      el(
        "form",
        this.messageInput = el("input"),
        new Button({
          tag: ".send",
          title: "Send",
        }),
        {
          submit: (event) => {
            event.preventDefault();
            //this.sendMessage();
          },
        },
      ),
    );
  }
}
