# CryptoSure Cloudflare, Vercel, and Hostinger Architecture

**Status:** Approved build direction, not a production deployment
**Date:** July 23, 2026

## Executive decision

CryptoSure uses one public edge, one website runtime, one product user
interface, and one private service plane:

- Cloudflare is the authoritative Domain Name System, transport security, edge
  filtering, bot screening, cache-policy, and private-tunnel layer.
- Vercel hosts the public CryptoSure.me website and, later, the shared
  CryptoSure product application.
- Hostinger runs long-lived Docker services, approved test integrations,
  background jobs, and private application programming interfaces.
- CryptoSure.me remains the public marketing and discovery surface.
- The product application keeps one set of routes and components for DemoLand
  and RealDeal.

This split follows the deployment boundary that has worked for TaskFence while
keeping CryptoSure-specific insurance, privacy, and evidence requirements
explicit.

## Domain topology

| Hostname | Owner | Purpose | Public state |
|---|---|---|---|
| `cryptosure.me` | Vercel through Cloudflare | Marketing, education, and DemoLand research | Public |
| `www.cryptosure.me` | Cloudflare redirect | Canonical redirect to the apex domain | Public |
| `app.cryptosure.me` or `cryptosure.app` | Vercel through Cloudflare | Shared product application | Future |
| `api.cryptosure.me` | Cloudflare Tunnel to Hostinger | Narrow public application programming interface | Future |
| `ops.cryptosure.me` | Cloudflare Access to Hostinger | Operator-only health and administration | Private |

Vercel must verify each custom domain before Cloudflare proxying is enabled.
After proxying is enabled, transport security, redirects, cache behavior, and
origin reachability must be tested again.

## Request path

```text
Visitor
  -> Cloudflare Domain Name System (DNS), Transport Layer Security (TLS),
     Web Application Firewall (WAF), rate limits, and Turnstile
  -> Vercel website or product application

Product application
  -> https://api.cryptosure.me
  -> Cloudflare Tunnel
  -> private Hostinger Docker network
  -> approved CryptoSure service adapter
  -> sandbox application programming interface (API), test network,
     deployed contract, or other labeled provider
```

The Hostinger application port must not be exposed publicly. The `cloudflared`
container creates an outbound connection and reaches the service only through
the private Docker network.

## DemoLand and RealDeal invariant

DemoLand contains the complete product journey. Its provider adapters return
placeholders, mock records, and simulated evidence without external effects.

RealDeal uses the identical user-interface source and the identical provider
contracts. Its adapters connect to approved test application programming
interfaces, sandbox providers, deployed contracts, and real infrastructure.

RealDeal is an evidence environment, not a blanket production claim. A provider
may be real while still using a sandbox, local contract, test network, or
temporary deployment. Every response and user-visible status must label the
actual evidence source.

The following are prohibited:

- separate DemoLand and RealDeal page trees;
- mode-specific copies of routes, layouts, or components;
- direct page imports from either provider implementation folder;
- simulated data presented as external evidence;
- a RealDeal label used as proof of live insurance, mainnet, live money,
  licensing, coverage, recovery, or payout.

## Cloudflare security controls

### Domain and transport

- Keep Cloudflare authoritative for the zone.
- Use encrypted origin connections and strict certificate validation.
- Redirect all plain Hypertext Transfer Protocol traffic to secure Hypertext
  Transfer Protocol.
- Enable HTTP Strict Transport Security only after the domain and subdomains
  are confirmed healthy.
- Keep the Vercel default deployment address out of customer-facing links.

### Website firewall and rate limits

- Apply managed web application firewall rules to public hostnames.
- Rate-limit form submissions, authentication attempts, and expensive API
  routes independently.
- Block unexpected methods on narrow public endpoints.
- Set strict request-body limits before parsing.
- Do not trust client-supplied forwarding headers unless the request arrived
  through the reviewed Cloudflare path.

### Turnstile

- Use a hostname-scoped site key on public forms and authentication entry
  points.
- Validate every token on the server through Cloudflare Siteverify.
- Treat tokens as single-use and short-lived.
- Keep the secret key only in the Hostinger service that performs validation.
- Use official test keys in local and continuous-integration environments.
- Fail closed when validation is unavailable.

### Cache policy

- Cache immutable scripts, styles, fonts, images, and the public cinematic
  media.
- Do not apply a broad cache-everything rule.
- Bypass Cloudflare cache for `/api/*`, authentication routes, application
  pages with user state, responses with session cookies, and policy or claim
  data.
- Preserve Vercel's hashed-asset caching instead of overriding it globally.

### Private operator access

- Protect operator dashboards, tunnel metrics, automation tools, and health
  detail with Cloudflare Access.
- Require identity-based access and multi-factor authentication.
- Keep public health responses shallow and free of secrets, dependency names,
  wallet addresses, customer data, or configuration details.

## Storage boundary

Cloudflare D1 and R2 remain disabled for the public landing page. The marketing
site does not need authoritative records, uploads, authentication, or customer
storage.

Cloudflare R2 may later store encrypted or access-controlled documents, but a
bucket must remain private, its public development address must be disabled,
and access must use short-lived authorization. Claim evidence also requires
malware scanning, quarantine, retention, deletion, and audit procedures before
uploads are enabled.

Cloudflare D1 must not become an accidental second source of truth for policy,
premium, claim, identity, or authority state. Any future edge database use
needs an explicit non-authoritative purpose and reconciliation design.

## Repository layout

```text
frontend-landing/          CryptoSure.me marketing site
frontend-demoland/         One product user interface (UI), DemoLand and RealDeal providers
docs/                      Architecture and launch controls
infra/cloudflare/          Cloudflare configuration runbook
```

The current directory names are preserved to avoid destructive migration.
`frontend-demoland/` is the shared product interface despite its historical
name.

## Environment and secret boundaries

Browser-visible values may include a public API base address and a Turnstile
site key. They must never include provider credentials, Turnstile secrets,
wallet seeds, private keys, database credentials, tunnel tokens, or signing
keys.

Hostinger owns service secrets required by the private provider adapters.
Vercel owns only website or product-application secrets required by its
runtime. Cloudflare owns zone, Turnstile, Access, firewall, and Tunnel control
plane configuration.

## Delivery phases

### Phase 1: repository controls

- Preserve both Vercel and Cloudflare Worker builds for the marketing site.
- Make Vercel the default website build.
- Add security headers compatible with Cloudflare Turnstile.
- Enforce one product user interface through architecture tests.
- Keep public persistence and real form submission disabled.

### Phase 2: Cloudflare zone

- Add and verify the domain in Vercel.
- Move authoritative Domain Name System service to Cloudflare.
- Configure apex, `www`, application, API, and operator hostnames.
- Add conservative firewall, rate-limit, cache, and redirect rules.
- Enable privacy-respecting analytics after consent review.

### Phase 3: Hostinger gateway

- Add a narrow service implementing the shared RealDeal provider contracts.
- Package the service and `cloudflared` in hardened Docker Compose layers.
- Bind services only to the private Docker network.
- Verify health, denial, request-size, origin, rate, and Turnstile failure
  paths before allowing external test calls.

### Phase 4: approved RealDeal integrations

- Connect one provider at a time.
- Start with sandbox APIs or test-network contracts.
- Record exact environment, deployment identifier, provider, and external
  effect for every verification run.
- Keep unconnected providers fail-closed.
- Do not infer production insurance status from technical connectivity.

## Current non-claims

This architecture document does not claim that:

- CryptoSure offers, sells, binds, issues, or guarantees insurance;
- CryptoSure.me or the product application is deployed;
- Cloudflare is authoritative for the domain;
- the Hostinger gateway exists;
- any RealDeal provider is connected;
- D1, R2, Turnstile, Access, or Tunnel is active;
- a carrier, underwriter, producer, reinsurer, recovery partner, or regulator
  has approved the program.
