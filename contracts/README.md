# CryptoSure — Contracts (design stubs complete)

**No `.compact` files yet.** Design stubs are written for all 4 contracts
(see the `.md` files below). Per DIDzM house convention, each contract is
drafted, validated via the Midnight MCP (`midnight-compile-contract` in
`skipZk` mode), then compiled locally with `compact compile` **before** any
`.compact` file is committed here.

## Design Stubs

| File | Contract | Circuits | Key integrations |
|------|----------|----------|-------------------|
| `PremiumPool.md` | Shielded premium pool + payout | 6 (deposit_premium, deposit_lp, authorize_payout, release_payout, deny_payout, withdraw_lp) | DIDz score band proof, ZKSplunk events |
| `PolicyRegistry.md` | Policy commitments + lifecycle + underwriting cap gate | 5 (buy_policy, activate_policy, lapse_policy, get_policy_status, verify_policy_for_claim) | DIDz `prove_score_at_least`, AgenticDID scoped grants, RWAz entries, EduCertifier |
| `EduCertifier.md` | CryptoSure-EDU certs + holder-signed activation | 5 (issue_cert, verify_cert, verify_cert_for_scope, revoke_cert, list_modules) | DIDz `TrustedIssuerRegistry`, `attest_to_did`, non-delegable holder signature |
| `ClaimEngine.md` | Claims + anti-double-claim + payout | 7 (submit_claim, assign_adjuster, submit_forensic_report, approve_claim, deny_claim, confirm_payout, dispute_claim) | SCIFz nullifier, selective disclosure, forensic partner integration, ZKSplunk |

Shared circuit (coordinate in the DIDz repo, not here):
- `prove_score_at_least(...)` — the DIDz credit-score band proof consumed by underwriting.

## Compact house quirks to respect (from monolith-docs/midnight/COMPACT_QUIRKS.md)

- `let` is reserved — all locals are `const` (use ternaries for branching).
- No module-level `const` — inline `pad(32, "…")` in helper circuits.
- No `/` or `%` in circuits — premium multipliers are **lookup tables** keyed by proven band.
- `disclose()` required on witness-derived booleans used in conditionals/asserts.
- `Uint<248>` max width; use `.read()` on Counter, not `.value()`.
- Pragma range: `>= 0.16 && <= 0.23` (verify current compiler at session start).
