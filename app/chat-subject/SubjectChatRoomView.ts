import { ViewParams } from "common-app-module";
import { ethers } from "ethers";
import ChatRoomView from "../chat/ChatRoomView.js";
import Subject from "../database-interface/Subject.js";
import SubjectService from "../subject/SubjectService.js";
import IglooSignedUserManager from "../user/IglooSignedUserManager.js";
import SubjectChatMessageForm from "./SubjectChatMessageForm.js";
import SubjectChatMessageList from "./SubjectChatMessageList.js";
import SubjectChatRoomHeader from "./SubjectChatRoomHeader.js";

export default class SubjectChatRoomView extends ChatRoomView {
  constructor(params: ViewParams, uri: string, data?: any) {
    super(".subject-chat-room-view");
    this.render(ethers.getAddress("0x" + params.subject!), data);
  }

  public changeParams(params: ViewParams, uri: string, data?: any): void {
    this.render(ethers.getAddress("0x" + params.subject!), data);
  }

  private async render(subject: string, subjectData: Subject | undefined) {
    const header = new SubjectChatRoomHeader(subjectData);
    const list = new SubjectChatMessageList(subject);
    const form = new SubjectChatMessageForm(subject);

    form.on(
      "messageSending",
      (tempId, message, files) => {
        if (IglooSignedUserManager.user) {
          list.messageSending(tempId, IglooSignedUserManager.user, message, files);
        }
      },
    );
    form.on("messageSent", (tempId, id) => list.messageSent(tempId, id));

    this.container.empty().append(header, list, form);

    if (!subjectData) {
      subjectData = await SubjectService.fetchSubject(subject);
      if (subjectData) header.update(subjectData);
    }
  }
}
