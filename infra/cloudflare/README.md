# Cloudflare Control Plane

This directory records the intended CryptoSure Cloudflare configuration. It
contains no account identifier, zone identifier, application programming
interface (API) token, Tunnel token, Turnstile secret, or other credential.

## Current status

No configuration in this directory proves that CryptoSure.me is delegated to
Cloudflare or that any Cloudflare service is active. Live state must be checked
through the Cloudflare dashboard or API after John authorizes provisioning.

## Planned controls

1. Authoritative Domain Name System for `cryptosure.me`.
2. Proxied website records targeting the verified Vercel project.
3. A remotely managed Tunnel route for `api.cryptosure.me`.
4. Cloudflare Access for operator-only hostnames.
5. Managed web application firewall rules and narrow rate limits.
6. Turnstile on public submissions and authentication entry points.
7. Cache rules that accelerate static assets and bypass private or dynamic
   application traffic.
8. Privacy-respecting Web Analytics after consent and privacy review.

## Provisioning rule

Create configuration as code only after the Cloudflare account, zone, plan,
Vercel project, Hostinger service, and secret-management boundaries are
confirmed. Generated state and credentials must remain outside Git.

The detailed topology and control requirements are documented in
`../../docs/CLOUDFLARE_VERCEL_HOSTINGER_ARCHITECTURE.md`.
