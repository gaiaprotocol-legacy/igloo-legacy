```
supabase link --project-ref XXX
supabase secrets set --env-file ./supabase/.env
supabase functions deploy
supabase db dump -f supabase/seed.sql
```

```sql
select * from cron.job;
```

```sql
select * from cron.job_run_details;
```

```sql
select
  cron.schedule(
    'track-subject-events-every-10-minutes',
    '*/10 * * * *',
    $$
    select net.http_get(
        'https://gslqborrkoraysvsopjv.supabase.co/functions/v1/track-subject-events',
        headers := '{"Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdzbHFib3Jya29yYXlzdnNvcGp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTgwMzM0MjksImV4cCI6MjAxMzYwOTQyOX0.A1pCWncoOjXlpT73mH5tFJjpbBEuPMVGBXmVIig_jhQ"}'::JSONB
    ) AS request_id;
    $$
  );
```

```sql
create function public.set_user_metadata_to_details()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.user_details (user_id, display_name, profile_image, x_username)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'avatar_url',
    new.raw_user_meta_data ->> 'user_name'
  ) on conflict (user_id) do update
  set
    display_name = new.raw_user_meta_data ->> 'full_name',
    profile_image = new.raw_user_meta_data ->> 'avatar_url',
    x_username = new.raw_user_meta_data ->> 'user_name';
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.set_user_metadata_to_details();

create trigger on_auth_user_updated
  after update on auth.users
  for each row execute procedure public.set_user_metadata_to_details();
```
