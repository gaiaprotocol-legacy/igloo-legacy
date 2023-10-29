import { DomNode, el } from "common-app-module";
import ChatMessage from "../database-interface/ChatMessage.js";
import ChatMessageListItem from "./ChatMessageListItem.js";

export default abstract class ChatMessageList extends DomNode {
  private emptyMessageDisplay: DomNode | undefined;

  constructor(tag: string, private emptyMessage: string) {
    super(tag + ".chat-message-list");
    this.showEmptyMessage();
    this.on("visible", () => {
      this.scrollToBottom();
      setTimeout(() => {
        if (!this.deleted) this.scrollToBottom();
      });
    });
  }

  protected showEmptyMessage() {
    this.emptyMessageDisplay?.delete();
    this.emptyMessageDisplay = el("p.empty-message", this.emptyMessage);
    this.emptyMessageDisplay.on(
      "delete",
      () => this.emptyMessageDisplay = undefined,
    );
    this.append(this.emptyMessageDisplay);
  }

  public addMessage(message: ChatMessage) {
    this.emptyMessageDisplay?.delete();
    const item = new ChatMessageListItem(message);
    item.on("imageLoaded", () => this.scrollToBottom());
    this.append(item);
    this.scrollToBottom();
    return item;
  }

  public findMessageItem(messageId: number) {
    return this.children.find((item) =>
      item instanceof ChatMessageListItem &&
      item.message.id === messageId
    ) as ChatMessageListItem | undefined;
  }

  public scrollToBottom() {
    this.domElement.scrollTo(
      0,
      this.domElement.scrollHeight,
    );
  }

  public empty(): this {
    super.empty();
    if (!this.deleted) this.showEmptyMessage();
    return this;
  }
}
