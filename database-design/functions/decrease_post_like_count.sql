begin
  update post
  set
    like_count = like_count - 1
  where
    id = old.post_id;
  return null;
end;