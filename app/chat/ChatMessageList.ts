import { DomNode } from "common-dapp-module";

export default abstract class ChatMessageList extends DomNode {
  constructor(tag: string) {
    super(tag + ".chat-message-list");
  }
}
