import { Store } from "common-dapp-module";
import SubjectDetails from "../database-interface/SubjectDetails.js";
import SubjectList from "./SubjectList.js";

export default class HoldingSubjectList extends SubjectList {
  private store: Store = new Store("hoding-subject-list");

  constructor() {
    super(".holding-subject-list", "No holding subjects yet.");
    const cached = this.store.get<SubjectDetails[]>("cached-holding-subjects");
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
