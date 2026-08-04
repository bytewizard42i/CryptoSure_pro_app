# CryptoSure.pro DemoLand Website Specification

**Version:** 0.1
**Date:** July 20, 2026
**Current implementation:** `frontend-landing/`

## Purpose

CryptoSure.pro is the public trust, education, and demand-validation site. It introduces crypto wallet and digital-asset protection to customers, businesses, underwriters, brokers, forensic partners, and capacity providers. The future CryptoSure.app will be the authenticated product application for eligibility, policy, evidence, claim, and partner workflows.

DemoLand is a simulation. It must never imply that EnterpriseZK Labs or CryptoSure currently offers, sells, binds, issues, or guarantees insurance.

## Primary message

**Where crypto protection is a Sure thing!**

The line is memorable, but the surrounding copy must avoid suggesting guaranteed recovery or guaranteed claim payment. The promise is that coverage rules, evidence, and response can be clearer and more verifiable, not that every loss is recoverable.

## Audiences and calls to action

### Customers and businesses

Primary button: **I want crypto insurance**

The path should help visitors:

- understand the four initial coverage tiers;
- see which loss categories might be considered;
- learn what security behaviors improve eligibility;
- understand that displayed pricing is illustrative;
- join a nonbinding research or pilot-interest list.

### Underwriters and insurance providers

Primary button: **I want to provide insurance**

The path should separate four partner roles:

- underwriting or carrier paper;
- capacity and reinsurance;
- broker, embedded, wallet, exchange, or business distribution;
- claims, forensics, recovery, sanctions, and evidence technology.

## Current DemoLand page structure

1. Persistent amber DemoLand disclosure.
2. Fixed cinematic background with readable dark overlays.
3. Hero message and split customer/provider calls to action.
4. Three principles: verifiable eligibility, privacy-aware evidence, and defined coverage.
5. Interactive $500, $1,000, $5,000, and $10,000 tier explorer.
6. Annual and monthly illustrative price toggle.
7. Security-control preview.
8. Partner-role explorer.
9. Claims and recovery workflow.
10. Frequently asked questions.
11. Local-only DemoLand interest simulation.
12. Legal and pre-launch disclosures.

## DemoLand interaction rules

- Price cards must say **illustrative**, **hypothesis**, or **DemoLand**.
- The form must clearly state that it does not transmit or store information.
- No input may be represented as an insurance application.
- No button may say buy, bind, activate, issue, or file a claim.
- Success messages must say the interaction was simulated.
- No countdown timers, scarcity claims, fake testimonials, or fake partner logos.
- Named partners may appear only after written permission or as accurately sourced market research, never as implied endorsements.
- Recovery must be described as possible and evidence-driven, never certain.
- The word underwriter must identify the actual risk-bearing or delegated party accurately.

## Production boundary

| CryptoSure.pro | CryptoSure.app |
|---|---|
| Public education and brand | Authenticated insurance experience |
| Coverage concepts and illustrative tiers | Carrier-approved quotes and eligibility |
| Partner-interest capture | Policy application and binding |
| DemoLand simulation | Production identity and consent |
| Public disclosures and FAQ | Policy documents and notices |
| Research waitlist | Payments, claims, evidence, and status |

The landing site should remain independently deployable. Production account, policy, and claim functionality belongs in CryptoSure.app and should not be slipped into the marketing site.

## Content approval workflow

Before the public site presents live insurance information, each content class needs an owner:

| Content | Required owner or reviewer |
|---|---|
| Legal entity and role description | Insurance regulatory counsel |
| Coverage, exclusions, conditions, cancellation | Carrier and coverage counsel |
| Rates, fees, deductibles, taxes | Carrier, actuary, and compliance |
| Security requirements | Underwriting, security, and claims |
| Claims and recovery language | Carrier claims lead and forensic partner |
| Privacy and data use | Privacy counsel and security lead |
| Accessibility and consumer comprehension | Product and accessibility reviewer |
| Partner names and marks | Partner legal or brand approval |

## Technical architecture

- Next-compatible vinext frontend in `frontend-landing/`.
- React components with semantic HTML and CSS.
- Fixed WebM background with a static poster fallback.
- No database, authentication, or customer-record storage in DemoLand.
- No secrets embedded in client code.
- Reduced-motion support, keyboard focus states, responsive layouts, and adequate contrast.
- Open Graph and social-card metadata for CryptoSure.pro.
- Future analytics should be privacy-respecting and should not collect wallet addresses, policy evidence, seed phrases, or sensitive financial information.

## Recommended production analytics

Track only what helps validate product demand:

- customer versus provider CTA selection;
- tier interest;
- partner-role interest;
- FAQ engagement;
- demo-interest completion;
- qualified underwriter or broker referrals;
- source campaign and jurisdiction at coarse granularity.

Never collect private keys or seed phrases. Treat wallet addresses as sensitive pseudonymous identifiers and avoid them on the public site.

## Copy guardrails

Prefer:

- “Explore proposed protection”
- “Illustrative starting price”
- “Subject to carrier approval, underwriting, availability, and final policy terms”
- “Recovery may reduce loss severity when assets can be traced or restrained”
- “CryptoSure is developing a carrier-backed program”

Avoid:

- “Guaranteed recovery”
- “Your wallet is fully protected”
- “Coverage starts now”
- “CryptoSure will reimburse every hack”
- “Risk-free”
- “Approved by Pennsylvania” unless the exact approval exists and counsel authorizes the statement

## Launch checklist

### DemoLand public preview

- [x] Two clear audience paths.
- [x] Four initial tiers.
- [x] Fixed background and mobile fallback.
- [x] Partner-role explanation.
- [x] FAQ and disclosures.
- [x] Local-only interest simulation.
- [x] Reduced-motion and keyboard-focus support.
- [ ] Regulatory counsel copy review.
- [ ] Trademark and domain review.
- [ ] Privacy policy and terms appropriate to actual data collection.
- [ ] Real form processor and consent language, only when authorized.
- [ ] Analytics selection and consent review.
- [ ] Accessibility audit with keyboard, screen reader, zoom, and contrast checks.
- [ ] Performance and cross-browser verification.

### Production insurance launch

- [ ] Carrier and licensed entity identified everywhere required.
- [ ] Jurisdiction and availability restrictions enforced.
- [ ] Rates and forms approved or lawfully placed.
- [ ] Producer and entity licenses active.
- [ ] Appointments active.
- [ ] Privacy, cybersecurity, sanctions, fraud, complaints, and records procedures approved.
- [ ] Policy documents, notices, e-signature, payment, cancellation, and claim flows approved.
- [ ] Security audit and incident-response rehearsal completed.
