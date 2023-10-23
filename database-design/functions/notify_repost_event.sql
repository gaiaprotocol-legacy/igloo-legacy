begin
    insert into notifications (
        user_id, triggered_by, type, source_id
    ) values (
        (SELECT author FROM posts WHERE id = new.post_id),
        new.user_id, 4, new.post_id
    )
    return null;
end;