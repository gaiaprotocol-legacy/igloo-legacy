DECLARE
    portfolio_value numeric := 0;
    holder_record record;
    subject_detail record;
begin
    FOR holder_record IN (
        SELECT 
            subject, 
            last_fetched_balance
        FROM 
            subject_key_holders 
        WHERE 
            wallet_address = param_wallet_address
    ) LOOP
        FOR subject_detail IN (
            SELECT 
                subject, 
                last_fetched_key_price 
            FROM 
                subject_details 
            WHERE 
                subject = holder_record.subject
        ) LOOP
            portfolio_value := portfolio_value + (holder_record.last_fetched_balance::numeric * subject_detail.last_fetched_key_price);
        END LOOP;
    END LOOP;
    RETURN portfolio_value;
end;