import { ListLoadingBar } from "@common-module/app";
import { SoFiUserPublic } from "@common-module/social";
import ChatRoomList, { ChatRoomListOptions } from "../chat/ChatRoomList.js";
import Subject from "../database-interface/Subject.js";
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

  protected abstract fetchSubjects(): Promise<
    { subjects: Subject[]; owners: SoFiUserPublic[] }
  >;

  private async refresh() {
    this.append(new ListLoadingBar());

    const { subjects, owners } = await this.fetchSubjects();

    this.store.set("cached-subjects", subjects, true);
    this.store.set("cached-subject-owners", owners, true);

    if (!this.deleted) {
      this.empty();
      for (const s of subjects) {
        const owner = owners.find((o) => o.wallet_address === s.subject);
        if (owner) this.append(new SubjectChatRoomListItem(s, owner));
      }
    }
  }
}
