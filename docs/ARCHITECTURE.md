# CryptoSure — Architecture

**Date**: July 6, 2026
**Status**: Design (contracts not yet written; validated via Midnight MCP before coding)

This document maps the insurance lifecycle onto Midnight/Compact primitives, reusing the
patterns catalogued in `midnight-expert` (the primary source of truth) and the DIDz
contract family.

---

## 1. Component overview

```
CryptoSure Engine
│
├── PremiumPool            (shielded Treasury/Pot — holds premiums, pays claims)
│     ├── contribute()          premium in  (receiveShielded + mergeCoinImmediate)
│     ├── payClaim()            payout out  (sendShielded to claimant)
│     └── reserves()            public pool balance (auditable capacity)
│
├── PolicyRegistry         (policy commitments + lifecycle)
│     ├── quote()               ZK underwrite: score band + risk class → premium, cap
│     ├── buyPolicy()           bind holder DIDz + tier + scopeHash + eduCommit
│     ├── activatePolicy()      high tiers: require holder-signed EDU cert proof
│     ├── lapse()/renew()       lifecycle
│     └── status queries        active / lapsed / claimed (public bits)
│
├── EduCertifier           (CryptoSure-EDU certification)
│     ├── issuer approval       via DIDz TrustedIssuerRegistry (domain "CRYPTOSURE-EDU")
│     ├── issueCert()           DIDz attestation, scope-bound
│     └── verifyCertForScope()  ZK: certified AND signed current scope vX
│
└── ClaimEngine            (claims + payout)
      ├── submitClaim()         ZK proof a covered event occurred
      ├── nullifier             anti-double-claim (SCIFz pattern)
      ├── adjust()              selective disclosure to adjuster only
      └── resolve()             approve → PremiumPool.payClaim(); or deny (with reason hash)
```

## 2. The premium pool (Treasury/Pot pattern)

Directly reuses `midnight-expert` → `value-handling-patterns.md` → **Treasury / Pot**:

- Premiums arrive as shielded coins: `receiveShielded(disclose(coin))`, first contribution
  `writeCoin`, subsequent `mergeCoinImmediate`.
- The pool **balance is public** (`QualifiedShieldedCoinInfo.value`) — this is a feature:
  it makes payout capacity auditable, which is the honesty guarantee.
- **Individual premium amounts are shielded** at the wallet edge; the pool sees coins, not
  contributor identities.
- Payouts use the **Escrow** pattern's `sendShielded` with change-handling
  (`result.change`), releasing the claim amount to the approved claimant.

> Privacy trade-off (documented): pool balance and payout amounts are visible. Contributor
> and claimant identities are not. For MVP this is the right balance between auditability
> and privacy. A fully-private pool (funds in a contract-controlled shielded address) is a
> later option.

## 3. Policy as a commitment

A policy binds, as an on-chain commitment:

```
policyId = persistentHash([
  pad(32, "cryptosure:policy:v1"),
  holderDidCommitment,     // from DIDz — never the identity
  tierCode,                // 0..5 for $500..$50k, or an appraised-value band for .me
  scopeHash,               // hash of the exact "what's covered" text vX the holder accepted
  eduCommit                // commitment to the EDU cert (0 if none / low tier)
])
```

Public ledger stores: `policyId → { tier, status, scopeVersion, eduRequired, eduSatisfied }`.
Everything binding the *person* stays a commitment. The **scopeHash** is the anti-dispute
mechanism: the terms are frozen into the policy.

## 4. Underwriting: DIDz credit score → premium + cap (ZK)

The heart of the pricing model. `quote()` / `buyPolicy()` takes a **ZK proof of a DIDz
credit-score band** (see `DIDZ_CREDIT_SCORE.md`) and enforces:

1. **Cap gate:** `assert(disclose(score >= minScoreForTier[tier]))` — you cannot buy a
   tier your score doesn't unlock. The circuit learns only the boolean.
2. **Premium band:** premium multiplier is chosen from the proven score band
   (e.g. band A = 0.6×, band B = 0.8×, band C = 1.0×, band D = 1.3×). The raw score never
   appears; only which band's threshold was met.
3. **Risk class:** for `.me`, an RWAz-derived risk class (asset type/age) adjusts premium;
   for `.app`, the tier + EDU status adjust it.

Because Compact circuits are deterministic and the score is a witness, the score band is
supplied as a **witness-backed proof** (the prover computes "score ≥ threshold" off-chain
against a DIDz-issued, signed score attestation, and the circuit verifies the attestation
commitment + the boolean). No division/modulo in-circuit (house quirk); premium tables are
lookups keyed by proven band.

## 5. Activation & the holder-signed EDU gate

- **Low tiers ($500, $1,000):** `buyPolicy()` activates immediately. If an EDU cert proof
  is supplied, a **discount** is applied. EDU is *suggested*.
- **High tiers (≥ $5,000):** `buyPolicy()` creates the policy in a **PENDING** state.
  `activatePolicy()` requires a **holder-signed EDU certification proof** for the *current*
  scope version:
  - The holder proves they hold a valid CryptoSure-EDU attestation (issued by an approved
    issuer via DIDz `TrustedIssuerRegistry`), **and**
  - The attestation is bound to the same `scopeHash` the policy carries (they were
    certified against the terms they're buying), **and**
  - The holder produces a signature/commitment proving *they personally* accepted it
    (the "signed by the wallet holder" requirement).
  - Only then does status move PENDING → ACTIVE.

This is the honest core: **for real money, you must prove you understood the deal and
signed it.**

## 6. Claims & payout

1. **submitClaim(policyId, eventProof):** a ZK proof that a *covered* loss event occurred.
   The proof asserts the event is in the covered set for the policy's `scopeHash` — it
   cannot pass for an excluded event.
2. **Anti-double-claim:** a **nullifier** derived from (policyId, eventCommitment) is
   inserted into a Set; replays fail (SCIFz nullifier + revocation pattern).
3. **Adjustment (selective disclosure):** claim evidence is revealed **only to the assigned
   adjuster**, not the public — the adjuster's key decrypts/verifies the disclosed bundle.
4. **resolve():** approve → `PremiumPool.payClaim(claimant, amount)` (escrow-style
   `sendShielded`); deny → store a `reasonHash` (auditable, still private in detail).
5. **Limits:** payout ≤ policy cap; a dispute window and expiry mirror CareToCoin's
   time-windowed reclaim pattern.

## 7. Cross-contract composition (deferred, like the rest of DIDzM)

Per the DIDz README note, on-chain cross-contract calls are **deferred** on the current
compiler; the **off-chain SDK wires the pieces** (PolicyRegistry ↔ PremiumPool ↔
EduCertifier ↔ DIDz score). When Midnight's cross-contract pattern is validated on the
playground, we lift the wiring on-chain. MVP keeps each contract independent + an SDK
orchestrator.

## 8. Compact primitives shopping list

| Need | Primitive / pattern | Source |
|------|--------------------|--------|
| Premium pool | Treasury/Pot (`receiveShielded`, `mergeCoinImmediate`, `sendShielded`) | midnight-expert value-handling |
| Payout release | Escrow (`sendShielded` + `result.change`) | midnight-expert value-handling |
| Policy/claim commitments | `persistentHash` / `persistentCommit`, domain-separated | midnight-expert identity patterns |
| Score band proof | Credential Verification (#14) + Selective Disclosure (#18) | midnight-expert patterns |
| EDU issuer approval | TrustedIssuerRegistry (domain + assurance tier) | DIDz-io |
| Cert attestation | `attest_to_did` / attestation slot | DIDz-io DIDzRegistry |
| Anti-double-claim | Nullifier + Set membership + revocation | SCIFz |
| Insured object (.me) | RWA registry entry | RWAz |
| Agent-managed policy | Scoped grant, per-action + cumulative caps | AgenticDID |
| Status lifecycle | State Machine (enum phases) | midnight-expert state patterns |

## 9. What stays public vs private (summary)

| Public (status bits + balances) | Private (commitments / off-chain) |
|---|---|
| policy exists, tier band, status | holder identity, wallet address |
| pool balance / payout capacity | premium amount (shielded) |
| claim status (open/approved/denied) | claim evidence (adjuster-only) |
| EDU-certified bit, scope version | credit score value (band only proven) |
| denylist/nullifier roots | asset inventory & serials |
