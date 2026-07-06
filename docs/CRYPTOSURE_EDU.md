# CryptoSure-EDU — Certification

**Date**: July 6, 2026
**Status**: Design

CryptoSure-EDU is the education-and-certification layer. Its purpose: **coverage for
self-custody is only honest if the insured demonstrably understands self-custody** — what
they're responsible for, and what the policy is and is not responsible for.

---

## 1. Why gate coverage behind education

Most crypto loss is behavioral (phishing, approval drainers, bad key custody, no recovery
plan). If CryptoSure insured that blindly, it would either go bankrupt or deny every claim.
Instead, we **raise the floor**: teach the holder, have them certify, and bind that
certification to the exact scope they're buying. The signature is the holder saying *"I
understand what I'm responsible for, and what you will and won't cover."*

## 2. Requirement by tier

| Tier(s) | EDU | Signature | Effect |
|---------|-----|-----------|--------|
| T0 $500, T1 $1,000 | **Suggested** | Optional | Certification lowers premium |
| T2 $5k, T3 $10k | **Required** | **Holder-signed** | Needed to *activate* the policy |
| T4 $25k | **Required** (advanced module) | **Holder-signed** | Needed to activate |
| T5 $50k | **Required** (advanced) + optional **KYCz** | **Holder-signed** | Needed to activate; regulated path optional |

- **Low tiers**: EDU is a *suggestion* and a *discount lever*. A holder can buy $500/$1,000
  without it, just at a higher premium.
- **High tiers (≥ $5k)**: EDU is a *precondition to activation*. The policy is created
  PENDING and only becomes ACTIVE after a valid, holder-signed cert proof for the current
  scope version.

## 3. Curriculum (modules)

**Core module (all tiers):**
1. **Self-custody basics** — keys vs coins, addresses, hot vs cold.
2. **Seed-phrase custody** — generation, storage, never-digital, never-shared.
3. **Phishing & approval drainers** — recognizing fake sites, malicious signatures,
   `approve` / `setApprovalForAll` risks, revoking approvals.
4. **Hardware wallets** — setup, verification-on-device, firmware hygiene.
5. **Recovery planning** — seed backups, m-of-n / social recovery, inheritance.
6. **Scope literacy** — **what CryptoSure covers and, explicitly, what it does not**
   (voluntary transfers, signed drainers, forgotten seeds, market loss, third-party dApp
   exploits). This module is where the holder reads the exact exclusions.

**Advanced module (T4/T5):**
7. Multi-sig / MPC custody, treasury segregation, hot-wallet float limits.
8. Operational security for larger balances; incident response.

## 4. Issuance: CryptoSure-EDU as a DIDz Trusted Issuer

Certification is a **DIDz attestation**, not a PDF:

- A CryptoSure-EDU provider registers in DIDz **`TrustedIssuerRegistry`** with:
  - `primaryDomain = hash("CRYPTOSURE-EDU")`,
  - an `AssuranceLevel` (e.g. REGULATED_ENTITY for the official academy),
  - admin approval (PENDING → APPROVED).
- On passing, the issuer calls DIDz `attest_to_did(holderDid, hash("CRYPTOSURE-EDU-CERT"),
  contentCommitment, expiry)` where `contentCommitment` binds:
  - the **module set** completed (core, or core+advanced),
  - the **scopeHash** the holder was certified against,
  - an **issued-at** timestamp (for freshness / renewal windows).

Verifiers (the PolicyRegistry) later confirm the issuer was approved for the
`CRYPTOSURE-EDU` domain at or above a minimum assurance tier via
`meetsMinimumAssurance(...)`.

## 5. The holder signature (the "signed by the wallet holder" requirement)

For high tiers, activation requires proof that **the wallet holder personally accepted**
the certification and scope — not just that a cert exists. Design:

```
certAcceptance = persistentHash([
  pad(32, "cryptosure:edu:accept:v1"),
  holderDidCommitment,       // who
  scopeHash,                 // which exact "what's covered/not" terms
  certContentCommitment,     // which modules / issuance
  holderSecretCommitment     // proves the holder (key owner) signed, not a third party
])
```

At `activatePolicy()` the holder supplies a **ZK proof** that:
1. they control the policyholder DIDz (`DIDzRegistry.assert_i_control` pattern),
2. a valid CryptoSure-EDU attestation exists for that DIDz from an approved issuer,
3. the attestation's `scopeHash` equals the **policy's current** `scopeHash`
   (certified against the very terms being activated),
4. `certAcceptance` re-derives from their secret — proving *they themselves* signed.

The circuit learns only the booleans. Identity, secret, and cert contents stay private.

## 6. Re-certification & scope changes

- Certs carry an **issued-at** and an optional **expiry** (freshness window, mirroring the
  DIDz POL freshness idea — verifier-side).
- If CryptoSure updates the covered/excluded scope (new `scopeHash`), high-tier holders
  must **re-accept** (a lightweight re-sign against the new scope) to keep coverage current.
  Low-tier holders keep their discount but are prompted to re-read.

## 7. demoLand vs realDeal

| Mode | EDU behavior |
|------|--------------|
| **demoLand** | Simulated academy; instant "pass"; mock issuer pre-approved in a mock TrustedIssuerRegistry; holder signs with a demo key. Amber DEMO MODE banner shown. |
| **realDeal** | Real curriculum + assessment; a genuinely approved DIDz Trusted Issuer signs the attestation; holder signs with their real DIDz-controlled key on Midnight. |

## 8. Why this is good for everyone

- **Holders** lose less (they're taught) and pay less when certified.
- **The pool** stays solvent because covered events are narrow and hygiene is real.
- **The claim process** is cleaner: a scope violation vs a covered event is decidable
  because the holder signed a specific, versioned scope.
