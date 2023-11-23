import { ViewParams } from "common-app-module";
import ChatRoomView from "../chat/ChatRoomView.js";

export default class TopicChatRoomView extends ChatRoomView {
  constructor(params: ViewParams) {
    super(".topic-chat-room-view");
  }
}
