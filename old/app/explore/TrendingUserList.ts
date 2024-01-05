import { Store } from "@common-module/app";
import UserDetails from "../database-interface/UserDetails.js";
import SubjectDetailsCacher from "../subject/SubjectDetailsCacher.js";
import SubjectService from "../subject/SubjectService.js";
import UserDetailsCacher from "../user/UserDetailsCacher.js";
import UserService from "../user/UserService.js";
import UserList from "../user/UsetList.js";

export default class TrendingUserList extends UserList {
  private isContentFromCache: boolean = true;
  private store: Store = new Store("trending-user-list");

  constructor() {
    super(".trending-user-list", "No users yet");

    const cachedUserDetails = this.store.get<UserDetails[]>("cached-users");
    if (cachedUserDetails) {
      for (const userDetails of cachedUserDetails) {
        this.addUserDetails(userDetails);
      }
    }
  }

  protected async fetchContent() {
    const userDetailsSet = await UserService.fetchTrendingUsers();
    UserDetailsCacher.cacheMultiple(userDetailsSet);

    const subjects: string[] = [];
    for (const userDetails of userDetailsSet) {
      if (userDetails.wallet_address) {
        subjects.push(userDetails.wallet_address);
      }
    }
    const subjectDetailsSet = await SubjectService.fetchSubjects(subjects);
    SubjectDetailsCacher.cacheMultiple(subjectDetailsSet);

    if (this.isContentFromCache) {
      this.isContentFromCache = false;
      this.store.set("cached-users", userDetailsSet, true);
      if (!this.deleted) this.empty();
    }

    if (!this.deleted) {
      if (userDetailsSet.length === 0) {
        this.showEmptyMessage();
      } else {
        for (const userDetails of userDetailsSet) {
          this.addUserDetails(userDetails);
        }
      }
    }
  }
}
