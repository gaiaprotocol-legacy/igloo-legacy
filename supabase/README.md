
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
        headers := '{"Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRpZmZjcnZnbnNwYnp6YnF3dHZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTY3MzU2MjIsImV4cCI6MjAxMjMxMTYyMn0.CtVuTA_yY1t6zQ4NUZJUWEp7aDG2JBpR_6SFdU3vNJg"}'::JSONB
    ) AS request_id;
    $$
  );
```
