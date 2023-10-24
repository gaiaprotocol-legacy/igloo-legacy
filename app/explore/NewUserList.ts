import { Store } from "common-dapp-module";
import UserDetails from "../database-interface/UserDetails.js";
import UserDetailsCacher from "../user/UserDetailsCacher.js";
import UserService from "../user/UserService.js";
import UserList from "../user/UsetList.js";

export default class NewUserList extends UserList {
  private store: Store = new Store("new-user-list");
  private isContentFromCache: boolean = true;

  constructor() {
    super(".new-user-list", "No users yet");

    const cachedUserDetails = this.store.get<UserDetails[]>("cached-users");
    if (cachedUserDetails) {
      for (const userDetails of cachedUserDetails) {
        this.addUserDetails(userDetails);
      }
    }
  }

  protected async fetchContent() {
    const userDetailsSet = await UserService.fetchNewUsers();
    UserDetailsCacher.cacheMultiple(userDetailsSet);

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
