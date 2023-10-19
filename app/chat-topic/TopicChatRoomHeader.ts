import { el, MaterialIcon } from "common-dapp-module";
import ChatRoomHeader from "../chat/ChatRoomHeader.js";

export default class TopicChatRoomHeader extends ChatRoomHeader {
  constructor(topic: string) {
    super(".topic-chat-room-header");
    this.append(
      el("header", el("h1", topic)),
      el(
        "footer",
        el("button.close", new MaterialIcon("close"), {
          click: () => history.back(),
        }),
      ),
    );
  }
}
