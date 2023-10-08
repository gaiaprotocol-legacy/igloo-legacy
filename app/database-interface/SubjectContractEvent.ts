export default interface SubjectContractEvent {
  block_number: number;
  log_index: number;
  event_type: number;
  args: string;
  wallet_address: string;
  subject: string;
  created_at: string;
}
