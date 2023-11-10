DECLARE
    v_author UUID;
BEGIN
    SELECT author INTO v_author FROM posts WHERE id = new.post_id;
    
    IF v_author <> new.user_id THEN
        INSERT INTO notifications (
            user_id, triggered_by, type, source_id
        ) VALUES (
            v_author, new.user_id, 4, new.post_id
        );
    END IF;
    
    RETURN NULL;
END;
