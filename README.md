<div align="center">

# CoDesign Forge

**Pre-launch waitlist & launch-email platform**

CoDesign Forge is a fast, lightweight waitlist application that turns
visitors into opted-in subscribers, then delivers launch emails reliably
and compliantly. It pairs a polished public landing page — with a custom
SVG wireframe globe, animated logo marquee, and a live subscriber count —
with a durable email pipeline built on transactional outbox delivery.

[![Next.js 16](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org)
[![React 19](https://img.shields.io/badge/React-19-61dafb)](https://react.dev)
[![TypeScript strict](https://img.shields.io/badge/TypeScript-strict-3178c6)](https://www.typescriptlang.org)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind-v4-38bdf8)](https://tailwindcss.com)
[![PostgreSQL + Prisma 7](https://img.shields.io/badge/Prisma-7-2d3748)](https://www.prismaorm.com)
[![Resend](https://img.shields.io/badge/Resend-0f0f0f)](https://resend.com)

</div>

---

A visitor lands on the page, enters their email with explicit consent, and
is saved to PostgreSQL in a single transaction alongside a durable
welcome-email job — so a subscriber is never lost, even if sending fails.
A background processor delivers the welcome email through Resend, and every
delivery, bounce, and complaint is tracked and suppressed automatically.
Unsubscribe links use secure, revocable tokens and take effect immediately.

**Highlights**

- Static, server-rendered landing page — instant first load, single client
  component (the signup form), no framework bloat
- Live subscriber count from the database, cached for freshness, with a
  graceful non-claiming fallback — no fabricated claims anywhere
- Honeypot + rate limiting on signup; Zod validation at the server boundary
- Idempotent Resend webhooks with signature verification
- Fully responsive (360px → 1920px) and accessible (keyboard navigation,
  `aria-live` feedback, `prefers-reduced-motion` support)

**Stack:** Next.js 16 · React 19 · TypeScript (strict) · Tailwind CSS v4 ·
PostgreSQL + Prisma 7 · Resend + React Email · Zod · Upstash Redis ·
Vitest · Playwright

## Quick Start

```bash
git clone https://github.com/YOURNAME/codesignforge.git
cd codesignforge
npm install
cp .env.example .env    # fill in DATABASE_URL, RESEND_API_KEY, EMAIL_FROM, ...
npm run db:deploy
npm run dev             # http://localhost:3000
```

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run lint` / `npm run typecheck` | Lint + type check |
| `npm test` | Unit tests |
| `npm run db:generate` / `db:migrate` / `db:deploy` | Prisma client + migrations |

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for the production checklist.

> Email verification is intentionally not part of this product version — the
> app never claims an address is verified.
