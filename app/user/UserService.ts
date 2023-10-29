import { Supabase } from "common-app-module";
import UserDetails, {
  UserDetailsSelectQuery,
} from "../database-interface/UserDetails.js";

class UserService {
  private static readonly LIMIT = 50;

  public async fetchById(userId: string): Promise<UserDetails> {
    const { data, error } = await Supabase.client.from("user_details").select(
      UserDetailsSelectQuery,
    )
      .eq(
        "user_id",
        userId,
      );
    if (error) throw error;
    return data[0] as any;
  }

  public async fetchByIds(userIds: string[]): Promise<UserDetails[]> {
    const { data, error } = await Supabase.client.from("user_details").select(
      UserDetailsSelectQuery,
    )
      .in(
        "user_id",
        userIds,
      );
    if (error) throw error;
    return data as any;
  }

  public async fetchByWalletAddresses(
    walletAddresses: string[],
  ): Promise<UserDetails[]> {
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

  public async fetchFollowers(
    userId: string,
    lastFetchedFollowedAt: string | undefined,
  ): Promise<{
    userDetailsSet: UserDetails[];
    lastFetchedFollowedAt: string | undefined;
  }> {
    const { data: followsData, error: followsError } = await Supabase.client
      .from("follows").select("follower_id, followed_at").eq(
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
      .from("follows").select("followee_id, followed_at").eq(
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

  public async fetchHoldings(walletAddress: string): Promise<UserDetails[]> {
    const { data: holderData, error: holderError } = await Supabase.client.from(
      "subject_key_holders",
    ).select().eq("wallet_address", walletAddress);
    if (holderError) throw holderError;
    const walletAddresses = holderData.map((holder) => holder.subject);
    return await this.fetchByWalletAddresses(walletAddresses);
  }

  public async fetchHolders(walletAddress: string): Promise<UserDetails[]> {
    const { data: holderData, error: holderError } = await Supabase.client.from(
      "subject_key_holders",
    ).select().eq("subject", walletAddress);
    if (holderError) throw holderError;
    const walletAddresses = holderData.map((holder) => holder.wallet_address);
    return await this.fetchByWalletAddresses(walletAddresses);
  }

  public async fetchNewUsers(): Promise<UserDetails[]> {
    const { data, error } = await Supabase.client.from("user_details").select(
      UserDetailsSelectQuery,
    )
      .order(
        "created_at",
        { ascending: false },
      ).limit(
        UserService.LIMIT,
      );
    if (error) throw error;
    return data as any;
  }

  public async fetchTopUsers(): Promise<UserDetails[]> {
    const { data: subjectData, error: subjectError } = await Supabase.client
      .from(
        "subject_details",
      ).select().order(
        "last_fetched_key_price",
        { ascending: false },
      ).limit(
        UserService.LIMIT,
      );
    if (subjectError) throw subjectError;
    const walletAddresses = subjectData.map((subject) => subject.subject);
    return await this.fetchByWalletAddresses(walletAddresses);
  }

  public async fetchTrendingUsers(): Promise<UserDetails[]> {
    const { data: subjectData, error: subjectError } = await Supabase.client
      .from(
        "subject_details",
      ).select().order(
        "last_key_purchased_at",
        { ascending: false },
      ).limit(
        UserService.LIMIT,
      );
    if (subjectError) throw subjectError;
    const walletAddresses = subjectData.map((subject) => subject.subject);
    return await this.fetchByWalletAddresses(walletAddresses);
  }
}

export default new UserService();
