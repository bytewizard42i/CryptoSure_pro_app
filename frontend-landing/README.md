# CryptoSure.me DemoLand Landing Site

The public pre-launch experience for CryptoSure, built as a clean, futuristic landing
page for customers, businesses, underwriters, brokers, capacity providers, and forensic
partners.

**Public domain:** `CryptoSure.me`
**Future authenticated application:** `CryptoSure.app`

This project is intentionally a **DemoLand simulation**. It does not quote, sell, bind,
issue, or guarantee insurance. The interest form stores and transmits nothing.

The design rationale and current insurance website research are documented in
[`../docs/INSURANCE_WEBSITE_USER_EXPERIENCE_RESEARCH.md`](../docs/INSURANCE_WEBSITE_USER_EXPERIENCE_RESEARCH.md).

## Prerequisites

- Node.js `>=22.13.0`

## Quick Start

```bash
npm install
npm run dev
npm run build
```

Open the local development URL printed by the command, normally
`http://localhost:3000`.

During local development, the landing page shows a truth-labeled doorway to the
shared DemoLand product application at `http://127.0.0.1:3014/login`. The doorway
is hidden from deployed builds unless `NEXT_PUBLIC_CRYPTOSURE_APP_URL` is set to
a reviewed HTTPS destination. Copy `.env.example` to `.env.local` only when a
different local or preview destination is required.

## Included experience

- fixed cinematic WebM background with poster fallback;
- two primary paths: “I want crypto insurance” and “I want to provide insurance”;
- interactive $500, $1,000, $5,000, and $10,000 coverage concepts;
- annual and monthly illustrative pricing toggle;
- customer security-control preview;
- partner-role explorer for underwriting, capacity, distribution, and recovery;
- proposed claims and recovery workflow;
- FAQ and launch disclosures;
- local-only interest simulation;
- responsive, keyboard-focus, and reduced-motion behavior;
- social sharing card and favicon.

## Main files

- `app/page.tsx`: public page structure and copy.
- `app/demo-experience.tsx`: client-side tier, partner, banner, and form interactions.
- `app/globals.css`: visual system, responsive rules, accessibility, and motion.
- `app/layout.tsx`: metadata and social-sharing configuration.
- `public/protocol-field.webm`: cinematic background.
- `public/protocol-field-poster.jpg`: video fallback.
- `public/og.png`: social-sharing image.
- `.openai/hosting.json`: optional Sites hosting configuration.

## Safety and content boundaries

- Every displayed price is illustrative and not a quote.
- No partner is implied to endorse CryptoSure.
- Recovery is possible, not certain.
- No private key, seed phrase, wallet address, policy evidence, or sensitive financial
  information should be collected by the public landing page.
- The product-application doorway is navigation only. It does not embed the
  authenticated application into the public marketing origin.
- Real application, policy, payment, evidence, and claim workflows belong in
  `CryptoSure.app` after carrier, legal, licensing, and security approvals.
- Review `../docs/WEBSITE_DEMOLAND_SPEC.md` before connecting data collection or changing
  the insurance language.

## Deployment targets

- `npm run dev`: start the primary Next.js development server.
- `npm run build`: create the primary Vercel production bundle.
- `npm run test:vercel`: build and verify the Vercel security boundary.
- `npm run dev:sites`: start the preserved Cloudflare-compatible Sites workflow.
- `npm run build:sites`: create the preserved Sites production bundle.
- `npm run test:sites`: build and verify the rendered Sites output.
- `npm test`: verify both supported deployment paths.

The proposed Cloudflare, Vercel, and Hostinger boundary is documented in
`../docs/CLOUDFLARE_VERCEL_HOSTINGER_ARCHITECTURE.md`.

## Deployment gate

Do not publish the site or connect a real waitlist until John authorizes publication and
the current disclosure and data-handling plan has been reviewed.
