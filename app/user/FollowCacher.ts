import { EventContainer, Store, Supabase } from "common-dapp-module";
import SignedUserManager from "./SignedUserManager.js";

class FollowCacher extends EventContainer {
  private store: Store = new Store("cached-follows");

  constructor() {
    super();
    this.addAllowedEvents("update");
  }

  public async fetchSignedUserFollowsOnInit() {
    const { data, error } = await Supabase.client.from("follows").select().eq(
      "follower_id",
      SignedUserManager.userId,
    );
    if (error) throw error;
    //TODO:
    console.log(data);
  }
}

export default new FollowCacher();
