# PositiveOnWorldwide PRD

## Product Goal

Launch **PositiveOnWorldwide** as a production-ready clothing ecommerce storefront that converts first-time visitors into customers through a strong brand impression, clear product discovery, low-friction cart review, secure checkout, and trustworthy account/order surfaces.

The current scaffold must remain usable without live provider credentials for local development, while clearly defining the production path for Auth0, Stripe, durable storage, deployment, and final smoke testing.

## Success Criteria

- Visitors can understand the brand, browse apparel, inspect products, add items to cart, and reach checkout from the first session.
- Checkout supports production Stripe Checkout Sessions when credentials are configured and deterministic placeholder behavior when credentials are absent.
- Account and order pages are protected by Auth0-style session checks and can be upgraded to `@auth0/nextjs-auth0` helpers without changing the route map.
- Product, inventory, payment, and order concepts are isolated in `lib/` and route handlers rather than embedded in UI components.
- The site builds with `npm run build`, exposes no secrets, and documents all required environment variables in `.env.example`.

## Target Customer Experience

PositiveOnWorldwide should feel like a premium streetwear and essentials brand with direct shopping paths. The homepage should prioritize product confidence over marketing copy: apparel imagery, collection positioning, product prices, sizes, stock signals, cart access, and checkout calls to action must be easy to scan.

Primary conversion behaviors:

- Start shopping from the hero without reading long explanatory copy.
- Compare latest apparel in a responsive product grid.
- Open product detail pages for images, story, sizes, price, stock, and related products.
- Add selected sizes to a cart drawer with clear quantity and subtotal feedback.
- Continue to checkout from cart or homepage.
- Complete payment through Stripe-supported cards and wallet methods.
- Return to protected order/profile views after authentication.

## Core User Journeys

1. Homepage discovery
   - User lands on `/`.
   - User sees brand name, apparel imagery, collection edits, latest products, trust signals, and direct shopping CTAs.
   - User can navigate to product detail or checkout.

2. Product selection
   - User opens `/product/[slug]`.
   - User sees product imagery, name, price, description, available sizes, stock status, and related products.
   - User selects a size before adding to cart.
   - Add-to-cart feedback updates the local cart and drawer state.

3. Cart and checkout
   - User reviews cart in the drawer or `/checkout`.
   - Checkout validates non-empty cart, email, quantities, and current catalog prices.
   - Client posts line items, customer email, and shipping estimate to `/api/checkout/sessions`.
   - Server returns either a live Stripe Checkout URL or a local placeholder response.

4. Payment confirmation
   - Stripe sends `checkout.session.completed` to `/api/webhooks/stripe`.
   - Webhook verifies the Stripe signature when `STRIPE_WEBHOOK_SECRET` is configured.
   - Successful payment records an order and decrements stock through `lib/db.ts`.

5. Account and order access
   - User requests `/profile` or `/orders`.
   - Middleware checks for the app session placeholder.
   - Unauthenticated users are redirected to the configured login path or protected-state response.
   - Authenticated users see account and order history placeholders ready for durable account data.

## Route Map

| Route | Type | Owner | Purpose | Production Requirement |
| --- | --- | --- | --- | --- |
| `/` | Page | `ui-engineer` | High-conversion storefront with hero, collections, catalog, cart entry, and checkout CTA. | Must remain fast, responsive, accessible, and focused on shopping actions. |
| `/product/[slug]` | Page | `ui-engineer` | Product detail, size selection, add-to-cart, and related products. | Unknown slugs should not expose broken UI. |
| `/checkout` | Page | `ui-engineer`, `billing-engineer` | Cart review and payment session launch. | Must validate cart state and communicate payment errors clearly. |
| `/profile` | Protected page | `auth-security` | Account profile surface. | Must require authenticated session before rendering account data. |
| `/orders` | Protected page | `auth-security`, `billing-engineer` | Order history and post-checkout return surface. | Must require session and support Stripe success return. |
| `/api/checkout/sessions` | API route | `billing-engineer` | Validates cart payload and creates Stripe Checkout Session or placeholder response. | Must never trust client prices and must not expose secret keys. |
| `/api/webhooks/stripe` | API route | `billing-engineer` | Receives Stripe payment events, records order, adjusts inventory. | Must verify webhook signatures in production. |

## Functional Requirements

### Storefront

- Use semantic sections for hero, collections, product catalog, and shopping calls to action.
- Show product name, price, images, available sizes, and stock state.
- Support responsive layouts across mobile, tablet, and desktop.
- Keep UI components reusable and aligned with local MagicUI-compatible primitives in `components/magicui/`.
- Avoid blocking storefront browsing when Auth0 or Stripe credentials are missing.

### Cart

- Cart state lives in `components/store/cart-provider.tsx`.
- Cart items include product id, slug, title, selected size, unit price, quantity, and image reference.
- Cart controls must support add, remove, quantity update, subtotal display, and checkout navigation.
- Cart UI must prevent checkout for empty carts.

### Product Catalog

- Static catalog data lives in `lib/products.ts` until replaced by a CMS or database.
- Server validation must resolve line items by product id/slug and trusted catalog price.
- Size and stock information must be represented consistently between product cards, product detail, checkout, and webhook inventory adjustment.

### Auth

- Protected pages: `/profile`, `/orders`.
- Auth environment variables:
  - `AUTH0_SECRET`
  - `AUTH0_BASE_URL`
  - `AUTH0_ISSUER_BASE_URL`
  - `AUTH0_CLIENT_ID`
  - `AUTH0_CLIENT_SECRET`
  - `NEXT_PUBLIC_AUTH0_DOMAIN`
  - `NEXT_PUBLIC_AUTH0_CLIENT_ID`
  - `AUTH0_CALLBACK_URL`
  - `AUTH0_LOGOUT_URL`
- Current implementation may use a lightweight app session cookie placeholder.
- Production integration should replace placeholder checks with `@auth0/nextjs-auth0` session helpers after credentials and callback URLs are configured.
- Auth secrets must remain server-only unless explicitly prefixed with `NEXT_PUBLIC_`.

### Billing

- Payment provider: Stripe Checkout.
- Supported policy: card payments, Apple Pay/Google Pay through Stripe wallet support, Klarna, and Afterpay/Clearpay where available.
- Checkout route must:
  - Accept only expected payload fields.
  - Validate quantity, size, product identity, and customer email.
  - Resolve prices server-side from `lib/products.ts`.
  - Use `STRIPE_SUCCESS_URL` and `STRIPE_CANCEL_URL`.
  - Return a deterministic placeholder response when Stripe credentials are absent for local development.
- Webhook route must:
  - Verify `STRIPE_WEBHOOK_SECRET` when configured.
  - Handle `checkout.session.completed`.
  - Record transaction through `lib/db.ts`.
  - Decrement inventory only after successful payment.
  - Be idempotent when durable storage is introduced.

### Data and Persistence

- Current `lib/db.ts` is a local in-memory persistence shim.
- Production requires durable storage for orders, customers, payment session references, inventory adjustments, and webhook idempotency.
- Any future storage integration must keep route handlers as the server boundary and update `.env.example` with required variables.

## Non-Functional Requirements

- Build: `npm run build` must pass before handoff.
- Lint: `npm run lint` should pass when the Next lint command is available.
- Security: no credentials, webhook secrets, or API keys may be committed.
- Accessibility: product controls, cart controls, checkout forms, and navigation need accessible labels and keyboard-friendly behavior.
- Performance: homepage should avoid unnecessary client-side work; server components are preferred unless interaction requires client state.
- Reliability: API routes must return explicit error states for invalid payloads, missing cart data, missing provider configuration, and payment failures.
- Maintainability: keep product, auth, billing, and UI responsibilities separated by file ownership.

## Agent Delegation

1. `product-manager`
   - Maintains `AGENTS.md`, `docs/PRD.md`, `TASKS.md`, and `.codex/agents/product-manager.agent.md`.
   - Defines acceptance criteria, route map, auth checkpoints, billing flow, and sequencing.
   - Does not edit application source.

2. `ui-engineer`
   - Owns storefront pages and components under `app/`, `components/store/`, `components/magicui/`, and `app/globals.css`.
   - Implements responsive shopping UX, product browsing, cart drawer, checkout screen, and visual quality.

3. `auth-security`
   - Owns `lib/auth.ts`, `middleware.ts`, protected pages, auth environment requirements, and security posture.
   - Replaces placeholder checks with production Auth0 helpers when credentials are available.

4. `billing-engineer`
   - Owns `lib/payments.ts`, `lib/db.ts`, `/api/checkout/sessions`, `/api/webhooks/stripe`, Stripe configuration, and payment error handling.
   - Ensures webhook processing and inventory adjustment are safe for production storage.

5. `code-fixer`
   - Owns final integration, build/lint verification, TypeScript fixes, route compilation, and QA cleanup.
   - Does not change product scope without updating this PRD and `TASKS.md`.

## Acceptance Criteria

### Storefront Acceptance

- Homepage contains a first-viewport brand signal, apparel imagery, collection access, product access, and checkout entry.
- Product cards and product detail pages expose price, sizes, stock context, and add-to-cart behavior.
- Cart drawer and checkout page handle empty, populated, and modified cart states.
- Layout remains usable on mobile and desktop without text overlap.

### Auth Acceptance

- `/profile` and `/orders` are protected by middleware.
- Required Auth0 variables are listed in `.env.example`.
- Server-only auth values are not exposed through client components.
- Production replacement path for `@auth0/nextjs-auth0` is documented.

### Billing Acceptance

- Checkout session API validates line items server-side.
- Missing Stripe credentials produce local placeholder behavior, not a broken storefront.
- Live Stripe configuration can create Checkout Sessions without source changes.
- Webhook handles `checkout.session.completed`, records order data, and adjusts stock.
- Webhook secret and Stripe secret key are never committed or exposed.

### Production Readiness Acceptance

- Dependencies are installed.
- `npm run build` passes.
- `npm run lint` passes or documented lint-tool limitations are recorded.
- `.env.example` includes every required environment variable.
- Durable storage replacement is planned before real order volume.
- Hosted smoke test covers homepage, product detail, cart, checkout session creation, protected route redirect, and Stripe webhook test event.

## Known Gaps Before Launch

- Durable database/storage must replace `lib/db.ts` before accepting real customer orders at scale.
- Auth0 credentials and callback/logout URLs must be configured in the deployment environment.
- Stripe live or test credentials and webhook endpoint must be configured in Stripe Dashboard.
- Real product photography, final copy, shipping/returns policy pages, privacy policy, terms, and tax handling are outside the current scaffold and must be added before public launch.
