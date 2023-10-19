import SubjectDetails from "../database-interface/SubjectDetails.js";
import ChatRoomListItem from "./ChatRoomListItem.js";

export default class SubjectListItem extends ChatRoomListItem {
  constructor(subjectDetails: SubjectDetails) {
    super(".subject-list-item");
  }
}
