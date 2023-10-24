begin
  update posts
  set
    repost_count = repost_count + 1
  where
    id = new.post_id;
  return null;
end;