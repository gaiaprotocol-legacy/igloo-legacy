import { n2u } from "common-dapp-module";

export default interface SubjectDetails {
  subject: string;
  last_fetched_key_price: string;
  total_trading_key_volume: string;
  total_earned_trading_fees: string;
  is_key_price_up?: boolean;
  last_message?: string;
  last_message_sent_at: string;
  key_holder_count: number;
  last_key_purchased_at: string;
  owned_key_count: number;
  created_at: string;
  updated_at?: string;
}

export const DefaultSubjectDetails: SubjectDetails = {
  subject: "",
  last_fetched_key_price: "0",
  total_trading_key_volume: "0",
  total_earned_trading_fees: "0",
  last_message_sent_at: "",
  key_holder_count: 0,
  last_key_purchased_at: "-infinity",
  owned_key_count: 0,
  created_at: "-infinity",
};

export const SubjectDetailsSelectQuery =
  `*, last_fetched_key_price::text, total_trading_key_volume::text, total_earned_trading_fees::text`;

export const isEqualSubjectDetails = (a: SubjectDetails, b: SubjectDetails) =>
  n2u(a.subject) === n2u(b.subject) &&
  n2u(a.last_fetched_key_price) === n2u(b.last_fetched_key_price) &&
  n2u(a.total_trading_key_volume) === n2u(b.total_trading_key_volume) &&
  n2u(a.total_earned_trading_fees) === n2u(b.total_earned_trading_fees) &&
  n2u(a.is_key_price_up) === n2u(b.is_key_price_up) &&
  n2u(a.last_message) === n2u(b.last_message) &&
  n2u(a.last_message_sent_at) === n2u(b.last_message_sent_at) &&
  n2u(a.key_holder_count) === n2u(b.key_holder_count) &&
  n2u(a.last_key_purchased_at) === n2u(b.last_key_purchased_at) &&
  n2u(a.owned_key_count) === n2u(b.owned_key_count);
