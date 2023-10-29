import { EventContainer, Store, Supabase } from "common-app-module";
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

    const cachedFolloweeIds: Set<string> = new Set(
      Object.keys(this.store.getAll()),
    );
    for (const follow of data) {
      const followeeId = follow.followee_id;
      if (!cachedFolloweeIds.has(followeeId)) {
        this._follow(followeeId);
      }
      cachedFolloweeIds.delete(followeeId);
    }
    for (const unfolloweeId of cachedFolloweeIds) {
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
    const followed = this.isFollowing(userId);
    this._follow(userId);
    const { error } = await Supabase.client.from("follows").insert({
      followee_id: userId,
    });
    if (error) {
      if (!followed) this._unfollow(userId);
      throw error;
    }
  }

  private _unfollow(userId: string) {
    this.store.delete(userId);
    this.fireEvent("unfollow", userId);
  }

  public async unfollow(userId: string) {
    const followed = this.isFollowing(userId);
    this._unfollow(userId);
    const { error } = await Supabase.client.from("follows").delete().eq(
      "follower_id",
      SignedUserManager.userId,
    ).eq(
      "followee_id",
      userId,
    );
    if (error) {
      if (followed) this._follow(userId);
      throw error;
    }
  }

  public isFollowing(userId: string): boolean {
    return this.store.get(userId) === true;
  }
}

export default new FollowCacher();
