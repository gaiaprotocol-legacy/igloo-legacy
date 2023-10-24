export default interface SubjectTradeEvent {
  block_number: number;
  log_index: number;
  args: string;
  wallet_address: string;
  subject: string;
  created_at: string;
}
