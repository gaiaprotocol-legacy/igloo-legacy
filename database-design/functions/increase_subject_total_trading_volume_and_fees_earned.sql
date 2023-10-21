begin
    update user_details
    set
        total_earned_trading_fees = total_earned_trading_fees + new.args[7]::numeric
    where
        wallet_address = new.args[1];
    insert into subject_details (
        subject
    ) values (
        new.args[2]
    ) on conflict (subject) do nothing;
    update subject_details
    set
        total_trading_key_volume = total_trading_key_volume + new.args[5]::numeric,
        total_earned_trading_fees = total_earned_trading_fees + new.args[7]::numeric,
        last_key_purchased_at = now()
    where
        subject = new.args[2];
    return null;
end;