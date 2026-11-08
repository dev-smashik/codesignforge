# Deployment — CoDesign Forge

Production deployment guide for the waitlist app. All commands are from this
directory using npm.

## 1. PostgreSQL

Use a managed Postgres (Neon, Supabase, Railway, RDS). Collect:

| Variable | What to use |
| --- | --- |
| `DATABASE_URL` | Pooled runtime connection (Neon/Supabase pooled URL) |
| `DIRECT_URL` | Direct, non-pooled connection (used for migrations) |

- Apply migrations (point `DATABASE_URL` at the DIRECT URL for this step):

  ```bash
  npm run db:deploy
  ```

- Then set `DATABASE_URL` back to the pooled URL for the app.

## 2. Vercel

```bash
vercel --prod
# or: push to GitHub and import the repository
```

- Build command: `npm run build` · Start: `npm run start`
- Node 22+
- Add every variable from `.env.example` in *Project → Settings → Environment Variables* (production env only)
- `NEXT_PUBLIC_APP_URL` must be the production origin, e.g. `https://codesignforge.example.com`

**Cron trigger (important):** `vercel.json` schedules `/api/cron/process-outbox`
every minute. Vercel **Hobby** cron only runs once per day — on Hobby, send the
schedule to an external pinger instead (e.g. a GitHub Actions scheduled
workflow or `curl -H "Authorization: Bearer $CRON_SECRET"` every minute from
any cron service). Keep the bearer token in the pinger, not in Git.

## 3. Resend (email)

1. Verify your sending domain in Resend → add the **SPF, DKIM and DMARC** DNS
   records shown by Resend.
2. Set `EMAIL_FROM` to an address on the verified domain, e.g.
   `CoDesign Forge <hello@yourdomain.com>`.
3. Create a webhook endpoint: `https://YOUR-APP/api/webhooks/resend`.
   Events: `email.sent`, `email.delivered`, `email.bounced`,
   `email.complained`, `email.delivery_delayed`, `email.failed`.
4. Copy the webhook secret into `RESEND_WEBHOOK_SECRET`.
5. Send a test mail to yourself before confirming any campaign.

## 4. Admin provisioning

No admin surface ships in this build — the waitlist collection, welcome
emails, unsubscribe and webhooks run without an admin account. (A dashboard
can be reintroduced later on top of the same tables.)

## 5. Environment checklist

| Variable | Required | Notes |
| --- | --- | --- |
| `DATABASE_URL` | yes | pooled runtime URL |
| `DIRECT_URL` | yes (migrations) | direct URL |
| `NEXT_PUBLIC_APP_URL` | yes | public origin, no trailing slash |
| `RESEND_API_KEY` | yes | transactional sends |
| `EMAIL_FROM` | yes | verified-domain sender |
| `RESEND_WEBHOOK_SECRET` | yes | webhook signing |
| `CRON_SECRET` | yes | `openssl rand -hex 32` |
| `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` | recommended | distributed rate limiting; without them an in-memory limiter is used (dev only) |
| `ADMIN_PROVISION_EMAIL` / `ADMIN_PROVISION_PASSWORD` | one-time | delete the password after provisioning |
| `CAMPAIGN_SEND_DELAY_MS` | optional | pace campaign sends (e.g. `100`) |
| `SOCIAL_*_URL` | optional | empty hides the header icon |

## 6. Monitoring

- **Resend dashboard** — check bounce/complaint rates daily during sends.
- **Database** (`AuditLog` + `EmailLog`/`OutboxJob`) — failed jobs after 5
  attempts and bounce spikes are the leading indicators. Query sketch:

  ```sql
  SELECT "status", COUNT(*) FROM "OutboxJob" WHERE "status" IN ('FAILED') GROUP BY 1;
  SELECT "status", COUNT(*) FROM "EmailLog" WHERE "createdAt" > now() - interval '1 day' GROUP BY 1;
  ```

- **Vercel logs** — watch `/api/waitlist` 4xx/5xx and cron responses.
- Optional: wire a Sentry DSN on the API routes for provider/queue errors
  (not built-in — add only if wanted).

## 7. Backups & rollback

- Rely on provider **point-in-time recovery (PITR)** + daily snapshots
  (Neon/Supabase both offer this); verify a restore at least once.
- The app itself has no backup code — design for database-level recovery.
- **Rollback:** redeploy the previous Vercel build. Migrations are additive;
  never hand-edit an applied migration — write a new forward migration instead.

## 8. Local development

- Install PostgreSQL locally (or `npx prisma dev`), set `DATABASE_URL` in
  `.env`, then `npm run db:migrate` (dev) or `npm run db:deploy`.
- `npm run dev` serves the landing page. Wall-clock cron is not needed in
  dev — call `GET /api/cron/process-outbox` with the bearer token manually.

## Known limitations (as of this revision)

- No CAPTCHA: honeypot + rate limiting cover v1; add hCaptcha/Turnstile if
  signup abuse appears.
- Campaign sending is throttled by the cron tick (25 jobs/min default);
  very large lists take proportionally longer.
- Marketing emails should carry a real physical postal address before
  commercial sends — add it to the email footer at launch.
