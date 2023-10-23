begin
    IF new.post_ref IS NOT NULL THEN
        insert into notifications (
            user_id, triggered_by, type, source_id
        ) values (
            (SELECT author FROM posts WHERE id = new.post_ref),
            new.author, 5, new.id
        )
    END IF;
    return null;
end;