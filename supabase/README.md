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
    'track-avax-contract-events',
    '*/10 * * * *',
    $$
    select net.http_get(
        'https://wtqgbkbewlhfloiscjli.supabase.co/functions/v1/track-contract-events',
        body := '{"chain":"avalanche"}'::JSONB,
        headers := '{"Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind0cWdia2Jld2xoZmxvaXNjamxpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDE5NjE2NzEsImV4cCI6MjAxNzUzNzY3MX0.CAmMN8hoDubTCz8E73BF9qKpKFBFumdpwjjbIcQMjVQ"}'::JSONB
    ) AS request_id;
    $$
  );
```
