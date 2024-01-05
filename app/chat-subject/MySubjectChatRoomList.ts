import { msg } from "@common-module/app";
import { SoFiUserPublic } from "@common-module/social";
import Subject from "../database-interface/Subject.js";
import SubjectService from "../subject/SubjectService.js";
import IglooSignedUserManager from "../user/IglooSignedUserManager.js";
import SubjectChatRoomList from "./SubjectChatRoomList.js";

export default class MySubjectChatRoomList extends SubjectChatRoomList {
  constructor() {
    super(".my-subject-chat-room-list", {
      storeName: "my-subject-chat-rooms",
      emptyMessage: msg("my-subject-chat-room-list-empty-message"),
    });
  }

  protected async fetchSubjects(): Promise<
    { subjects: Subject[]; owners: SoFiUserPublic[] }
  > {
    const walletAddress = IglooSignedUserManager.user?.wallet_address;
    if (walletAddress) {
      const subject = await SubjectService.fetchSubject(walletAddress);
      return subject
        ? { subjects: [subject], owners: [IglooSignedUserManager.user!] }
        : { subjects: [], owners: [] };
    } else {
      return { subjects: [], owners: [] };
    }
  }
}
