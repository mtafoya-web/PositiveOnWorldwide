# PositiveOnWorldwide Task List

## Coordination Rules

- Product documentation ownership is limited to `AGENTS.md`, `docs/PRD.md`, `TASKS.md`, and `.codex/agents/product-manager.agent.md`.
- Application source changes belong to the specialist agents listed below.
- Do not revert work from other agents. If a file contains unexpected changes, preserve them unless the owning agent explicitly requests otherwise.
- Every implementation handoff should end with `npm run build`; run `npm install` first if dependencies are missing.

## Completed Scaffold

- [x] Initialized Next.js App Router ecommerce scaffold.
- [x] Created root `AGENTS.md` repository memory.
- [x] Created five `.codex/agents/*.agent.md` configuration files.
- [x] Added local MagicUI-compatible primitives.
- [x] Added storefront homepage, collection grid, product catalog, product detail route, cart provider, cart drawer, checkout page, protected profile/orders pages, checkout session route, Stripe webhook route, local catalog data, local persistence shim, and `.env.example`.
- [x] Documented the production route map, auth checkpoints, billing flow, acceptance criteria, and agent delegation in `docs/PRD.md`.

## Ordered Delivery Plan

### 1. Product Manager

- [x] Keep `docs/PRD.md` aligned with the current scaffold and production goal.
- [x] Keep `TASKS.md` organized by agent, owner, acceptance criteria, and launch gaps.
- [x] Keep `.codex/agents/product-manager.agent.md` focused on product documentation only.
- [ ] Revisit scope when any agent introduces new routes, environment variables, data models, or checkout/auth behavior.

Acceptance:

- PRD includes goal, target experience, route map, auth checkpoints, billing flow, non-functional requirements, production gaps, and acceptance criteria.
- Task list separates completed scaffold work from production blockers and agent assignments.

### 2. UI Engineer

- [ ] Verify homepage conversion path: hero CTA, collections, catalog, cart access, checkout CTA, and trust cues.
- [ ] Verify product detail behavior: unknown slug handling, size selection, add-to-cart feedback, related products, and responsive layout.
- [ ] Verify cart drawer behavior: empty state, quantity updates, remove item, subtotal, checkout navigation, and keyboard accessibility.
- [ ] Verify checkout screen behavior: empty cart handling, email validation, loading/error states, and payment launch response.
- [ ] Add or refine policy/trust surfaces required before launch, such as shipping, returns, privacy, terms, and contact, if product scope approves new routes.

Acceptance:

- Mobile and desktop layouts are usable without overlapping text or inaccessible controls.
- Shopping actions are reachable without authentication.
- Product and cart controls have semantic labels and clear states.

### 3. Auth Security

- [ ] Validate `/profile` and `/orders` middleware protection.
- [ ] Confirm no server-only Auth0 variables are referenced by client components.
- [ ] Document or implement the production replacement from placeholder session cookie checks to `@auth0/nextjs-auth0`.
- [ ] Configure production callback/logout URLs in Auth0 before launch.
- [ ] Add tests or manual verification notes for authenticated and unauthenticated route access.

Acceptance:

- Protected pages cannot render account/order data without a valid session.
- `.env.example` lists all Auth0 variables needed by production.
- Auth errors or missing credentials fail closed for protected routes.

### 4. Billing Engineer

- [ ] Validate `/api/checkout/sessions` rejects invalid payloads, empty carts, unknown products, bad quantities, and mismatched client prices.
- [ ] Confirm server-side pricing comes from `lib/products.ts`.
- [ ] Confirm placeholder checkout mode is deterministic when Stripe credentials are absent.
- [ ] Configure Stripe Checkout payment methods for card wallets, Klarna, and Afterpay/Clearpay where supported by account and region.
- [ ] Validate `/api/webhooks/stripe` signature handling, `checkout.session.completed` handling, order recording, and stock adjustment.
- [ ] Replace `lib/db.ts` in-memory shim with durable storage before real transactions.
- [ ] Add webhook idempotency when durable storage is introduced.

Acceptance:

- Stripe secret key and webhook secret are never exposed to client code.
- Checkout can create a live Stripe Session when configured.
- Webhook processing can be replayed safely after durable storage is added.

### 5. Code Fixer

- [ ] Run `npm install` if `node_modules` is missing.
- [ ] Run `npm run build` and fix blocking TypeScript, JSX, route-handler, or Next.js compilation errors.
- [ ] Run `npm run lint` and resolve actionable lint issues, or document command limitations.
- [ ] Perform final local smoke test: homepage, product detail, cart add/remove, checkout placeholder/live response, protected route redirect, and webhook test path.
- [ ] Ensure `.env.example` is current after all implementation changes.

Acceptance:

- `npm run build` passes.
- No committed secrets are present.
- Final handoff lists verification commands and any unresolved production launch blockers.

## Production Launch Blockers

- [ ] Install dependencies in the target environment.
- [ ] Set Auth0 variables in the deployment platform.
- [ ] Set Stripe variables in the deployment platform.
- [ ] Configure Stripe webhook endpoint in Stripe Dashboard.
- [ ] Configure Auth0 callback and logout URLs for the production domain.
- [ ] Replace in-memory order/inventory storage with durable storage.
- [ ] Add or approve final legal/policy pages: shipping, returns, privacy, terms, and contact.
- [ ] Add final product photography, final product copy, tax policy, shipping rates, and fulfillment process.
- [ ] Run hosted smoke test after deployment.

## Verification Checklist

- [ ] `npm run build`
- [ ] `npm run lint`
- [ ] Homepage loads and links to products and checkout.
- [ ] Product detail page supports size selection and add-to-cart.
- [ ] Cart drawer supports update/remove/subtotal states.
- [ ] Checkout API validates cart and returns placeholder or Stripe URL.
- [ ] `/profile` and `/orders` require authentication.
- [ ] Stripe webhook test event records order and adjusts stock in the configured persistence layer.
- [ ] No secrets appear in committed files or browser-visible bundles.
