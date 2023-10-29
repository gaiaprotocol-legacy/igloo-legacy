import { el, Router } from "common-app-module";
import ChatRoomListItem from "../chat/ChatRoomListItem.js";

export default class TopicListItem extends ChatRoomListItem {
  constructor(topic: string) {
    super(".topic-list-item");
    this.append(el("h3", topic));
    this.onDom("click", () => Router.go(`/chats/${topic}`));
  }
}
