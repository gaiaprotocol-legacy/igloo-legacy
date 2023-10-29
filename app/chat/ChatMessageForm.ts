import { Button, DomNode, el, MaterialIcon } from "common-app-module";
import ChatMessage, { MessageType } from "../database-interface/ChatMessage.js";
import { UploadedFile } from "../database-interface/Rich.js";
import SignedUserManager from "../user/SignedUserManager.js";

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
          if (file) this._upload(file);
        },
      }),
      this.uploadButton = el("button.upload", new MaterialIcon("image"), {
        click: () => this.uploadInput.domElement.click(),
      }),
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
            const message = this.messageInput.domElement.value;
            if (message) this.sendMessage(message);
            this.messageInput.domElement.value = "";
          },
        },
      ),
    );

    this.on("visible", () => this.messageInput.domElement.focus());
  }

  private async _upload(file: File) {
    this.uploadButton.domElement.disabled = true;
    this.uploadButton.empty().addClass("loading");
    await this.upload(file);
    this.uploadInput.domElement.value = "";
    this.uploadButton.domElement.disabled = false;
    this.uploadButton.deleteClass("loading");
    this.uploadButton.empty().append(new MaterialIcon("image"));
  }

  protected abstract sendMessage(message: string): void;
  protected abstract upload(file: File): Promise<void>;

  protected getOptimisticData(
    messageType: MessageType,
    message?: string,
    rich?: {
      files?: UploadedFile[];
    },
  ): ChatMessage {
    if (!SignedUserManager.signed) {
      throw new Error("User is not signed");
    }
    return {
      id: -1,
      author: SignedUserManager.userId!,
      author_name: SignedUserManager.name,
      author_avatar_url: SignedUserManager.avatarUrl,
      message_type: messageType,
      message,
      rich,
      created_at: new Date().toISOString(),
    };
  }
}
