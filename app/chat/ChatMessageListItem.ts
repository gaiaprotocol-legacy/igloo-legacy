import { DomNode, el, Router } from "common-dapp-module";
import ChatMessage from "../database-interface/ChatMessage.js";
import { UploadedFile } from "../database-interface/Rich.js";
import SignedUserManager from "../user/SignedUserManager.js";

export default class ChatMessageListItem extends DomNode {
  constructor(public message: ChatMessage) {
    super(".chat-message-list-item");
    this.addAllowedEvents("imageLoaded");
    this.render();
    this.onDelegate(SignedUserManager, "userFetched", () => this.render());
  }

  private render() {
    this.empty().deleteClass("owner");
    if (
      SignedUserManager.signed &&
      this.message.author === SignedUserManager.userId
    ) {
      this.append(
        el(
          "main",
          el(
            "header",
            el(
              ".author",
              el(".name", this.message.author_name, {
                click: () => Router.go(`/${this.message.author_x_username}`),
              }),
            ),
          ),
          !this.message.message
            ? undefined
            : el("p.message", this.message.message),
          !this.message.rich ? undefined : this.getRich(this.message.rich),
        ),
        el(".author-profile-image", {
          style: { backgroundImage: `url(${this.message.author_avatar_url})` },
          click: () => Router.go(`/${this.message.author_x_username}`),
        }),
      ).addClass("owner");
    } else {
      this.append(
        el(".author-profile-image", {
          style: { backgroundImage: `url(${this.message.author_avatar_url})` },
          click: () => Router.go(`/${this.message.author_x_username}`),
        }),
        el(
          "main",
          el(
            "header",
            el(
              ".author",
              el(".name", this.message.author_name, {
                click: () => Router.go(`/${this.message.author_x_username}`),
              }),
            ),
          ),
          el("p.message", this.message.message),
        ),
      );
    }
  }

  private getRich(rich: { files?: UploadedFile[] }) {
    if (rich.files) {
      return el(
        ".files",
        ...rich.files.map((file) =>
          el(
            ".file",
            !file.thumbnailUrl ? undefined : el(
              ".image-container",
              el(
                "a",
                el("img", {
                  src: file.thumbnailUrl,
                  load: () => {
                    if (!this.deleted) this.fireEvent("imageLoaded");
                  },
                }),
                { href: file.url, target: "_blank" },
              ),
            ),
          )
        ),
      );
    }
    return undefined;
  }

  public wait() {
    this.addClass("waiting");
    return this;
  }

  public done() {
    this.deleteClass("waiting");
    return this;
  }
}
