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
  last_fetched_key_price: "",
  total_trading_key_volume: "",
  total_earned_trading_fees: "",
  last_message_sent_at: "",
  key_holder_count: 0,
  last_key_purchased_at: "-infinity",
  owned_key_count: 0,
  created_at: "-infinity",
};

export const SubjectDetailsSelectQuery =
  `*, last_fetched_key_price::text, total_trading_key_volume::text, total_earned_trading_fees::text`;

export const isEqualSubjectDetails = (a: SubjectDetails, b: SubjectDetails) =>
  a.subject === b.subject &&
  a.last_fetched_key_price === b.last_fetched_key_price &&
  a.total_trading_key_volume === b.total_trading_key_volume &&
  a.total_earned_trading_fees === b.total_earned_trading_fees &&
  a.is_key_price_up === b.is_key_price_up &&
  a.last_message === b.last_message &&
  a.last_message_sent_at === b.last_message_sent_at &&
  a.key_holder_count === b.key_holder_count &&
  a.last_key_purchased_at === b.last_key_purchased_at &&
  a.owned_key_count === b.owned_key_count;
