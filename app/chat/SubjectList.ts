import SubjectDetails from "../database-interface/SubjectDetails.js";
import ChatRoomList from "./ChatRoomList.js";
import SubjectListItem from "./SubjectListItem.js";

export default abstract class SubjectList extends ChatRoomList {
  constructor(tag: string, emptyMessage: string) {
    super(tag + ".subject-list", emptyMessage);
  }

  protected addSubjectDetails(subjectDetails: SubjectDetails) {
    this.emptyMessageDisplay?.delete();
    this.append(new SubjectListItem(subjectDetails));
  }
}
