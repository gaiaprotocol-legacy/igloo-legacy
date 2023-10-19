import { Supabase } from "common-dapp-module";
import UserDetails, {
  UserDetailsSelectQuery,
} from "../database-interface/UserDetails.js";

class UserService {
  private static readonly LIMIT = 50;

  public async fetchFollowers(
    userId: string,
    lastFetchedFollowedAt: string | undefined,
  ): Promise<{
    userDetailsSet: UserDetails[];
    lastFetchedFollowedAt: string | undefined;
  }> {
    const { data: followsData, error: followsError } = await Supabase.client
      .from("follows").select().eq(
        "followee_id",
        userId,
      ).lt(
        "followed_at",
        lastFetchedFollowedAt ?? "infinity",
      ).order(
        "followed_at",
        { ascending: false },
      ).limit(
        UserService.LIMIT,
      );
    if (followsError) throw followsError;

    const { data: userDetails, error: userDetailsError } = await Supabase
      .client
      .from("user_details").select(UserDetailsSelectQuery).in(
        "user_id",
        followsData.map((follow) => follow.follower_id),
      );
    if (userDetailsError) throw userDetailsError;

    return {
      userDetailsSet: userDetails as any,
      lastFetchedFollowedAt: followsData[followsData.length - 1]?.followed_at,
    };
  }

  public async fetchFollowing(
    userId: string,
    lastFetchedFollowedAt: string | undefined,
  ): Promise<{
    userDetailsSet: UserDetails[];
    lastFetchedFollowedAt: string | undefined;
  }> {
    const { data: followsData, error: followsError } = await Supabase.client
      .from("follows").select().eq(
        "follower_id",
        userId,
      ).lt(
        "followed_at",
        lastFetchedFollowedAt ?? "infinity",
      ).order(
        "followed_at",
        { ascending: false },
      ).limit(
        UserService.LIMIT,
      );
    if (followsError) throw followsError;

    const { data: userDetails, error: userDetailsError } = await Supabase
      .client
      .from("user_details").select(UserDetailsSelectQuery).in(
        "user_id",
        followsData.map((follow) => follow.followee_id),
      );
    if (userDetailsError) throw userDetailsError;

    return {
      userDetailsSet: userDetails as any,
      lastFetchedFollowedAt: followsData[followsData.length - 1]?.followed_at,
    };
  }

  public async fetchByWalletAddresses(walletAddresses: string[]): Promise<UserDetails[]> {
    const { data, error } = await Supabase.client.from("user_details").select(
      UserDetailsSelectQuery,
    )
      .in(
        "wallet_address",
        walletAddresses,
      );
    if (error) throw error;
    return data as any;
  }
}

export default new UserService();
