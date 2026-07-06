# DIDz Credit Score → Insurance Pricing

**Date**: July 6, 2026
**Status**: Design (cross-repo: DIDz, AgenticDID, RWAz, CryptoSure)

The DIDz credit score is a **privacy-preserving reputation signal** that influences the
**cost** and **maximum coverage** available to a CryptoSure policyholder. This document
specifies the score, how CryptoSure consumes it in zero knowledge, and the changes needed
in **DIDz**, **AgenticDID**, and **RWAz** to source and propagate it.

---

## 1. What the DIDz credit score is

The DIDz ecosystem already documents a **Trust Score** oracle pattern
(`DIDz-io/docs/ORACLE_AND_API_INTEGRATION.md` §4): *multiple ecosystem signals →
oracle → "trust score = 98" → contract sees "high trust"*, revealing nothing about the
individual signals. CryptoSure formalizes that as the **DIDz credit score**:

- A composite score on a fixed scale (proposal: **0–1000**), computed **off-chain** by a
  scoring oracle from ecosystem signals, then **committed/attested on-chain** as a DIDz
  attestation (contents off-chain, commitment on-chain — DIDzM §0).
- Never revealed as a raw number on the wire. Consumers prove **bands / thresholds** in ZK.

### Candidate input signals (all privacy-preserving, off-chain)
- Account age & liveness (DIDz POL freshness).
- Attestation history quality (how many APPROVED, high-assurance issuers vouch).
- Repayment/settlement history from ecosystem apps (CareToCoin reclaim behavior,
  SplitNight IOU settlement, superSwap conduct).
- Absence from denylists (OFAC-style screening — CareToCoin design).
- CryptoSure-EDU certifications held (behavioral hygiene signal).
- RWAz asset-stewardship history (no fraud flags on registered assets).

> The oracle and signal weighting are policy, not protocol. The protocol only needs the
> **signed score attestation** and ZK band proofs.

## 2. How CryptoSure consumes it (ZK)

Underwriting (`quote()` / `buyPolicy()` / `activatePolicy()`) enforces two things using
only **boolean** disclosures:

### 2.1 Coverage cap gate
```
// tierMinScore[T0..T5] is a public table, e.g.:
//   T0 $500   -> 300     T3 $10k  -> 650
//   T1 $1,000 -> 400     T4 $25k  -> 750
//   T2 $5,000 -> 550     T5 $50k  -> 850
assert(disclose(scoreBandProof(tierMinScore[tier])), "Score too low for this tier");
```
The circuit learns only "score ≥ threshold for the requested tier." A low score therefore
**caps the maximum coverage** a holder can buy.

### 2.2 Premium band
```
// Premium multiplier chosen by the HIGHEST band the holder can prove:
//   band A (score >= 850) -> 0.6x
//   band B (score >= 700) -> 0.8x
//   band C (score >= 550) -> 1.0x
//   band D (score >= 300) -> 1.3x
```
The prover supplies the best band they can honestly prove; the circuit verifies the
threshold boolean and applies the corresponding multiplier from a **lookup table** (no
in-circuit division — house quirk). Raw score never appears.

### 2.3 The proof itself
A **witness-backed** score proof:
1. DIDz issues a signed **score attestation** to the holder's DID: commitment to
   `{ score, issuedAt, oracleId }`.
2. The holder's wallet computes `score >= threshold` off-chain and supplies the boolean +
   the attestation opening as a witness.
3. The circuit verifies the attestation commitment matches a DIDz-registered oracle and
   that the disclosed boolean is consistent — then uses only the boolean.
4. Freshness: `issuedAt` must be within a verifier-side window (stale scores rejected),
   mirroring DIDz POL freshness.

## 3. Changes needed in DIDz (source of truth)

**New: a Credit Score attestation type + band-proof circuit.** Proposed additions to the
DIDz contract family (design-only; validate via MCP before writing):

- Define a standard attestation type `hash("DIDZ-CREDIT-SCORE")` in `DIDzRegistry`.
- A **scoring oracle** is registered as a DIDz **Trusted Issuer** in
  `TrustedIssuerRegistry` with `primaryDomain = hash("CREDIT-SCORE")` and a high
  `AssuranceLevel` (REGULATED_ENTITY or SYSTEM_CRITICAL).
- The oracle calls `attest_to_did(holderDid, hash("DIDZ-CREDIT-SCORE"), scoreCommitment,
  expiry)` where `scoreCommitment = persistentHash([pad(32,"didz:score:v1"), score,
  issuedAt, oracleId])`.
- A reusable, exported band-proof circuit (lives in DIDz so every consumer shares it):
  ```
  export circuit prove_score_at_least(
    did_id: Bytes<32>,
    threshold: Uint<16>,
    score: Uint<16>,        // witness-opened
    issued_at: Uint<64>,
    oracle_id: Bytes<32>,
    salt: Bytes<32>
  ): [] {
    // re-derive commitment, assert it matches the stored attestation,
    // assert oracle is an approved CREDIT-SCORE issuer,
    // assert freshness, then:
    assert(disclose(score >= threshold), "Below threshold");
  }
  ```
  CryptoSure imports/uses this so pricing logic isn't duplicated.

## 4. Changes needed in AgenticDID (agent authority branch)

Agents can buy/manage insurance on behalf of a principal. The credit score interacts with
**delegated spend caps** (AgenticDID's `per_action_cap` + `cumulative_cap`):

- **Score-scaled caps:** a grant's caps may be expressed relative to the *principal's*
  score band — a higher-score principal can authorize an agent to buy up to a higher
  CryptoSure tier. Design: the grant records a `maxInsuranceTierByBand` and the agent must
  prove the principal's band at purchase time.
- **Agent-managed activation:** for high tiers the *holder signature* requirement still
  applies — an agent cannot self-satisfy the EDU signature. The principal (human) must sign
  the EDU acceptance; the agent orchestrates but cannot forge the acknowledgement. This
  keeps the "signed by the wallet holder" guarantee even under delegation.
- **Doc to add:** `AgenticDID/docs/CREDIT_SCORE_AND_INSURANCE.md` describing score-scaled
  caps and the non-delegable EDU signature.

## 5. Changes needed in RWAz (object / RWA branch)

For everyday coverage the insured object is an RWAz entry:

- **Insurable cap = f(owner score band, asset appraised-value band).** RWAz exposes the
  asset's appraised-value band (privacy-preserving); CryptoSure combines it with the
  owner's DIDz score band to set the cap. Neither raw value nor raw score is revealed.
- **Stewardship history feeds the score:** RWAz fraud flags / clean history on an owner's
  registered assets are a signal the scoring oracle can weight (§1).
- **Doc to add:** `RWAz/docs/CREDIT_SCORE_AND_INSURANCE.md` describing the
  cap = f(score band, value band) rule and the stewardship signal.

## 6. Privacy guarantees (summary)

| Fact | On-chain | Revealed to insurer |
|------|----------|--------------------|
| Raw credit score | ❌ (commitment only) | ❌ (band boolean only) |
| Which band met | ❌ | ✅ (as a boolean threshold proof) |
| Identity | ❌ (DIDz commitment) | ❌ |
| Signal inputs | ❌ (off-chain oracle) | ❌ |
| Score freshness (issuedAt) | committed | verified in ZK, not shown |

## 7. Anti-gaming notes

- The score attestation must come from a **registered, high-assurance oracle** — a holder
  can't self-issue a 1000.
- **Freshness windows** stop replay of an old high score after conduct declines.
- **Bands, not raw values**, limit information leakage and grinding.
- Denylist screening (CareToCoin design) hard-blocks sanctioned wallets regardless of score.

## 8. Open questions

- Exact scale (0–1000 vs 300–850 bureau-style) and band cutoffs — tune with the demo.
- Whether the scoring oracle is one Foundation service or a small approved set (multi-oracle
  median for robustness).
- How much CryptoSure-EDU completion should move the score vs. just lower premium directly.
