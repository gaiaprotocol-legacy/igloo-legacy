import { Store } from "common-app-module";
import UserDetails from "../database-interface/UserDetails.js";
import UserDetailsCacher from "./UserDetailsCacher.js";
import UserService from "./UserService.js";
import UserList from "./UsetList.js";

export default class FollowingList extends UserList {
  private store: Store;
  private isContentFromCache: boolean = true;
  private lastFetchedFollowedAt: string | undefined;

  constructor(private userId: string) {
    super(".following-list", "Not following anyone yet");
    this.store = new Store(`user-${userId}-following-list`);

    const cachedUserDetails = this.store.get<UserDetails[]>("cached-following");
    if (cachedUserDetails) {
      for (const userDetails of cachedUserDetails) {
        this.addUserDetails(userDetails);
      }
    }
  }

  protected async fetchContent() {
    const result = await UserService.fetchFollowing(
      this.userId,
      this.lastFetchedFollowedAt,
    );
    UserDetailsCacher.cacheMultiple(result.userDetailsSet);
    this.lastFetchedFollowedAt = result.lastFetchedFollowedAt;

    if (this.isContentFromCache) {
      this.isContentFromCache = false;
      this.store.set("cached-following", result.userDetailsSet, true);
      if (!this.deleted) this.empty();
    }

    if (!this.deleted) {
      if (result.userDetailsSet.length === 0) {
        this.showEmptyMessage();
      } else {
        for (const userDetails of result.userDetailsSet) {
          this.addUserDetails(userDetails);
        }
      }
    }
  }
}
