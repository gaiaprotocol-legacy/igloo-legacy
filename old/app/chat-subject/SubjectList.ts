import SubjectDetails from "../database-interface/SubjectDetails.js";
import UserDetailsCacher from "../user/UserDetailsCacher.js";
import UserService from "../user/UserService.js";
import ChatRoomList from "../chat/ChatRoomList.js";
import SubjectListItem from "./SubjectListItem.js";

export default abstract class SubjectList extends ChatRoomList {
  constructor(tag: string, emptyMessage: string) {
    super(tag + ".subject-list", emptyMessage);
  }

  protected addSubjectDetails(subjectDetails: SubjectDetails) {
    this.emptyMessageDisplay?.delete();
    this.append(new SubjectListItem(subjectDetails));
  }

  protected async fetchUsers(subjectDetailsSet: SubjectDetails[]) {
    const walletAddresses = subjectDetailsSet.map((s) => s.subject);
    const userDetailsSet = await UserService.fetchByWalletAddresses(
      walletAddresses,
    );
    UserDetailsCacher.cacheMultiple(userDetailsSet);
  }
}
