DECLARE
    v_sender UUID;
    v_receiver UUID;
BEGIN
    SELECT user_id INTO v_sender FROM user_details WHERE wallet_address = new.args[1];
    SELECT user_id INTO v_receiver FROM user_details WHERE wallet_address = new.args[2];
    
    IF v_sender IS NOT NULL AND v_receiver IS NOT NULL AND v_sender <> v_receiver THEN
        IF new.args[3] = 'true' THEN
            INSERT INTO notifications (
                user_id, triggered_by, type, amount
            ) VALUES (
                v_receiver, v_sender, 0, new.args[4]::int8
            );
        ELSE
            INSERT INTO notifications (
                user_id, triggered_by, type, amount
            ) VALUES (
                v_receiver, v_sender, 1, new.args[4]::int8
            );
        END IF;
    END IF;

    RETURN NULL;
END;
