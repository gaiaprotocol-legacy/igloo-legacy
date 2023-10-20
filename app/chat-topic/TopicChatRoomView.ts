import { ViewParams } from "common-dapp-module";
import ChatRoomView from "../chat/ChatRoomView.js";
import TopicChatMessageForm from "./TopicChatMessageForm.js";
import TopicChatMessageList from "./TopicChatMessageList.js";
import TopicChatRoomHeader from "./TopicChatRoomHeader.js";

export default class TopicChatRoomView extends ChatRoomView {
  private topic: string | undefined;
  private messageList!: TopicChatMessageList;

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
    const topic = this.topic ? this.topic.toLowerCase() : "general";
    this.container.empty().append(
      new TopicChatRoomHeader(topic),
      this.messageList = new TopicChatMessageList(topic),
      new TopicChatMessageForm(this.messageList),
    );
  }
}
