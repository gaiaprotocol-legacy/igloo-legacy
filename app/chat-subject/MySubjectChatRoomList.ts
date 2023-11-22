import { msg } from "common-app-module";
import SubjectChatRoomList from "./SubjectChatRoomList.js";

export default class MySubjectChatRoomList extends SubjectChatRoomList {
  constructor() {
    super(".my-subject-chat-room-list", {
      storeName: "my-subject-chat-rooms",
      emptyMessage: msg("my-subject-chat-room-list-empty-message"),
    });
  }
}
