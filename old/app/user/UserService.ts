import { Supabase } from "@common-module/app";
import { SubjectDetailsSelectQuery } from "../database-interface/SubjectDetails.js";
import UserDetails, {
  UserDetailsSelectQuery,
} from "../database-interface/UserDetails.js";
import SubjectDetailsCacher from "../subject/SubjectDetailsCacher.js";

class UserService {
  private static readonly LIMIT = 50;

  public async fetchById(userId: string): Promise<UserDetails> {
    const { data, error } = await Supabase.client.from("users_public").select(
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
    const { data, error } = await Supabase.client.from("users_public").select(
      UserDetailsSelectQuery,
    )
      .in(
        "user_id",
        userIds,
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
      .from("users_public").select(UserDetailsSelectQuery).in(
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
      .from("users_public").select(UserDetailsSelectQuery).in(
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
    ).select().eq("wallet_address", walletAddress).gt(
      "last_fetched_balance",
      0,
    );
    if (holderError) throw holderError;
    const walletAddresses = holderData.map((holder) => holder.subject);
    return await this.fetchByWalletAddresses(walletAddresses);
  }

  public async fetchHolders(walletAddress: string): Promise<UserDetails[]> {
    const { data: holderData, error: holderError } = await Supabase.client.from(
      "subject_key_holders",
    ).select().eq("subject", walletAddress).gt("last_fetched_balance", 0);
    if (holderError) throw holderError;
    const walletAddresses = holderData.map((holder) => holder.wallet_address);
    return await this.fetchByWalletAddresses(walletAddresses);
  }

  public async fetchNewUsers(): Promise<UserDetails[]> {
    const { data, error } = await Supabase.client.from("users_public").select(
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
      ).select(SubjectDetailsSelectQuery).order(
        "last_fetched_key_price",
        { ascending: false },
      ).limit(
        UserService.LIMIT,
      ) as any;
    if (subjectError) throw subjectError;

    SubjectDetailsCacher.cacheMultiple(subjectData);

    const walletAddresses = subjectData.map((subject: any) => subject.subject);
    const users = await this.fetchByWalletAddresses(walletAddresses);

    users.sort((a, b) => {
      const aPrice = subjectData.find((subject: any) =>
        subject.subject === a.wallet_address
      )?.last_fetched_key_price ?? 0;
      const bPrice = subjectData.find((subject: any) =>
        subject.subject === b.wallet_address
      )?.last_fetched_key_price ?? 0;
      return bPrice - aPrice;
    });
    return users;
  }

  public async fetchTrendingUsers(): Promise<UserDetails[]> {
    const { data: subjectData, error: subjectError } = await Supabase.client
      .from(
        "subject_details",
      ).select(SubjectDetailsSelectQuery).order(
        "last_key_purchased_at",
        { ascending: false },
      ).limit(
        UserService.LIMIT,
      ) as any;
    if (subjectError) throw subjectError;

    SubjectDetailsCacher.cacheMultiple(subjectData);

    const walletAddresses = subjectData.map((subject: any) => subject.subject);
    const users = await this.fetchByWalletAddresses(walletAddresses);

    users.sort((a, b) => {
      const aDate = new Date(
        subjectData.find((subject: any) => subject.subject === a.wallet_address)
          ?.last_key_purchased_at ?? 0,
      ).getTime();
      const bDate = new Date(
        subjectData.find((subject: any) => subject.subject === b.wallet_address)
          ?.last_key_purchased_at ?? 0,
      ).getTime();
      return bDate - aDate;
    });

    return users;
  }

  public async searchUsers(query: string): Promise<UserDetails[]> {
    const { data, error } = await Supabase.client.from("users_public").select(
      UserDetailsSelectQuery,
    )
      .or(`display_name.ilike.%${query}%,x_username.ilike.%${query}%`).limit(
        UserService.LIMIT,
      );
    if (error) throw error;
    return data as any;
  }
}

export default new UserService();
