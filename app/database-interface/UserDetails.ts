interface UserDetailsMetadata {}

export default interface UserDetails {
  user_id: string;
  wallet_address?: string;
  total_earned_trading_fees: string;
  profile_image?: string;
  display_name?: string;
  metadata?: UserDetailsMetadata;
  follower_count: number;
  following_count: number;
  blocked: boolean;
  created_at: string;
  updated_at?: string;
}

export const DefaultUserDetails: UserDetails = {
  user_id: "",
  total_earned_trading_fees: "0",
  follower_count: 0,
  following_count: 0,
  blocked: false,
  created_at: "-infinity",
};

export const UserDetailsSelectQuery = `*, total_earned_trading_fees::text`;

const isEqualMetadata = (
  a: UserDetailsMetadata | undefined,
  b: UserDetailsMetadata | undefined,
) => {
  return true;
};

export const isEqualUserDetails = (a: UserDetails, b: UserDetails) =>
  a.user_id === b.user_id &&
  a.wallet_address === b.wallet_address &&
  a.total_earned_trading_fees === b.total_earned_trading_fees &&
  a.profile_image === b.profile_image &&
  a.display_name === b.display_name &&
  isEqualMetadata(a.metadata, b.metadata);
