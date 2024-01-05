import { msg } from "@common-module/app";
import { SoFiUserPublic } from "@common-module/social";
import Subject from "../database-interface/Subject.js";
import SubjectService from "../subject/SubjectService.js";
import IglooSignedUserManager from "../user/IglooSignedUserManager.js";
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
    if (!IglooSignedUserManager.user) throw new Error("User not signed in");
    return await SubjectService.fetchFollowingSubjects(
      IglooSignedUserManager.user.user_id,
    );
  }
}
