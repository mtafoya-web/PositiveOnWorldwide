# Positive On Worldwide - Rebuild

This project is a complete clean rebuild of the Positive On Worldwide application using Next.js 14, Neon DB (PostgreSQL), Auth0, and Stripe.

## Features
- **Next.js 14 App Router:** Clean, fast, server-rendered components.
- **Neon DB & Prisma:** Type-safe database queries.
- **Auth0 Security:** Server-side admin protection.
- **Stripe Checkout:** Secure, server-side price validation with webhooks.
- **3D Hero Landing:** Beautiful React Three Fiber background.
- **Admin Dashboard:** Full product management without needing developers.

## 1. Environment Setup

Copy `.env.example` to `.env.local` and fill in the values:

```bash
cp .env.example .env.local
```

### Required Vercel Environment Variables:
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_BRAND_NAME`
- `NODE_ENV`
- `AUTH0_SECRET` (Run `openssl rand -hex 32` to generate)
- `AUTH0_BASE_URL`
- `AUTH0_ISSUER_BASE_URL`
- `AUTH0_CLIENT_ID`
- `AUTH0_CLIENT_SECRET`
- `ADMIN_EMAILS` (Comma-separated admin emails, e.g., `owner@domain.com`)
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_SUCCESS_URL`
- `STRIPE_CANCEL_URL`
- `DATABASE_URL` (Neon DB Connection String)

## 2. Database Setup

```bash
npm run db:push
npm run db:seed
```

## 3. Local Development

```bash
npm install
npm run dev
```

## 4. Stripe Webhook Testing (Local)

Run the Stripe CLI to test webhooks locally:
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```
Copy the Webhook Secret given in the terminal and add it to your `.env.local` as `STRIPE_WEBHOOK_SECRET`.

## 5. Vercel Deployment

1. Connect the repository to Vercel.
2. In Vercel Project Settings, set the **Framework Preset** to Next.js.
3. Paste all environment variables from your `.env.local`.
4. Add the Production URL to Auth0 Allowed Callbacks and Logout URLs.
5. Add the Production URL to Stripe Webhooks (`https://your-domain.com/api/webhooks/stripe`).
6. Deploy!

## Rebuild Audit
The legacy broken application can be found in the `_legacy`, `_app_legacy`, and `_components_legacy` folders for historical reference. The new architecture strictly implements environment validation via Zod (`src/lib/env.ts`), protecting against crashes due to missing production keys.
