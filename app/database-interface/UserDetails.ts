import { n2u } from "common-app-module";

interface UserDetailsMetadata {}

export default interface UserDetails {
  user_id: string;
  wallet_address?: string;
  total_earned_trading_fees: string;
  display_name?: string;
  profile_image?: string;
  x_username?: string;
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

const isEqualMetadata = (a: UserDetailsMetadata, b: UserDetailsMetadata) => {
  return true;
};

export const isEqualUserDetails = (a: UserDetails, b: UserDetails) =>
  n2u(a.user_id) === n2u(b.user_id) &&
  n2u(a.wallet_address) === n2u(b.wallet_address) &&
  n2u(a.total_earned_trading_fees) === n2u(b.total_earned_trading_fees) &&
  n2u(a.display_name) === n2u(b.display_name) &&
  n2u(a.profile_image) === n2u(b.profile_image) &&
  n2u(a.x_username) === n2u(b.x_username) &&
  isEqualMetadata(a.metadata ?? {}, b.metadata ?? {}) &&
  n2u(a.follower_count) === n2u(b.follower_count) &&
  n2u(a.following_count) === n2u(b.following_count) &&
  n2u(a.blocked) === n2u(b.blocked);
