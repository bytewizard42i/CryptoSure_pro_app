# CryptoSure — Concept

**Date**: July 6, 2026
**Status**: Design deep-dive

---

## 1. The core idea

Insurance is a promise: *"if a defined bad thing happens to you, we make you whole up to a
limit, in exchange for a premium priced to your risk."* Every part of that promise
normally requires the insurer to know a great deal about you — who you are, what you own,
where you live, your history, your credit. CryptoSure keeps the promise while collapsing
the disclosure to **zero-knowledge proofs of exactly the facts that matter**.

CryptoSure covers **two worlds** from one engine:

- **`CryptoSure.me` — everyday insurance.** The ordinary things people insure in the
  physical world. Phones, laptops, cameras, bikes, e-bikes, musical instruments, tools,
  small jewelry, rental/deposit protection, ticketed-event protection, and similar
  everyday risks. The insured object can be an **RWAz registry entry** (a real-world asset
  already committed on-chain), and underwriting proves risk class without revealing the
  full inventory or the owner.

- **`CryptoSure.app` — crypto wallet insurance.** Coverage for self-custodied wallets
  against a **defined, honestly-scoped** set of loss events. Sold in fixed tiers:
  **$500, $1,000, $5,000, $10,000, $25,000, $50,000.** Because self-custody insurance is
  easy to do dishonestly, CryptoSure is deliberately explicit about scope (see
  `INSURANCE_TIERS.md` §"What is and is not covered") and gates the larger tiers behind
  education (`CRYPTOSURE_EDU.md`).

## 2. Why the two worlds share one engine

Both worlds reduce to the same primitives:

1. A **policyholder** (a DIDz commitment — never an identity on the wire).
2. An **insured thing** (an RWA entry for everyday; a wallet-ownership commitment for crypto).
3. A **coverage limit** (a tier, or an appraised value band).
4. A **premium** (priced by risk class + DIDz credit-score band).
5. A **scope** (the exact "what's covered" text, committed as a hash the holder accepts).
6. A **pool** that holds premiums and pays claims.
7. A **claim** (a ZK proof that a covered event happened) → a **payout** from the pool.

The only material differences are the *scope text*, the *risk model*, and the *EDU gating*
— all of which are data, not new machinery. So we build **one** contract family and
parameterize it per world.

## 3. The honesty model (this matters)

Crypto "insurance" has a bad reputation because too much of it is either (a) unfunded
promises, or (b) scope so vague the claim is always denied. CryptoSure's design principles:

- **The pool is real and on-chain.** Premiums accumulate in a shielded Treasury/Pot the
  public can see the *balance* of (not the contributors). Payout capacity is auditable.
- **Scope is a signed hash, not marketing copy.** The policyholder accepts a specific
  version of "what is and isn't covered." That version's hash is bound into the policy.
  Nobody can later argue about which terms applied.
- **We say plainly what we do NOT cover.** Voluntary transfers to a scammer, signing a
  malicious approval after failing the phishing module you were taught, forgotten seed
  phrases where recovery was declined, protocol/smart-contract exploits of third-party
  dApps (unless a rider is bought), and market losses are **not** covered. The covered set
  is narrow and specific. See `INSURANCE_TIERS.md`.
- **Education is a precondition, not an upsell.** For meaningful coverage you must
  demonstrate you understand what you're insuring. The signature on the EDU cert is the
  holder acknowledging the scope and their own responsibilities.

## 4. Privacy posture (DIDzM §0)

Following the DIDz ecosystem privacy default — **everything private by default, prove and
share selectively**:

- **On-chain (public):** policy exists; tier/coverage band; policy status
  (active/lapsed/claimed); pool balance; claim status bits; EDU-certified bit.
- **Off-chain / committed (private):** policyholder identity, wallet address, asset
  inventory and serials, the credit-score value (only the *band* is proven), premium
  amount (shielded), claim evidence (disclosed only to the adjuster), EDU answers.
- **Revealed one bit at a time via ZK:** "score ≥ tier threshold," "holder is certified
  for scope vX," "a covered event occurred," "this wallet is the insured wallet."

## 5. The DIDz credit score, in one paragraph

The DIDz ecosystem already documents a **Trust Score** oracle pattern (composite
reputation from multiple ecosystem signals, revealed as a band, not raw signals). CryptoSure
consumes that as a **DIDz credit score**: a privacy-preserving 0–1000-style band proven in
zero knowledge. A higher score **lowers the premium** and **raises the maximum tier** a
holder may buy. The score itself never appears on-chain — the underwriting circuit checks
"score ≥ threshold for this tier/discount" and learns only that boolean. This same score is
surfaced from **DIDz** (the source of truth), consumed by **AgenticDID** (an agent's
delegated spend caps can scale with the principal's score) and **RWAz** (an owner's score
plus the asset's appraised value set the insurable cap). See `DIDZ_CREDIT_SCORE.md`.

## 6. Who uses it

- **Individuals** insuring a laptop or a $5k wallet.
- **Agents (AgenticDID)** managing a principal's coverage under a spend-capped grant.
- **RWA owners (RWAz)** attaching coverage to a registered real-world asset.
- **Institutions (KYCz path)** wanting a regulated higher-assurance underwriting flow for
  the largest tiers.

## 7. What success looks like for the demo

A user (demoLand) can: mint/point a DIDz, prove a credit-score band, buy a $1,000 wallet
policy (EDU suggested, discount applied if certified), see the premium enter the pool, then
— for a $10,000 policy — be required to complete CryptoSure-EDU and sign the scope before
activation, and finally file a mock claim that pays out from the pool after a ZK check.
