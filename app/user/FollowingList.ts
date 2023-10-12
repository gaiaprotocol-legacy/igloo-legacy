import { Store } from "common-dapp-module";
import UserDetails from "../database-interface/UserDetails.js";
import UserList from "./UsetList.js";

export default class FollowingList extends UserList {
  private store: Store = new Store("following-list");
  private isContentFromCache: boolean = true;

  constructor(private userId: string) {
    super(".following-list");

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
    //TODO:
  }
}
