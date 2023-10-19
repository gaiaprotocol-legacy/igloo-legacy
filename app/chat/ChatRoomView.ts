import { DomNode, el, View, ViewParams } from "common-dapp-module";
import Layout from "../layout/Layout.js";

export default class ChatRoomView extends View {
  protected container: DomNode;

  constructor(params: ViewParams, tag: string) {
    super();
    Layout.append(
      this.container = el(tag + ".chat-room-view"),
    );
  }

  public close(): void {
    this.container.delete();
    super.close();
  }
}
