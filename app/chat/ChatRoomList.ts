import { DomNode, el } from "common-dapp-module";

export default abstract class ChatRoomList extends DomNode {
  protected emptyMessageDisplay: DomNode | undefined;

  constructor(tag: string, private emptyMessage: string) {
    super(tag + ".chat-room-list");
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

  public empty(): this {
    super.empty();
    if (!this.deleted) this.showEmptyMessage();
    return this;
  }
}
