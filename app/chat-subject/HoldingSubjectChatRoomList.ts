import { msg } from "common-app-module";
import SubjectChatRoomList from "./SubjectChatRoomList.js";

export default class HoldingSubjectChatRoomList extends SubjectChatRoomList {
  constructor() {
    super(".holding-subject-chat-room-list", {
      storeName: "holding-subject-chat-rooms",
      emptyMessage: msg("holding-subject-chat-room-list-empty-message"),
    });
  }
}
