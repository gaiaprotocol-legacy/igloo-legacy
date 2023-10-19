import { Store } from "common-dapp-module";
import SubjectDetails from "../database-interface/SubjectDetails.js";
import SubjectList from "./SubjectList.js";

export default class FollowingSubjectList extends SubjectList {
  private store: Store = new Store("following-subject-list");

  constructor() {
    super(".following-subject-list", "No following subjects yet.");
    const cached = this.store.get<SubjectDetails[]>(
      "cached-following-subjects",
    );
    if (cached) {
      for (const subjectDetails of cached) {
        this.addSubjectDetails(subjectDetails);
      }
    }
    this.fetchSubjects();
  }

  private async fetchSubjects() {
    //TODO:
  }
}
