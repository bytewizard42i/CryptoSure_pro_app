# CryptoSure — DIDzM Reuse Map

**Date**: July 6, 2026

CryptoSure is deliberately **not greenfield**. Everything below already exists (or is
designed) in the DIDz family. We compose, we don't reinvent. Sources verified against
`midnight-expert` (primary source of truth) and the DIDz contract repos.

---

## What we lift first (low-hanging fruit)

| Capability | Source | How CryptoSure uses it |
|------------|--------|------------------------|
| **Treasury / Pot** (`receiveShielded`, `mergeCoinImmediate`, public balance) | midnight-expert `value-handling-patterns.md` | The **PremiumPool** — collect premiums, auditable reserves. |
| **Escrow** (`sendShielded` + `result.change`, state machine) | midnight-expert `value-handling-patterns.md` | **Payout** release to approved claimants. |
| **Credential Verification** (#14) + **Selective Disclosure** (#18) | midnight-expert `compact-patterns` | Prove **credit-score band** and **EDU cert** without revealing values. |
| **State Machine** (#5) | midnight-expert | Policy lifecycle: PENDING → ACTIVE → CLAIMED / LAPSED. |
| **TrustedIssuerRegistry** (issuer type / domain / assurance tier + PENDING→APPROVED) | DIDz-io | Approve **CryptoSure-EDU** issuers and the **credit-score oracle**. |
| **DIDzRegistry** (`attest_to_did`, attestation slots, `assert_i_control`, selective proofs) | DIDz-io | EDU certs + credit-score attestations; holder control proofs. |
| **DIDz credit / trust score** (oracle pattern) | DIDz-io `ORACLE_AND_API_INTEGRATION.md` §4 | Premium + coverage cap (see `DIDZ_CREDIT_SCORE.md`). |
| **Scoped grants** (`per_action_cap`, `cumulative_cap`) | AgenticDID | Agent-managed policies; score-scaled delegated caps. |
| **RWA registry entries** | RWAz | The insured object for everyday `.me` coverage; appraised-value band = cap input. |
| **Nullifier + Merkle membership + revocation + audit** | SCIFz | Anti-double-claim; claim uniqueness; audit trail. |
| **OFAC-style denylist screening** (Merkle non-membership, versioned root) | CareToCoin `OFAC_SCREENING_DESIGN.md` | Block sanctioned wallets from buying/claiming. |
| **Wallet-ownership proofs** | EncryptVault | Bind the insured wallet to the policyholder without revealing the address. |
| **KYCz credentials** (optional) | KYCz | Regulated higher-assurance underwriting path for the largest tiers. |
| **demoLand/realDeal + 7-auth + DEMO MODE banner** | DIDzM house convention | The web frontend (both modes, provider-switched). |
| **Time-windowed reclaim / dispute** | CareToCoin | Claim dispute window + policy expiry. |

## What is genuinely new to CryptoSure

- The **insurance-specific scope model** (versioned `scopeHash` bound into each policy).
- The **tier ladder** ($500 → $50k) with **EDU-gated activation** for ≥ $5k.
- The **holder-signed EDU acceptance** proof (non-delegable, even under AgenticDID).
- The **premium band table** keyed off proven credit-score bands.

## Contract build order (compile-first, MCP-validated)

1. `PremiumPool` (Treasury/Pot) — simplest, unblocks payout testing.
2. `PolicyRegistry` (commitments + state machine + underwriting cap gate).
3. `EduCertifier` (TrustedIssuerRegistry consumer + attestation + signed-acceptance proof).
4. `ClaimEngine` (nullifier + selective disclosure + payout call).
5. DIDz `prove_score_at_least` (shared band-proof circuit) — coordinate in DIDz repo.

Each contract: draft → `midnight-compile-contract` (skipZk) → fix → local `compact compile`
→ then commit. No `.compact` is written to disk before it validates.
