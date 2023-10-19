import { ViewParams } from "common-dapp-module";
import ChatRoomView from "../chat/ChatRoomView.js";

export default class SubjectChatRoomView extends ChatRoomView {
  private subject: string;

  constructor(params: ViewParams) {
    super(params, ".subject-chat-room-view");
    this.subject = params.subject!;
    this.render();
  }

  public changeParams(params: ViewParams, uri: string): void {
    this.subject = params.subject!;
    this.render();
  }

  private render() {
    this.container.empty();
  }
}
