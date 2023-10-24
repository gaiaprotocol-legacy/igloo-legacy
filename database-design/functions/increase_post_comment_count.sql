begin
  IF new.post_ref IS NOT NULL THEN
    update post
    set
      comment_count = comment_count + 1
    where
      id = new.post_ref;
  END IF;
  return null;
end;