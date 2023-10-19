import { ViewParams } from "common-dapp-module";
import ChatRoomView from "./ChatRoomView.js";

export default class TopicChatRoomView extends ChatRoomView {
  constructor(params: ViewParams) {
    super(params, ".topic-chat-room-view");
    this.container.append("TopicChatRoomView");
  }
}
