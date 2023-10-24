begin
    IF EXISTS (SELECT FROM user_details WHERE wallet_address = new.args[1]) THEN
        IF EXISTS (SELECT FROM user_details WHERE wallet_address = new.args[2]) THEN
            IF new.args[3] = 'true' THEN
                insert into notifications (
                    user_id, triggered_by, type, amount
                ) values (
                    (SELECT user_id FROM user_details WHERE wallet_address = new.args[2]),
                    (SELECT user_id FROM user_details WHERE wallet_address = new.args[1]),
                    0, new.args[4]::int8
                );
            ELSE
                insert into notifications (
                    user_id, triggered_by, type, amount
                ) values (
                    (SELECT user_id FROM user_details WHERE wallet_address = new.args[2]),
                    (SELECT user_id FROM user_details WHERE wallet_address = new.args[1]),
                    1, new.args[4]::int8
                );
            END IF;
        END IF;
    END IF;
    return null;
end;