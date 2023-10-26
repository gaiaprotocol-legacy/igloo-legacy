DECLARE
    v_author UUID;
begin
    IF new.post_ref IS NOT NULL THEN
        SELECT author INTO v_author FROM posts WHERE id = new.post_ref;
        IF v_author <> new.author THEN
            INSERT INTO notifications (
                user_id, triggered_by, type, source_id
            ) VALUES (
                v_author, new.author, 5, new.id
            );
        END IF;
    END IF;
    return null;
end;