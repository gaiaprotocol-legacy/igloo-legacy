import { Router } from "common-dapp-module";
import SubjectDetails from "../database-interface/SubjectDetails.js";
import ChatRoomListItem from "./ChatRoomListItem.js";

export default class SubjectListItem extends ChatRoomListItem {
  constructor(subjectDetails: SubjectDetails) {
    super(".subject-list-item");
    //this.append(el("h3", ));
    this.onDom("click", () => Router.go(`/chats/${subjectDetails.subject}`));
  }
}
