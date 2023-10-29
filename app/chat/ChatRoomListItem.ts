import { DomNode } from "common-app-module";

export default abstract class ChatRoomListItem extends DomNode {
  constructor(tag: string) {
    super(tag + ".chat-room-list-item");
  }
}
