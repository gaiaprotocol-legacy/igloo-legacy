import { Store } from "@common-module/app";
import SubjectDetails from "../database-interface/SubjectDetails.js";
import SubjectDetailsCacher from "../subject/SubjectDetailsCacher.js";
import SubjectService from "../subject/SubjectService.js";
import SignedUserManager from "../user/SignedUserManager.js";
import SubjectList from "./SubjectList.js";

export default class FollowingSubjectList extends SubjectList {
  private store: Store = new Store("following-subject-list");

  constructor() {
    super(".following-subject-list", "No following subjects yet.");
    if (
      SignedUserManager.userId &&
      SignedUserManager.userId === this.store.get<string>("cached-user-id")
    ) {
      const cached = this.store.get<SubjectDetails[]>(
        "cached-following-subjects",
      );
      if (cached) {
        for (const subjectDetails of cached) {
          this.addSubjectDetails(subjectDetails);
        }
      }
    }
    this.fetchSubjects();
  }

  private async fetchSubjects() {
    if (SignedUserManager.userId) {
      this.store.set(
        "cached-user-id",
        SignedUserManager.userId,
        true,
      );

      const cached = await SubjectService.fetchFollowingSubjects(
        SignedUserManager.userId,
      );
      this.store.set("cached-following-subjects", cached, true);
      SubjectDetailsCacher.cacheMultiple(cached);

      await this.fetchUsers(cached);

      if (!this.deleted) {
        this.empty();
        if (cached.length === 0) {
          this.showEmptyMessage();
        } else {
          for (const subjectDetails of cached) {
            this.addSubjectDetails(subjectDetails);
          }
        }
      }
    }
  }
}
