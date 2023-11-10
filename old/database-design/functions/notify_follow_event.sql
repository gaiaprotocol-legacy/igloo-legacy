begin
    insert into notifications (
        user_id, triggered_by, type
    ) values (
        new.followee_id, new.follower_id, 2
    );
    return null;
end;