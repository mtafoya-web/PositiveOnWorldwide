# PositiveOnWorldwide Agent Memory

## Coordination Status

Global coordination framework: active.

This repository is an autonomous build workspace for a production-oriented ecommerce clothing website named **PositiveOnWorldwide**. The workspace was initially empty: no Git repository, package manifest, source files, tests, or framework metadata were present before this scaffold. All agents should treat the files listed here as the source of truth and keep changes aligned with the stack and architecture below.

## Tech Stack

- Framework: Next.js App Router
- Runtime: React with TypeScript
- Styling: Tailwind CSS with CSS variables in `app/globals.css`
- UI approach: custom local MagicUI-compatible components in `components/magicui/`
- Auth architecture: Auth0-style environment configuration and protected server pages
- Billing architecture: Stripe Checkout Session route and Stripe webhook route with explicit placeholder environment variables
- State: local React cart provider in `components/store/cart-provider.tsx`
- Data: static apparel catalog and in-memory order/stock utility in `lib/`
- Testing and verification: TypeScript compile through `next build`; lint command available through `next lint`

## Root Paths

- `app/`: Next.js App Router pages, layouts, API routes, and route groups.
- `app/page.tsx`: homepage storefront with hero, Bento collections, catalog, product detail preview, cart drawer, and checkout CTA.
- `app/product/[slug]/page.tsx`: product detail page with size selector and add-to-cart flow.
- `app/checkout/page.tsx`: checkout page that posts to `/api/checkout/sessions`.
- `app/profile/page.tsx`: protected profile page.
- `app/orders/page.tsx`: protected order history page.
- `app/api/checkout/sessions/route.ts`: server route that creates Stripe Checkout Sessions.
- `app/api/webhooks/stripe/route.ts`: Stripe webhook endpoint that records orders and adjusts stock.
- `components/magicui/`: local reusable visual primitives inspired by MagicUI patterns.
- `components/store/`: ecommerce UI and cart provider components.
- `lib/products.ts`: apparel product catalog and collection data.
- `lib/auth.ts`: Auth0 environment contract and route protection helpers.
- `lib/payments.ts`: payment method policy and checkout payload types.
- `lib/db.ts`: local transaction and inventory persistence shim.
- `middleware.ts`: protected route middleware for account/order pages.
- `.codex/agents/`: five specialized agent configuration files.
- `.env.example`: complete list of required production secrets and public URLs.

## Coding Style

- Prefer small, focused React components over monolithic pages.
- Keep server-only logic in `lib/` or route handlers.
- Keep UI state in client components marked with `"use client"`.
- Use semantic HTML elements and accessible labels for commerce controls.
- Use `process.env.*` only on the server unless the variable is explicitly public and prefixed with `NEXT_PUBLIC_`.
- Do not hard-code credentials, secrets, webhook signing keys, Auth0 client secrets, or Stripe keys.
- Keep visual primitives reusable and variant-driven.
- Use ASCII in source files unless a file already uses non-ASCII.

## Routing Map

- `/`: primary high-conversion shopping experience.
- `/product/[slug]`: product details, size selection, add-to-cart, related products.
- `/checkout`: checkout review and payment launch.
- `/profile`: protected account profile, requires Auth0 session token.
- `/orders`: protected order history, requires Auth0 session token.
- `/api/checkout/sessions`: POST endpoint for Stripe Checkout Session creation.
- `/api/webhooks/stripe`: POST endpoint for Stripe payment completion events.

## Auth Checkpoints

- `middleware.ts` protects `/profile` and `/orders`.
- `lib/auth.ts` defines required Auth0 variables and a minimal server-side session check using an app session cookie placeholder.
- Production integration should replace the lightweight cookie check with `@auth0/nextjs-auth0` session helpers once credentials are provided.
- Required Auth0 variables are listed in `.env.example`.

## Billing Flow

1. User adds apparel to the local cart.
2. Checkout page posts line items, customer email, and shipping estimate to `/api/checkout/sessions`.
3. Server validates line items against `lib/products.ts`.
4. If `STRIPE_SECRET_KEY` is configured and the Stripe SDK is available, the route creates a Stripe Checkout Session.
5. If credentials are absent, the route returns a deterministic placeholder response for local UI development.
6. Stripe posts successful payment events to `/api/webhooks/stripe`.
7. The webhook verifies `STRIPE_WEBHOOK_SECRET`, records the transaction via `lib/db.ts`, and decrements stock.

## Agent Responsibilities

- `product-manager`: owns product documentation only: `AGENTS.md`, `docs/PRD.md`, `TASKS.md`, and `.codex/agents/product-manager.agent.md`; maintains PRD, task list, route map, acceptance criteria, and delegation sequence.
- `ui-engineer`: owns React/Tailwind/MagicUI storefront pages and product interactions.
- `auth-security`: owns Auth0 environment, protected route behavior, middleware, and security posture.
- `billing-engineer`: owns Stripe session creation, webhook handling, transaction recording, and stock adjustment.
- `code-fixer`: owns build, TypeScript, lint, integration cleanup, and final QA.

## Production Launch Gaps

- Replace the in-memory order and stock shim in `lib/db.ts` with durable storage before accepting real order volume.
- Configure Auth0 credentials plus callback and logout URLs in the deployment environment.
- Configure Stripe credentials, Checkout payment methods, and webhook endpoint in Stripe Dashboard.
- Add or approve final shipping, returns, privacy, terms, contact, tax, fulfillment, product photography, and product copy before public launch.
- Run a hosted smoke test across homepage, product detail, cart, checkout, protected routes, and Stripe webhook after deployment.

## Verification Contract

- Run `npm run build` before handoff.
- If dependencies are missing, run `npm install` first.
- Treat any TypeScript, route-handler, or JSX compilation error as blocking.
- Keep `.env.example` updated whenever a new environment variable is introduced.
