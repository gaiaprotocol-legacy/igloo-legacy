import { DomNode, el } from "common-dapp-module";
import ChatMessage from "../database-interface/ChatMessage.js";
import ChatMessageListItem from "./ChatMessageListItem.js";

export default abstract class ChatMessageList extends DomNode {
  private emptyMessageDisplay: DomNode | undefined;

  constructor(tag: string, private emptyMessage: string) {
    super(tag + ".chat-message-list");
    this.showEmptyMessage();
  }

  private showEmptyMessage() {
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
    this.append(item);
    return item;
  }

  public empty(): this {
    super.empty();
    if (!this.deleted) this.showEmptyMessage();
    return this;
  }
}
