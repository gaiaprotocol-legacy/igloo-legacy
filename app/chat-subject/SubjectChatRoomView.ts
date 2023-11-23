import { ViewParams } from "common-app-module";
import { ethers } from "ethers";
import ChatRoomView from "../chat/ChatRoomView.js";
import SubjectChatMessageForm from "./SubjectChatMessageForm.js";
import SubjectChatMessageList from "./SubjectChatMessageList.js";

export default class SubjectChatRoomView extends ChatRoomView {
  private subject: string;

  constructor(params: ViewParams) {
    super(".subject-chat-room-view");
    this.subject = ethers.getAddress("0x" + params.subject!);
    this.render();
  }

  public changeParams(params: ViewParams): void {
    this.subject = ethers.getAddress("0x" + params.subject!);
    this.render();
  }

  private render() {
    const list = new SubjectChatMessageList(this.subject);
    const form = new SubjectChatMessageForm(this.subject);
  }
}
