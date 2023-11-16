export default interface Subject {
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
