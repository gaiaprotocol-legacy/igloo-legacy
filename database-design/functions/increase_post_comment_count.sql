begin
  IF new.parent IS NOT NULL THEN
    update posts
    set
      comment_count = comment_count + 1
    where
      id = new.parent;
  END IF;
  return null;
end;