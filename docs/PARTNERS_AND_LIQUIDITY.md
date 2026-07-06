# CryptoSure — Partners & Liquidity Providers

> **Who funds the pool, who trusts the claims, and who we're calling.**

---

## Overview

CryptoSure's premium pool is a shielded Treasury/Pot on Midnight. It collects
premiums, holds reserves, and pays claims via escrow-style release. For the
protocol to work at scale, we need three categories of external partners:

1. **Liquidity providers (LPs)** — capital that seeds and backstops the pool
2. **Strategic partners** — ecosystems, platforms, and infrastructure we integrate with
3. **Forensic recovery partners** — specialists who trace and recover stolen crypto, reducing claim payouts

This document outlines each category, the value proposition for partners, and
open calls for collaboration.

---

## 1. Liquidity Providers (LPs)

### Why LPs matter

The premium pool must be solvent from day one. Premiums alone won't cover a
large early claim. LPs provide the initial reserve capital that makes the
insurance credible. In return, LPs earn a share of premium revenue and
investment yield, proportional to their contribution.

### LP tiers

| Tier | Minimum commitment | Role | Return model |
|------|-------------------|------|-------------|
| **Seed LP** | $50,000 | Early backstop, pre-launch | Pro-rata share of premium revenue + protocol governance weight |
| **Anchor LP** | $250,000 | Post-launch reserve, visible name | Higher revenue share, co-marketing, board observer |
| **Strategic LP** | $1,000,000+ | Long-term reserve, ecosystem alignment | Best revenue terms, governance board seat, priority claim on forensic recoveries |

### LP risk & transparency

- LP capital is **not** a donation — it's at risk. If claims exceed reserves,
  LPs can lose principal. This is insurance, not a yield farm.
- The pool's **shielded balance** is visible on Midnight (total reserves are
  public; individual LP contributions are shielded).
- Claims payouts require a **ZK proof** — LPs can audit the claim verification
  logic without seeing claimant PII.
- **Forensic recovery** reduces LP risk: recovered stolen funds return to the
  pool, offsetting claim payouts (see §3 below).

### Target LP profiles

- **Crypto-native funds** — DeFi insurance pools, crypto VCs with treasury
  management mandates
- **Traditional insurtech investors** — reinsurance sidecars, ILS funds
  exploring crypto exposure
- **DIDz ecosystem participants** — existing DIDzM contributors who want to
  back the insurance layer they helped build
- **Gaming industry partners** — platforms and publishers interested in the
  gaming asset insurance pilot (see
  [`docs/GAMING_ASSET_INSURANCE.md`](GAMING_ASSET_INSURANCE.md))

### LP onboarding flow (demoLand → realDeal)

```
demoLand: Simulated LP commitments, simulated pool balances,
           simulated claim events and payouts.

realDeal:  Real capital commitment → legal agreement →
           shielded pool deposit on Midnight →
           governance attestation → revenue distribution.
```

---

## 2. Strategic Partners

### 2.1 Ecosystem & infrastructure partners

| Partner type | What they provide | What CryptoSure provides |
|-------------|-------------------|------------------------|
| **Wallet providers** (hardware + software) | Integration point for wallet-ownership proofs, EDU distribution | Insurance offering for their users, EDU curriculum co-branding |
| **Custodians** (regulated) | Qualified custody for LP reserves (fiat side) | Insurance product for their custodied assets |
| **Chain analytics firms** | Transaction tracing for claims verification | Forensic recovery partnership (see §3) |
| **Reinsurers** | Risk transfer for catastrophic loss scenarios | Access to a novel, ZK-verifiable risk pool |
| **Oracle providers** | Price feeds for asset valuation, on-chain event data | Consumer of oracle data for parametric triggers |

### 2.2 DIDz ecosystem partners (internal)

These are DIDzMonolith repos we already integrate with:

| Partner | Integration |
|---------|------------|
| **DIDz.io** | Policyholder identity, credit score attestation |
| **AgenticDID** | Agent-managed policies, delegated caps |
| **RWAz** | Real-world asset registry as insured objects |
| **KYCz** | Higher-assurance underwriting for top tiers |
| **SCIFz** | Nullifier/anti-double-claim, Merkle membership |
| **TrustedIssuerRegistry** | EDU certifier approval |
| **EncryptVault** | Wallet-ownership proofs |

See [`docs/DIDzM_REUSE.md`](DIDzM_REUSE.md) for the full reuse map.

### 2.3 Distribution partners

| Partner type | Value |
|-------------|-------|
| **Crypto exchanges** | Offer CryptoSure wallet insurance at checkout / custody off-ramp |
| **Gaming platforms** | Offer gaming asset insurance as an add-on (pilot) |
| **DeFi protocols** | Insurance for protocol participants' self-custodied positions |
| **Employers / HR platforms** | Offer CryptoSure as a benefits perk (everyday coverage) |

---

## 3. Forensic Recovery Partners — OPEN CALL

### Why forensic recovery is core to CryptoSure

Crypto's greatest insurance advantage is its **immutability and trackability**.
Unlike cash or physical goods, stolen crypto leaves a permanent, public trail.
Every transfer is recorded on-chain forever. With the right tools and partners,
stolen funds can often be:

1. **Traced** — following the flow through mixer attempts, sub-addresses, and exchanges
2. **Frozen** — when they land at a regulated exchange, law enforcement can freeze them
3. **Recovered** — returned to the victim (and thus to the insurance pool)

This means CryptoSure's claims aren't just payouts — they're **active recovery
operations**. Every dollar recovered is a dollar the pool keeps. This is a
structural advantage no traditional insurer has.

See [`docs/FORENSIC_RECOVERY.md`](FORENSIC_RECOVERY.md) for the full case.

### What we need from forensic recovery partners

| Capability | Description |
|-----------|-------------|
| **On-chain tracing** | Follow stolen funds across chains, through mixers, to exit points |
| **Exchange liaison** | Relationships with major exchanges (Binance, Coinbase, Kraken, etc.) for freeze requests |
| **Law enforcement coordination** | FBI IC3, local law enforcement, and international (Europol, Interpol) liaison |
| **Legal support** | Civil recovery actions, subpoenas, court orders for fund return |
| **Speed** | Rapid response within hours of a confirmed theft — before funds are cashed out |
| **Reporting** | Chain-of-custody documentation suitable for insurance claim files |

### Forensic recovery partner economics

Partners are compensated on a **success fee** model:

- **No recovery, no fee** — partners are paid from recovered funds, not from
  the premium pool
- **Typical success fee**: 10–20% of recovered amount (industry standard for
  crypto recovery)
- **Pool benefit**: 80–90% of recovered funds return to the pool, offsetting
  the claim payout
- **LP benefit**: Recoveries reduce net claims, protecting LP principal

### Call for partners

We are actively seeking forensic recovery firms as partners. Ideal partners
have:

- Proven track record of crypto recovery (not just tracing — actual fund return)
- Exchange relationships and law enforcement liaison capability
- Willingness to work with a ZK-proof-based insurance protocol (the claim proof
  triggers the recovery engagement — no PII shared until legally required)
- Geographic coverage (US + international)

**Contact**: John M.P. Santi — EnterpriseZK Labs; Midnight Ambassador.
Reach via the DIDz ecosystem: [didz.io](https://didz.io)

---

## 4. Partner Integration Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     CRYPTOSURE PROTOCOL                      │
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐    │
│  │ Premium   │  │ Policy   │  │ Claim    │  │ EDU      │    │
│  │ Pool      │  │ Registry │  │ Engine   │  │ Certifier│    │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘    │
│       │              │              │              │          │
│  ┌────┴──────────────┴──────────────┴──────────────┴─────┐  │
│  │              Midnight shielded state                   │  │
│  └────────────────────┬───────────────────────────────────┘  │
│                       │                                      │
└───────────────────────┼──────────────────────────────────────┘
                        │
           ┌────────────┼────────────────────────┐
           │            │                        │
    ┌──────v──────┐  ┌──v──────────┐  ┌─────────v─────────┐
    │ LP Capital   │  │ DIDz        │  │ Forensic Recovery  │
    │ (seed/anchor)│  │ Ecosystem   │  │ Partners           │
    └──────────────┘  │ (identity,  │  │ (tracing, freeze,  │
                      │  score, EDU)│  │  recovery)         │
                      └─────────────┘  └────────────────────┘
```

---

## 5. Partner Categories Summary

| Category | Status | Action |
|----------|--------|--------|
| Seed LPs | Seeking | Open to conversations with crypto-native funds |
| Anchor LPs | Seeking | Targeting insurtech investors, reinsurance sidecars |
| Wallet providers | Researching | Identify hardware + software wallets for EDU integration |
| Chain analytics | Researching | Evaluate Chainalysis, TRM Labs, Elliptic for tracing |
| Forensic recovery | **Open call** | Actively seeking recovery firms (success-fee model) |
| Reinsurers | Future | Post-pilot, for catastrophic risk transfer |
| Gaming platforms | Future | For gaming asset insurance pilot |
| Exchanges | Future | Distribution channel + freeze cooperation for recovery |

---

## 6. Disclosure

CryptoSure is in the design phase. No LP commitments, insurance policies, or
partner agreements are currently active. All references to partner categories
represent target relationships, not existing ones. The demoLand environment
simulates all partner interactions for demonstration purposes.

Real capital, real policies, and real partnerships require:
- Licensed insurer (VT captive formation in progress)
- Regulatory approval (WV sandbox application planned)
- Legal agreements (LP subscription agreements, partner MOUs)
- Audited smart contracts (4 Compact contracts written + compile-validated via Midnight MCP; full ZK key generation + security audit pending)
