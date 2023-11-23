import { msg } from "common-app-module";
import { SoFiUserPublic } from "sofi-module";
import Subject from "../database-interface/Subject.js";
import SubjectService from "../subject/SubjectService.js";
import SignedUserManager from "../user/SignedUserManager.js";
import SubjectChatRoomList from "./SubjectChatRoomList.js";

export default class FollowingSubjectChatRoomList extends SubjectChatRoomList {
  constructor() {
    super(".following-subject-chat-room-list", {
      storeName: "following-subject-chat-rooms",
      emptyMessage: msg("following-subject-chat-room-list-empty-message"),
    });
  }

  protected async fetchSubjects(): Promise<
    { subjects: Subject[]; owners: SoFiUserPublic[] }
  > {
    if (!SignedUserManager.user) throw new Error("User not signed in");
    return await SubjectService.fetchFollowingSubjects(
      SignedUserManager.user.user_id,
    );
  }
}
