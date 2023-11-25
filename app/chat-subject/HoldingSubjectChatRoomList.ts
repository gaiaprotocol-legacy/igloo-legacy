import { msg } from "common-app-module";
import { SoFiUserPublic } from "sofi-module";
import Subject from "../database-interface/Subject.js";
import SubjectService from "../subject/SubjectService.js";
import IglooSignedUserManager from "../user/IglooSignedUserManager.js";
import SubjectChatRoomList from "./SubjectChatRoomList.js";

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
    if (!IglooSignedUserManager.user) throw new Error("User not signed in");
    if (!IglooSignedUserManager.user.wallet_address) {
      throw new Error("User does not have a wallet address");
    }
    return await SubjectService.fetchKeyHeldSubjects(
      IglooSignedUserManager.user.user_id,
      IglooSignedUserManager.user.wallet_address,
    );
  }
}
