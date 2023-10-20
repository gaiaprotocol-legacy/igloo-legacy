import { DomNode } from "common-dapp-module";
import ChatMessage from "../database-interface/ChatMessage.js";

export default class ChatMessageListItem extends DomNode {
  constructor(public message: ChatMessage) {
    super(".chat-message-list-item");
    this.append(message.message);
  }

  public wait() {
    this.addClass("waiting");
    return this;
  }

  public done() {
    this.deleteClass("waiting");
    return this;
  }
}
