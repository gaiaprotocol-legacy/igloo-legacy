import { el, MaterialIcon } from "common-dapp-module";
import ChatRoomHeader from "../chat/ChatRoomHeader.js";

export default class TopicChatRoomHeader extends ChatRoomHeader {
  constructor(topic: string) {
    super(".topic-chat-room-header");
    this.append(
      el(
        "header",
        el("button.back", new MaterialIcon("arrow_back"), {
          click: () => history.back(),
        }),
        el("h1", topic),
      ),
      el(
        "footer",
      ),
    );
  }
}
