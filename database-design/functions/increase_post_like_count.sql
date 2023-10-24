begin
  update posts
  set
    like_count = like_count + 1
  where
    id = new.post_id;
  return null;
end;