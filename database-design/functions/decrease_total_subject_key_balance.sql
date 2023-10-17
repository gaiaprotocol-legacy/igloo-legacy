begin
  insert into wallet_total_subject_key_balances (
    wallet_address
  ) values (
    old.wallet_address
  ) on conflict (wallet_address) do nothing;
  update wallet_total_subject_key_balances
  set
    total_key_balance = total_key_balance - old.last_fetched_balance
  where
    wallet_address = old.wallet_address;
  return null;
end;