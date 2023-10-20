import { DomNode } from "common-dapp-module";
import ChatMessage from "../database-interface/ChatMessage.js";

export default class ChatMessageListItem extends DomNode {
  constructor(message: ChatMessage) {
    super(".chat-message-list-item");
  }

  public wait() {
    this.addClass("waiting");
  }

  public done() {
    this.deleteClass("waiting");
  }
}
