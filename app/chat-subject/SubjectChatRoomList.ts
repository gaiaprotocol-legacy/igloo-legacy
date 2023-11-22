import { ListLoadingBar } from "common-app-module";
import { SoFiUserPublic } from "sofi-module";
import ChatRoomList, { ChatRoomListOptions } from "../chat/ChatRoomList.js";
import Subject from "../database-interface/Subject.js";
import IglooUserService from "../user/IglooUserService.js";
import SubjectChatRoomListItem from "./SubjectChatRoomListItem.js";

export default abstract class SubjectChatRoomList extends ChatRoomList {
  constructor(tag: string, options: ChatRoomListOptions) {
    super(tag + ".subject-chat-room-list", options);

    const cachedSubject = this.store.get<Subject[]>("cached-subjects");
    const cachedSubjectOwners = this.store.get<SoFiUserPublic[]>(
      "cached-subject-owners",
    );

    if (cachedSubject && cachedSubject.length > 0 && cachedSubjectOwners) {
      for (const s of cachedSubject) {
        const owner = cachedSubjectOwners.find((o) =>
          o.wallet_address === s.subject
        );
        if (owner) this.append(new SubjectChatRoomListItem(s, owner));
      }
    } else {
      this.append(new ListLoadingBar());
    }

    this.refresh();
  }

  protected abstract fetchSubjects(): Promise<Subject[]>;

  private async refresh() {
    this.append(new ListLoadingBar());

    const subjects = await this.fetchSubjects();
    const subjectOwners = await IglooUserService.fetchByWalletAddresses(
      subjects.map((s) => s.subject),
    );

    this.store.set("cached-subjects", subjects, true);
    this.store.set("cached-subject-owners", subjectOwners, true);

    if (!this.deleted) {
      this.empty();
      for (const s of subjects) {
        const owner = subjectOwners.find((o) => o.wallet_address === s.subject);
        if (owner) this.append(new SubjectChatRoomListItem(s, owner));
      }
    }
  }
}
