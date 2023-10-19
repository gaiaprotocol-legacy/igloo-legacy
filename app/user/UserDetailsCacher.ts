import { EventContainer, Store, Supabase } from "common-dapp-module";
import UserDetails, {
  DefaultUserDetails,
  isEqualUserDetails,
  UserDetailsSelectQuery,
} from "../database-interface/UserDetails.js";

class UserDetailsCacher extends EventContainer {
  private store: Store = new Store("cached-user-details");

  constructor() {
    super();
    this.addAllowedEvents("update");
  }

  public init() {
    Supabase.client.channel("user-details-changes").on("postgres_changes", {
      event: "*",
      schema: "public",
      table: "user_details",
    }, (payload) => {
      if (payload.eventType === "INSERT" || payload.eventType === "UPDATE") {
        this.refresh(payload.new.user_id);
      }
    }).subscribe();
  }

  public cache(userId: string, userDetails: UserDetails) {
    if (!isEqualUserDetails(userDetails, this.get(userId))) {
      this.store.set(userId, userDetails, true);
      this.fireEvent("update", userDetails);
    }
  }

  public get(userId: string): UserDetails {
    const cached = this.store.get<UserDetails>(userId);
    return cached ? cached : { ...DefaultUserDetails, user_id: userId };
  }

  public async refresh(userId: string) {
    const { data, error } = await Supabase.client.from("user_details").select(
      UserDetailsSelectQuery,
    ).eq("user_id", userId);
    if (error) throw error;
    const userDetails: UserDetails | undefined = data?.[0] as any;
    if (userDetails && !isEqualUserDetails(userDetails, this.get(userId))) {
      this.cache(userId, userDetails);
    }
  }

  public getAndRefresh(userId: string): UserDetails {
    const cached = this.get(userId);
    this.refresh(userId).catch((error) =>
      console.error("Error refreshing user details:", error)
    );
    return cached;
  }

  public getByXUsername(xUsername: string) {
    const cached = Object.values(this.store.getAll<UserDetails>()).find(
      (userDetails) => userDetails.x_username === xUsername,
    );
    return cached ? cached : { ...DefaultUserDetails, x_username: xUsername };
  }

  public async refreshByXUsername(xUsername: string) {
    const { data, error } = await Supabase.client.from("user_details").select(
      UserDetailsSelectQuery,
    ).eq("x_username", xUsername);
    if (error) throw error;
    const userDetails: UserDetails | undefined = data?.[0] as any;
    if (userDetails) {
      if (!isEqualUserDetails(userDetails, this.getByXUsername(xUsername))) {
        this.cache(userDetails.user_id, userDetails);
      }
    }
  }

  public getAndRefreshByXUsername(xUsername: string) {
    const cachedValue = this.getByXUsername(xUsername);
    this.refreshByXUsername(xUsername).catch((error) =>
      console.error("Error refreshing user details:", error)
    );
    return cachedValue;
  }

  public getByWalletAddress(walletAddress: string) {
    const cached = Object.values(this.store.getAll<UserDetails>()).find(
      (userDetails) => userDetails.wallet_address === walletAddress,
    );
    return cached
      ? cached
      : { ...DefaultUserDetails, wallet_address: walletAddress };
  }

  public async refreshByWalletAddress(walletAddress: string) {
    const { data, error } = await Supabase.client.from("user_details").select(
      UserDetailsSelectQuery,
    ).eq("wallet_address", walletAddress);
    if (error) throw error;
    const userDetails: UserDetails | undefined = data?.[0] as any;
    if (userDetails) {
      if (
        !isEqualUserDetails(userDetails, this.getByWalletAddress(walletAddress))
      ) {
        this.cache(userDetails.user_id, userDetails);
      }
    }
  }

  public getAndRefreshByWalletAddress(walletAddress: string) {
    const cached = this.getByWalletAddress(walletAddress);
    this.refreshByWalletAddress(walletAddress).catch((error) =>
      console.error("Error refreshing user details:", error)
    );
    return cached;
  }

  public cacheMultiple(userDetailsSet: UserDetails[]) {
    for (const userDetails of userDetailsSet) {
      this.cache(userDetails.user_id, userDetails);
    }
  }
}

export default new UserDetailsCacher();
