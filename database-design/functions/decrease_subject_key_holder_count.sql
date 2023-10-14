begin
  IF old.last_fetched_balance > 0 THEN
    update subject_details
    set
      key_holder_count = key_holder_count - 1
    where
      subject = old.subject;
  END IF;
  return null;
end;