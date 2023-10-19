import { el, Router } from "common-dapp-module";
import ChatRoomListItem from "./ChatRoomListItem.js";

export default class TopicListItem extends ChatRoomListItem {
  constructor(topic: string) {
    super(".topic-list-item");
    this.append(el("h3", topic));
    this.onDom("click", () => Router.go(`/chats/${topic}`));
  }
}
