import { msg } from "common-app-module";
import ChatRoomList from "../chat/ChatRoomList.js";

export default class TopicChatRoomList extends ChatRoomList {
  constructor() {
    super(".topic-chat-room-list", {
      emptyMessage: msg("topic-chat-room-list-empty-message"),
    });
  }
}
