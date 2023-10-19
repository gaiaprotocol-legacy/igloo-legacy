import { ViewParams } from "common-dapp-module";
import ChatRoomView from "./ChatRoomView.js";

export default class SubjectChatRoomView extends ChatRoomView {
  constructor(params: ViewParams) {
    super(params, ".subject-chat-room-view");
    this.container.append("SubjectChatRoomView");
  }
}
