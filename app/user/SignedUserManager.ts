import { User } from "@supabase/supabase-js";
import { EventContainer, Supabase } from "common-dapp-module";
import EnvironmentManager from "../EnvironmentManager.js";
import FollowCacher from "./FollowManager.js";

class SignedUserManager extends EventContainer {
  public user: User | undefined;

  public get userId() {
    return this.user?.id;
  }

  public get name() {
    return this.user?.user_metadata.full_name;
  }

  public get xUsername() {
    if (this.user?.app_metadata.provider === "twitter") {
      return this.user.user_metadata.user_name;
    }
  }

  public get avatarUrl() {
    return this.user?.user_metadata.avatar_url;
  }

  public get signed() {
    return this.user !== undefined;
  }

  public get walletAddress() {
    if (this.user) {
      return undefined;
      //return UserDetailsCacher.get(this.user.id).wallet_address;
    }
  }

  public get walletConnected() {
    return this.walletAddress !== undefined;
  }

  constructor() {
    super();
    this.addAllowedEvents("userFetched");
  }

  public async fetchUserOnInit() {
    const { data, error } = await Supabase.client.auth.getSession();
    if (error) throw error;
    this.user = data?.session?.user;
    if (this.user) {
      this.fireEvent("userFetched");
      /*this.onDelegate(UserDetailsCacher, "update", (userDetails) => {
        if (userDetails.user_id === this.user?.id) {
          this.fireEvent("userFetched");
        }
      });
      UserDetailsCacher.refresh(this.user.id);*/

      FollowCacher.fetchSignedUserFollows();
    }
  }

  public async signIn() {
    await Supabase.client.auth.signInWithOAuth({
      provider: "twitter",
      options: EnvironmentManager.dev
        ? { redirectTo: "http://localhost:8413/" }
        : undefined,
    });
  }

  public connectWallet() {
    //new LinkWalletPopup();
  }

  public async signOut() {
    const { error } = await Supabase.client.auth.signOut();
    if (error) throw error;
    FollowCacher.clearCache();
    location.reload();
  }
}

export default new SignedUserManager();
