begin
  insert into subject_details (
    subject
  ) values (
    new.subject
  ) on conflict (subject) do nothing;
  IF old.last_fetched_balance = 0 AND new.last_fetched_balance > 0 THEN
    update subject_details
    set
      key_holder_count = key_holder_count + 1
    where
      subject = new.subject;
  ELSIF old.last_fetched_balance > 0 AND new.last_fetched_balance = 0 THEN
    update subject_details
    set
      key_holder_count = key_holder_count - 1
    where
      subject = new.subject;
  END IF;
  return null;
end;