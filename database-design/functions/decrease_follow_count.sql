begin
  update user_details
  set
    follower_count = follower_count - 1
  where
    user_id = old.followee_id;
  update user_details
  set
    following_count = following_count - 1
  where
    user_id = old.follower_id;
  return null;
end;