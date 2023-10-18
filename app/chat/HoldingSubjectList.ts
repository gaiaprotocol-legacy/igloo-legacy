import SubjectList from "./SubjectList.js";

export default class HoldingSubjectList extends SubjectList {
  constructor() {
    super(".holding-subject-list", "No holding subjects yet.");
  }

  protected fetchContent(): void {
    //TODO:
  }
}
