import { Store } from "common-app-module";
import SubjectDetails from "../database-interface/SubjectDetails.js";
import SubjectDetailsCacher from "../subject/SubjectDetailsCacher.js";
import SubjectService from "../subject/SubjectService.js";
import SignedUserManager from "../user/SignedUserManager.js";
import SubjectList from "./SubjectList.js";

export default class MySubjectList extends SubjectList {
  private store: Store = new Store("my-subject-list");

  constructor() {
    super(".my-subject-list", "No my subjects yet.");
    if (
      SignedUserManager.walletAddress &&
      SignedUserManager.walletAddress ===
        this.store.get<string>("cached-wallet-address")
    ) {
      const cached = this.store.get<SubjectDetails[]>("cached-my-subjects");
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

      const cached = await SubjectService.fetchSubject(
        SignedUserManager.walletAddress,
      );
      if (cached) {
        this.store.set("cached-my-subjects", [cached], true);
        SubjectDetailsCacher.cache(cached);

        await this.fetchUsers([cached]);

        if (!this.deleted) {
          this.empty();
          this.addSubjectDetails(cached);
        }
      }
    }
  }
}
