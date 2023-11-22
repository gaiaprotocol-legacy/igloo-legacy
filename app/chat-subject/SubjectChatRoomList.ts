import { ListLoadingBar } from "common-app-module";
import { SoFiUserPublic } from "sofi-module";
import ChatRoomList, { ChatRoomListOptions } from "../chat/ChatRoomList.js";
import Subject from "../database-interface/Subject.js";

export default abstract class SubjectChatRoomList extends ChatRoomList {
  constructor(tag: string, options: ChatRoomListOptions) {
    super(tag + ".subject-chat-room-list", options);

    const cachedSubject = this.store.get<Subject[]>("cached-subjects");
    const cachedSubjectOwners = this.store.get<SoFiUserPublic[]>(
      "cached-subject-owners",
    );

    if (cachedSubject && cachedSubject.length > 0) {
      for (const s of cachedSubject) {
        //TODO:
      }
    } else {
      this.append(new ListLoadingBar());
    }
  }
}
