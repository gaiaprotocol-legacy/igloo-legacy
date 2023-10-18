import SubjectList from "./SubjectList.js";

export default class GeneralSubjectList extends SubjectList {
  constructor() {
    super(".general-subject-list", "No general subjects yet.");
  }

  protected fetchContent(): void {
    //TODO:
  }
}
