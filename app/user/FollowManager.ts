import { EventContainer, Store, Supabase } from "common-dapp-module";
import SignedUserManager from "./SignedUserManager.js";

class FollowCacher extends EventContainer {
  private store: Store = new Store("cached-follows");

  constructor() {
    super();
    this.addAllowedEvents("follow", "unfollow");
  }

  public async fetchSignedUserFollows() {
    const { data, error } = await Supabase.client.from("follows").select().eq(
      "follower_id",
      SignedUserManager.userId,
    );
    if (error) throw error;

    const cachedFollows: Set<string> = new Set(
      Object.keys(this.store.getAll()),
    );
    for (const follow of data) {
      const followeeId = follow.followee_id;
      if (!cachedFollows.has(followeeId)) {
        this._follow(followeeId);
      }
      cachedFollows.delete(followeeId);
    }
    for (const unfolloweeId of cachedFollows) {
      this._unfollow(unfolloweeId);
    }
  }

  public clearCache() {
    this.store.clear();
  }

  private _follow(userId: string) {
    this.store.set(userId, true);
    this.fireEvent("follow", userId);
  }

  public async follow(userId: string) {
    this._follow(userId);
    const { error } = await Supabase.client.from("follows").insert({
      followee_id: userId,
    });
    if (error) throw error;
  }

  private _unfollow(userId: string) {
    this.store.delete(userId);
    this.fireEvent("unfollow", userId);
  }

  public async unfollow(userId: string) {
    this._unfollow(userId);
    const { error } = await Supabase.client.from("follows").delete().eq(
      "follower_id",
      SignedUserManager.userId,
    ).eq(
      "followee_id",
      userId,
    );
    if (error) throw error;
  }

  public isFollowing(userId: string): boolean {
    return this.store.get(userId) === true;
  }
}

export default new FollowCacher();
