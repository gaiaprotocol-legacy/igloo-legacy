begin
  update users_public
  set
    follower_count = follower_count + 1
  where
    user_id = new.followee_id;
  update users_public
  set
    following_count = following_count + 1
  where
    user_id = new.follower_id;
  return null;
end;