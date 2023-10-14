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

  private cache(id: string, userDetails: UserDetails) {
    if (!isEqualUserDetails(userDetails, this.get(id))) {
      this.store.set(id, userDetails, true);
      this.fireEvent("update", userDetails);
    }
  }

  public get(userId: string): UserDetails {
    const cached = this.store.get<UserDetails>(userId);
    if (cached) {
      return cached;
    } else {
      return { ...DefaultUserDetails, user_id: userId };
    }
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
    const cachedValue = this.get(userId);
    this.refresh(userId).catch((error) =>
      console.error("Error refreshing user details:", error)
    );
    return cachedValue;
  }

  public getByXUsername(xUsername: string) {
    return Object.values(this.store.getAll<UserDetails>()).find(
      (userDetails) => userDetails.x_username === xUsername,
    );
  }

  public async refreshByXUsername(xUsername: string) {
    const { data, error } = await Supabase.client.from("user_details").select(
      UserDetailsSelectQuery,
    ).eq("x_username", xUsername);
    if (error) throw error;
    const userDetails: UserDetails | undefined = data?.[0] as any;
    if (userDetails) {
      const cached = this.getByXUsername(xUsername);
      if (!cached || !isEqualUserDetails(userDetails, cached)) {
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
}

export default new UserDetailsCacher();
