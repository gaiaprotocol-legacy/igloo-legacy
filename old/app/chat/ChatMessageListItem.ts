import { DomNode, el, Rich, Router } from "@common-module/app";
import dayjs from "dayjs";
import ChatMessage from "../database-interface/ChatMessage.js";
import SignedUserManager from "../user/SignedUserManager.js";

export default class ChatMessageListItem extends DomNode {
  constructor(public message: ChatMessage, isNew: boolean) {
    super(".chat-message-list-item" + (isNew ? ".new" : ""));
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
          el(
            ".date",
            dayjs(this.message.created_at).fromNow(),
          ),
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
          !this.message.message
            ? undefined
            : el("p.message", this.message.message),
          !this.message.rich ? undefined : this.getRich(this.message.rich),
          el(
            ".date",
            dayjs(this.message.created_at).fromNow(),
          ),
        ),
      );
    }
  }

  private getRich(rich: Rich) {
    if (rich.files) {
      return el(
        ".files",
        ...rich.files.map((file) =>
          el(
            ".file",
            !file.url ? undefined : el(
              ".image-container",
              el(
                "a",
                el("img", {
                  src: file.url,
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
