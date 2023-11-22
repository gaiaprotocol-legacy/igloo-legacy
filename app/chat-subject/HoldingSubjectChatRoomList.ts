import { msg } from "common-app-module";
import Subject from "../database-interface/Subject.js";
import SubjectChatRoomList from "./SubjectChatRoomList.js";

export default class HoldingSubjectChatRoomList extends SubjectChatRoomList {
  constructor() {
    super(".holding-subject-chat-room-list", {
      storeName: "holding-subject-chat-rooms",
      emptyMessage: msg("holding-subject-chat-room-list-empty-message"),
    });
  }

  protected fetchSubjects(): Promise<Subject[]> {
    throw new Error("Method not implemented.");
  }
}
