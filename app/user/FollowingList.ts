import { Store } from "common-dapp-module";
import UserDetails from "../database-interface/UserDetails.js";
import UserDetailsCacher from "./UserDetailsCacher.js";
import UserService from "./UserService.js";
import UserList from "./UsetList.js";

export default class FollowingList extends UserList {
  private store: Store = new Store("following-list");
  private isContentFromCache: boolean = true;
  private lastFetchedFollowedAt: string | undefined;

  constructor(private userId: string) {
    super(".following-list", "Not following anyone yet");

    const cachedUserDetails = this.store.get<UserDetails[]>(
      `user-${userId}-cached-following`,
    );
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
    UserDetailsCacher.cacheUserDetails(result.userDetailsSet);
    this.lastFetchedFollowedAt = result.lastFetchedFollowedAt;

    if (this.isContentFromCache) {
      this.isContentFromCache = false;
      this.store.set(
        `user-${this.userId}-cached-following`,
        result.userDetailsSet,
        true,
      );
      if (!this.deleted) this.empty();
    }

    if (!this.deleted) {
      for (const userDetails of result.userDetailsSet) {
        this.addUserDetails(userDetails);
      }
    }
  }
}
