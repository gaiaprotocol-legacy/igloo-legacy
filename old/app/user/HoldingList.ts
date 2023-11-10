import { Store } from "common-app-module";
import UserDetails from "../database-interface/UserDetails.js";
import UserDetailsCacher from "./UserDetailsCacher.js";
import UserService from "./UserService.js";
import UserList from "./UsetList.js";

export default class HoldingList extends UserList {
  private store: Store;
  private isContentFromCache: boolean = true;

  constructor(private walletAddress: string) {
    super(".holding-list", "No holdings");
    this.store = new Store(`subject-${walletAddress}-holding-list`);

    const cachedUserDetails = this.store.get<UserDetails[]>("cached-holdings");
    if (cachedUserDetails) {
      for (const userDetails of cachedUserDetails) {
        this.addUserDetails(userDetails);
      }
    }
  }

  protected async fetchContent() {
    const userDetailsSet = await UserService.fetchHoldings(this.walletAddress);
    UserDetailsCacher.cacheMultiple(userDetailsSet);

    if (this.isContentFromCache) {
      this.isContentFromCache = false;
      this.store.set("cached-holdings", userDetailsSet, true);
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
