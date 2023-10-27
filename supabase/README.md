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
        'https://diffcrvgnspbzzbqwtvt.supabase.co/functions/v1/track-subject-events',
        headers := '{"Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdzbHFib3Jya29yYXlzdnNvcGp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTgwMzM0MjksImV4cCI6MjAxMzYwOTQyOX0.A1pCWncoOjXlpT73mH5tFJjpbBEuPMVGBXmVIig_jhQ"}'::JSONB
    ) AS request_id;
    $$
  );
```
