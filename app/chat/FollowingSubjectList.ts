import SubjectList from "./SubjectList.js";

export default class FollowingSubjectList extends SubjectList {
  constructor() {
    super(".following-subject-list", "No following subjects yet.");
  }

  protected fetchContent(): void {
    //TODO:
  }
}
