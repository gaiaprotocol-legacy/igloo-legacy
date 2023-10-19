import { Store } from "common-dapp-module";
import SubjectDetails from "../database-interface/SubjectDetails.js";
import SubjectList from "./SubjectList.js";

export default class MySubjectList extends SubjectList {
  private store: Store = new Store("my-subject-list");

  constructor() {
    super(".my-subject-list", "No my subjects yet.");
    const cached = this.store.get<SubjectDetails[]>("cached-my-subjects");
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
