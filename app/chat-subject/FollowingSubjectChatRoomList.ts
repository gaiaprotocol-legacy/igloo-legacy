import { msg } from "common-app-module";
import SubjectChatRoomList from "./SubjectChatRoomList.js";

export default class FollowingSubjectChatRoomList extends SubjectChatRoomList {
  constructor() {
    super(".following-subject-chat-room-list", {
      storeName: "following-subject-chat-rooms",
      emptyMessage: msg("following-subject-chat-room-list-empty-message"),
    });
  }
}
