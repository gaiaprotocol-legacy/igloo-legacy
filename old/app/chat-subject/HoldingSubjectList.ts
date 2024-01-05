import { Store } from "@common-module/app";
import SubjectDetails from "../database-interface/SubjectDetails.js";
import SubjectDetailsCacher from "../subject/SubjectDetailsCacher.js";
import SubjectService from "../subject/SubjectService.js";
import SignedUserManager from "../user/SignedUserManager.js";
import SubjectList from "./SubjectList.js";

export default class HoldingSubjectList extends SubjectList {
  private store: Store = new Store("hoding-subject-list");

  constructor() {
    super(".holding-subject-list", "No holding subjects yet.");
    if (
      SignedUserManager.walletAddress &&
      SignedUserManager.walletAddress ===
        this.store.get<string>("cached-wallet-address")
    ) {
      const cached = this.store.get<SubjectDetails[]>(
        "cached-holding-subjects",
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
    if (SignedUserManager.walletAddress) {
      this.store.set(
        "cached-wallet-address",
        SignedUserManager.walletAddress,
        true,
      );

      const cached = await SubjectService.fetchHoldingSubjects(
        SignedUserManager.walletAddress,
      );
      this.store.set("cached-holding-subjects", cached, true);
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
