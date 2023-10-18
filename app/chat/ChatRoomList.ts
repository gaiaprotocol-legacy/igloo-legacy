import { DomNode } from "common-dapp-module";

export default abstract class ChatRoomList extends DomNode {
  constructor(tag: string, emptyMessage: string) {
    super(tag + ".chat-room-list");
  }
}
