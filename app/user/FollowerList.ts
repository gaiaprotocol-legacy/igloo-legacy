import { Store } from "common-dapp-module";
import UserDetails from "../database-interface/UserDetails.js";
import UserDetailsCacher from "./UserDetailsCacher.js";
import UserService from "./UserService.js";
import UserList from "./UsetList.js";

export default class FollowerList extends UserList {
  private store: Store = new Store("follower-list");
  private isContentFromCache: boolean = true;
  private lastFetchedFollowedAt: string | undefined;

  constructor(private userId: string) {
    super(".follower-list", "No followers yet");
    this.store = new Store(`user-${userId}-follower-list`);

    const cachedUserDetails = this.store.get<UserDetails[]>("cached-followers");
    if (cachedUserDetails) {
      for (const userDetail of cachedUserDetails) {
        this.addUserDetails(userDetail);
      }
    }
  }

  protected async fetchContent() {
    const result = await UserService.fetchFollowers(
      this.userId,
      this.lastFetchedFollowedAt,
    );
    UserDetailsCacher.cacheMultiple(result.userDetailsSet);
    this.lastFetchedFollowedAt = result.lastFetchedFollowedAt;

    if (this.isContentFromCache) {
      this.isContentFromCache = false;
      this.store.set("cached-followers", result.userDetailsSet, true);
      if (!this.deleted) this.empty();
    }

    if (!this.deleted) {
      for (const userDetails of result.userDetailsSet) {
        this.addUserDetails(userDetails);
      }
    }
  }
}
