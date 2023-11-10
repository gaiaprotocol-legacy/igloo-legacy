begin
  insert into total_subject_key_balances (
    wallet_address
  ) values (
    new.wallet_address
  ) on conflict (wallet_address) do nothing;
  update total_subject_key_balances
  set
    total_key_balance = total_key_balance + new.last_fetched_balance
  where
    wallet_address = new.wallet_address;
  return null;
end;