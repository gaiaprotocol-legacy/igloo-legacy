import { EventContainer, Store, Supabase } from "@common-module/app";
import { TempUserPublicCacher } from "@common-module/social";
import UserDetails, {
  DefaultUserDetails,
  UserDetailsSelectQuery,
  isEqualUserDetails,
} from "../database-interface/UserDetails.js";

class UserDetailsCacher extends EventContainer {
  private store: Store = new Store("cached-user-details-v2");
  private storeXUsernameToUserId: Store = new Store(
    "cached-x-username-to-user-id",
  );
  private storeWalletAddressToUserId: Store = new Store(
    "cached-wallet-address-to-user-id",
  );

  constructor() {
    super();
    this.addAllowedEvents("update");
  }

  public init() {
    Supabase.client.channel("user-details-changes").on("postgres_changes", {
      event: "*",
      schema: "public",
      table: "users_public",
    }, (payload) => {
      if (payload.eventType === "INSERT" || payload.eventType === "UPDATE") {
        this.refresh(payload.new.user_id);
      }
    }).subscribe();
  }

  public cache(userId: string, userDetails: UserDetails) {
    TempUserPublicCacher.cache(userDetails);
    if (!isEqualUserDetails(userDetails, this.get(userId))) {
      this.store.set(userId, userDetails, true);
      if (userDetails.x_username) {
        this.storeXUsernameToUserId.set(
          userDetails.x_username,
          userId,
          true,
        );
      }
      if (userDetails.wallet_address) {
        this.storeWalletAddressToUserId.set(
          userDetails.wallet_address,
          userId,
          true,
        );
      }
      this.fireEvent("update", userDetails);
    }
  }

  public get(userId: string): UserDetails {
    const cached = this.store.get<UserDetails>(userId);
    return cached ? cached : { ...DefaultUserDetails, user_id: userId };
  }

  public async refresh(userId: string) {
    const { data, error } = await Supabase.client.from("users_public").select(
      UserDetailsSelectQuery,
    ).eq("user_id", userId);
    if (error) throw error;
    const userDetails: UserDetails | undefined = data?.[0] as any;
    if (userDetails) TempUserPublicCacher.cache(userDetails);
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
    const userId = this.storeXUsernameToUserId.get<string>(xUsername);
    const cached = userId ? this.get(userId) : undefined;
    return cached ? cached : { ...DefaultUserDetails, x_username: xUsername };
  }

  public async refreshByXUsername(xUsername: string) {
    const { data, error } = await Supabase.client.from("users_public").select(
      UserDetailsSelectQuery,
    ).eq("x_username", xUsername);
    if (error) throw error;
    const userDetails: UserDetails | undefined = data?.[0] as any;
    if (userDetails) {
      TempUserPublicCacher.cache(userDetails);
      if (!isEqualUserDetails(userDetails, this.getByXUsername(xUsername))) {
        this.cache(userDetails.user_id, userDetails);
      }
    }
    return userDetails
      ? userDetails
      : { ...DefaultUserDetails, x_username: xUsername };
  }

  public getAndRefreshByXUsername(xUsername: string) {
    const cachedValue = this.getByXUsername(xUsername);
    this.refreshByXUsername(xUsername).catch((error) =>
      console.error("Error refreshing user details:", error)
    );
    return cachedValue;
  }

  public getByWalletAddress(walletAddress: string) {
    const userId = this.storeWalletAddressToUserId.get<string>(walletAddress);
    const cached = userId ? this.get(userId) : undefined;
    return cached
      ? cached
      : { ...DefaultUserDetails, wallet_address: walletAddress };
  }

  public async refreshByWalletAddress(walletAddress: string) {
    const { data, error } = await Supabase.client.from("users_public").select(
      UserDetailsSelectQuery,
    ).eq("wallet_address", walletAddress);
    if (error) throw error;
    const userDetails: UserDetails | undefined = data?.[0] as any;
    if (userDetails) {
      TempUserPublicCacher.cache(userDetails);
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
      TempUserPublicCacher.cache(userDetails);
      this.cache(userDetails.user_id, userDetails);
    }
  }
}

export default new UserDetailsCacher();
