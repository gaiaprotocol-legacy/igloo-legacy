import { msg } from "common-app-module";
import Subject from "../database-interface/Subject.js";
import SubjectService from "../subject/SubjectService.js";
import SignedUserManager from "../user/SignedUserManager.js";
import SubjectChatRoomList from "./SubjectChatRoomList.js";

export default class MySubjectChatRoomList extends SubjectChatRoomList {
  constructor() {
    super(".my-subject-chat-room-list", {
      storeName: "my-subject-chat-rooms",
      emptyMessage: msg("my-subject-chat-room-list-empty-message"),
    });
  }

  protected async fetchSubjects(): Promise<Subject[]> {
    const walletAddress = SignedUserManager.user?.wallet_address;
    if (walletAddress) {
      const subject = await SubjectService.fetchSubject(walletAddress);
      return subject ? [subject] : [];
    } else {
      return [];
    }
  }
}
