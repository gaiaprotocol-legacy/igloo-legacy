CREATE OR REPLACE FUNCTION get_portfolio_value(
    p_wallet_address text
)
RETURNS TABLE (
    total_keys_count int8,
    total_portfolio_value numeric
) AS $$
DECLARE
    total_keys int8 := 0;
    portfolio_value numeric := 0;
    holder_record record;
    subject_detail record;
BEGIN
    FOR holder_record IN (
        SELECT 
            subject, 
            last_fetched_balance
        FROM 
            subject_key_holders 
        WHERE 
            wallet_address = p_wallet_address
    ) LOOP
        FOR subject_detail IN (
            SELECT 
                subject, 
                last_fetched_key_price 
            FROM 
                subjects 
            WHERE 
                subject = holder_record.subject
        ) LOOP
            total_keys := total_keys + holder_record.last_fetched_balance;
            portfolio_value := portfolio_value + (holder_record.last_fetched_balance::numeric * subject_detail.last_fetched_key_price);
        END LOOP;
    END LOOP;

    RETURN QUERY SELECT total_keys, portfolio_value;
END;
$$ LANGUAGE plpgsql;
