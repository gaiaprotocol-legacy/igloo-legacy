begin
  IF new.last_fetched_balance > 0 THEN
    update wallet_total_subject_key_balances
    set
      total_key_balance = total_key_balance + last_fetched_balance
    where
      wallet_address = new.wallet_address;
  END IF;
  return null;
end;