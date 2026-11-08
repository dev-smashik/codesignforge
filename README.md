# CoDesign Forge

Pre-launch waitlist application: public landing page, subscriber management,
and launch email campaigns. See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for
the production checklist.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript (strict) · Tailwind v4 ·
PostgreSQL + Prisma 7 · Resend + React Email · Zod · Vitest · Playwright

## Local development

```bash
npm install
npm run dev            # http://localhost:3000
```

Requires PostgreSQL (`DATABASE_URL` in `.env` — see `.env.example`), then:

```bash
npm run db:deploy      # apply migrations (against the direct URL)
npm run admin:provision # one-time admin seeding
```

## Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | Unit tests (Vitest) |
| `npx playwright test` | E2E (production build, port 3100) |
| `npm run db:generate` | Regenerate Prisma client |
| `npm run db:migrate` | Dev migration |
| `npm run db:deploy` | Apply migrations to a database |
| `npm run admin:provision` | Seed the admin account (one-time) |

## Architecture

```
app/api/waitlist        public signup (Zod, rate limited, honeypot)
app/api/cron/process-outbox  durable outbox worker (welcome + campaigns)
app/api/webhooks/resend      Resend events -> delivery/bounce/suppress
app/api/admin/*              authenticated admin API (stats, CSV, campaigns)
app/admin                    dashboard (protected layout)
modules/                  feature services (waitlist, email, campaigns, auth)
emails/                   React Email templates
lib/                      env, db, rate limiting
prisma/                   schema + migrations
```

Email verification is intentionally not part of this product version. Do not
claim an address is verified.
# codesignforge
