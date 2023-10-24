begin
  update posts
  set
    repost_count = repost_count - 1
  where
    id = old.post_id;
  return null;
end;