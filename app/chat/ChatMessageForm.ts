import { DomNode } from "common-dapp-module";

export default abstract class ChatMessageForm extends DomNode {
  constructor(tag: string) {
    super(tag + ".chat-message-form");
  }
}
