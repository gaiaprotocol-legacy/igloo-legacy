begin
  insert into subject_details (
    subject
  ) values (
    new.subject
  ) on conflict (subject) do nothing;
  update subject_details
    set
        last_message = new.author_name || ': ' || new.message,
        last_message_sent_at = now()
    where
        subject = new.subject;
  return null;
end;