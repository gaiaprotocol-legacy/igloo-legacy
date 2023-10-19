import { ViewParams } from "common-dapp-module";
import ChatRoomView from "./ChatRoomView.js";

export default class TopicChatRoomView extends ChatRoomView {
  private topic: string | undefined;

  constructor(params: ViewParams) {
    super(params, ".topic-chat-room-view");
    this.topic = params.topic;
    this.render();
  }

  public changeParams(params: ViewParams, uri: string): void {
    this.topic = params.topic;
    this.render();
  }

  private render() {
    this.container.deleteClass("mobile-hidden");
    if (!this.topic) this.container.addClass("mobile-hidden");
    this.container.empty();
  }
}
