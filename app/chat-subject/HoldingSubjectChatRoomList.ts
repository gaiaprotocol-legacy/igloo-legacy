import { msg } from "common-app-module";
import Subject from "../database-interface/Subject.js";
import SubjectChatRoomList from "./SubjectChatRoomList.js";
import { SoFiUserPublic } from "sofi-module";

export default class HoldingSubjectChatRoomList extends SubjectChatRoomList {
  constructor() {
    super(".holding-subject-chat-room-list", {
      storeName: "holding-subject-chat-rooms",
      emptyMessage: msg("holding-subject-chat-room-list-empty-message"),
    });
  }

  protected async fetchSubjects(): Promise<
    { subjects: Subject[]; owners: SoFiUserPublic[] }
  > {
    throw new Error("Method not implemented.");
  }
}
