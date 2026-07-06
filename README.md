# CryptoSure 👉

> **Insurance you can prove, priced by who you are — without revealing who you are.**

[![Built on Midnight](https://img.shields.io/badge/Built_on-Midnight_Network-6C3FC5?style=for-the-badge)](https://midnight.network)
[![Powered by DIDz](https://img.shields.io/badge/Powered_by-DIDz.io-3B82F6?style=for-the-badge)]()
[![Domain](https://img.shields.io/badge/Domains-CryptoSure.me_·_CryptoSure.app-10B981?style=for-the-badge)]()

Part of the **[DIDz ecosystem](https://github.com/bytewizard42i/DIDzMonolith)**.

---

## What Is CryptoSure?

CryptoSure is a **privacy-preserving insurance protocol** on Midnight. It covers two
worlds:

1. **Everyday insurance** (`CryptoSure.me`) — the ordinary things people insure in the
   physical world: devices, gadgets, bikes, instruments, small valuables, event/ticket
   protection, rental deposits, and other everyday risks. Policies are underwritten with
   ZK proofs so the insurer learns *eligibility and risk class* without learning the
   policyholder's identity or full asset inventory.

2. **Crypto wallet insurance** (`CryptoSure.app`) — coverage for self-custodied crypto
   wallets against a defined, honest set of loss events (see the scope doc — we are
   explicit about what is and is **not** covered). Coverage is sold in fixed tiers:
   **$500 · $1,000 · $5,000 · $10,000 · $25,000 · $50,000**.

The premium you pay and the maximum coverage you can buy are influenced by your
**DIDz credit score** — a privacy-preserving reputation signal proven in zero knowledge.
Higher score → lower premium and higher available cap. The insurer verifies the score
band without seeing the underlying signals or your identity.

---

## The three pillars of CryptoSure

| Area | Domain | What it does |
|------|--------|--------------|
| **Everyday coverage** | `CryptoSure.me` | Policies for real-world items and risks, ZK-underwritten. |
| **Crypto wallet coverage** | `CryptoSure.app` | Tiered wallet insurance ($500 → $50k) against a defined loss set. |
| **CryptoSure-EDU** | both | Wallet-hygiene certification. **Suggested** for low tiers, **required** (and signed by the wallet holder) to activate high tiers. |

---

## CryptoSure-EDU: earn your coverage

Insurance for self-custody is only honest if the insured understands self-custody. So
CryptoSure gates the larger tiers behind a **certification**:

- **Curriculum**: wallet hygiene, seed-phrase custody, phishing/approval-drainer
  awareness, hardware-wallet use, recovery planning, and — critically — **what the policy
  is and is not responsible for**.
- **Low tiers ($500, $1,000)**: EDU is **suggested**. A completed cert lowers the premium.
- **High tiers ($5,000 and up)**: EDU is **required**. The certification must be
  **cryptographically signed by the wallet holder** (proving they read and accepted the
  scope and their responsibilities) before the policy can be **activated**.
- The cert is issued as a **DIDz attestation** from an approved CryptoSure-EDU issuer and
  proven in zero knowledge at policy activation — the insurer confirms "holder is
  certified and signed the current scope" without seeing the holder's identity.

See [`docs/CRYPTOSURE_EDU.md`](docs/CRYPTOSURE_EDU.md).

---

## Why Midnight?

Insurance is a data-maximalist industry: to price and pay a policy, insurers historically
demand identity, full asset disclosure, location, and history. Midnight inverts that.

| Requirement | Traditional insurer | CryptoSure (Midnight) |
|-------------|--------------------|------------------------|
| Underwriting | Full PII + asset disclosure | ZK proof of risk class + score band |
| Identity | Required | Never revealed; DIDz commitment only |
| Credit/reputation | Bureau pull, full history | ZK proof of DIDz score band (one bit of "≥ tier") |
| Certification | Paper/PDF, unverifiable | DIDz attestation, ZK-verified, holder-signed |
| Premium pool | Opaque insurer balance sheet | On-chain shielded pool (Treasury/Pot pattern) |
| Claims | Adjuster sees everything | ZK claim proof + selective disclosure to adjuster only |
| Payout | Trust the insurer | On-chain escrow release from the pool |

---

## Architecture (one paragraph)

A **premium pool** (shielded Treasury/Pot) accumulates premiums. A **policy** is a
commitment binding a policyholder DIDz, a coverage tier, a scope hash (the exact
"what's covered" text they accepted), and — for wallet policies — an EDU certification
commitment. **Underwriting** verifies a DIDz credit-score band in ZK to set premium and
cap. **Activation** (high tiers) requires a holder-signed EDU cert proof. A **claim** is a
ZK proof that a covered loss event occurred, with selective disclosure to an adjuster;
an approved claim triggers an **escrow-style payout** from the pool. All identity, asset,
and score details stay off-chain as commitments; only status bits and pool balances are
public.

Full detail in [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

---

## Built on DIDzM (we reuse, we don't reinvent)

| DIDz product | What CryptoSure borrows |
|--------------|-------------------------|
| **DIDz.io** | Policyholder identity as a commitment; selective proofs; the **DIDz credit score** signal. |
| **AgenticDID** | Agent-run policies (an authorized agent buys/manages coverage under a spend-capped grant); credit score affects an agent's delegated caps. |
| **RWAz** | Real-world-asset registry entries as the *insured object* for everyday coverage; RWA value + score feed the cap. |
| **KYCz** | Optional higher-assurance underwriting for the largest tiers (regulated path). |
| **SCIFz** | Nullifier + Merkle-membership + revocation + audit primitives for claims/anti-double-claim. |
| **TrustedIssuerRegistry** (DIDz) | Approves CryptoSure-EDU certification issuers by domain + assurance tier. |
| **EncryptVault** | Wallet-ownership proofs tied to the insured wallet. |

See [`docs/DIDzM_REUSE.md`](docs/DIDzM_REUSE.md).

---

## Repo layout

| Path | Purpose |
|------|---------|
| `docs/CONCEPT.md` | The idea, the two worlds, the honesty model. |
| `docs/ARCHITECTURE.md` | Premium pool, policy, underwriting, activation, claim, payout. |
| `docs/INSURANCE_TIERS.md` | Everyday coverage + crypto wallet tiers, EDU gating per tier. |
| `docs/CRYPTOSURE_EDU.md` | Certification curriculum, holder-signed activation, ZK verification. |
| `docs/DIDZ_CREDIT_SCORE.md` | How the DIDz credit score sets premium + cap; DIDz/AgenticDID/RWAz integration. |
| `docs/DIDzM_REUSE.md` | What we lift from the DIDz family first. |
| `contracts/` | Compact contract design (pool, policy, EDU cert, claim). Design-only for now. |
| `ROADMAP.md` | Phased plan from concept to demo. |

---

## Status

Early scaffold (2026-07-06). Concept + architecture + tier model + EDU flow + DIDz credit
score integration. No production Compact code yet — contract design validated via the
Midnight MCP (skipZk) before any `.compact` is written. Private while the design matures.

demoLand/realDeal: this repo follows the DIDzMonolith demoLand convention (amber
`🎭 DEMO MODE` banner, 7-auth-method standard) for any web frontend.

## Author

John M.P. Santi — EnterpriseZK Labs; Midnight Ambassador. Part of the DIDzMonolith
(DIDzM) ecosystem.

---

## DIDz Ecosystem

This project is part of the DIDz ecosystem — a suite of privacy-preserving identity,
credential, and application tools built on Midnight Network.

![DIDz Ecosystem Map](docs/DIDz-ecosystem-map.png)

See the full ecosystem map above, or visit [didz.io](https://didz.io) for details.
