begin
  IF old.parent IS NOT NULL THEN
    update posts
    set
      comment_count = comment_count - 1
    where
      id = old.parent;
  END IF;
  return null;
end;