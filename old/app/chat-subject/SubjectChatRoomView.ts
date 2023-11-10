import { ViewParams } from "common-app-module";
import { ethers } from "ethers";
import ChatRoomView from "../chat/ChatRoomView.js";
import SubjectChatMessageForm from "./SubjectChatMessageForm.js";
import SubjectChatMessageList from "./SubjectChatMessageList.js";
import SubjectChatRoomHeader from "./SubjectChatRoomHeader.js";

export default class SubjectChatRoomView extends ChatRoomView {
  private subject: string;
  private messageList!: SubjectChatMessageList;

  constructor(params: ViewParams) {
    super(params, ".subject-chat-room-view");
    this.subject = "0x" + params.subject!;
    this.render();
  }

  public changeParams(params: ViewParams, uri: string): void {
    this.subject = "0x" + params.subject!;
    this.render();
  }

  private render() {
    const subject = ethers.getAddress(this.subject);
    this.container.empty().append(
      new SubjectChatRoomHeader(subject),
      this.messageList = new SubjectChatMessageList(subject),
      new SubjectChatMessageForm(this.messageList),
    );
  }
}
