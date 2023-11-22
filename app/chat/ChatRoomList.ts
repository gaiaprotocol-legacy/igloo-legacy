import { DomNode } from "common-app-module";

export interface ChatRoomListOptions {
  emptyMessage: string;
}

export default abstract class ChatRoomList extends DomNode {
  constructor(tag: string, options: ChatRoomListOptions) {
    super(tag + ".chat-room-list");
    this.domElement.setAttribute("data-empty-message", options.emptyMessage);
  }
}
