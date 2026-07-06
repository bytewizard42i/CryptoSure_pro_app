# CryptoSure — Contracts (compiled locally with full ZK keys)

All 4 contracts are written as `.compact` files and compiled locally via `compact compile`
(compact CLI 0.5.1, compactc 0.31.x) with full ZK proving/verifying keys generated.
The `.md` files below are the original design stubs (kept for reference).

## Compiled Contracts

| File | Contract | Circuits | Key integrations |
|------|----------|----------|-------------------|
| `PremiumPool.compact` | Shielded premium pool + payout | 10 (deposit_premium, deposit_lp_capital, authorize_payout, release_payout, deny_payout, withdraw_lp_capital, record_lapse, get_pool_balance, get_lp_deposit, + admin) | DIDz score band proof, ZKSplunk events |
| `PolicyRegistry.compact` | Policy commitments + lifecycle + underwriting cap gate | 12 (buy_policy, activate_policy, lapse_policy, expire_policy, mark_claimed, get_policy_status, verify_policy_for_claim, get_coverage_limit, get_policy_count, get_active_count, + admin) | DIDz `prove_score_at_least`, AgenticDID scoped grants, RWAz entries, EduCertifier |
| `EduCertifier.compact` | CryptoSure-EDU certs + holder-signed activation | 10 (issue_cert, verify_cert, verify_cert_for_scope, revoke_cert, check_modules, has_module, get_cert_count, is_cert_revoked, + admin) | DIDz `TrustedIssuerRegistry`, `attest_to_did`, non-delegable holder signature |
| `ClaimEngine.compact` | Claims + anti-double-claim + payout | 14 (submit_claim, assign_adjuster, submit_forensic_report, approve_claim, deny_claim, confirm_payout, dispute_claim, reassign_disputed_claim, get_claim_status, get_claim_count, get_pending_count, get_dispute_window, + admin) | SCIFz nullifier, selective disclosure, forensic partner integration, ZKSplunk |

Shared circuit (coordinate in the DIDz repo, not here):
- `prove_score_at_least(...)` — the DIDz credit-score band proof consumed by underwriting.

## Compact house quirks to respect (from monolith-docs/midnight/COMPACT_QUIRKS.md)

- `let` is reserved — all locals are `const` (use ternaries for branching).
- No module-level `const` — inline `pad(32, "…")` in helper circuits.
- No `/` or `%` in circuits — premium multipliers are **lookup tables** keyed by proven band.
- `disclose()` required on witness-derived booleans used in conditionals/asserts.
- `Uint<248>` max width; use `.read()` on Counter, not `.value()`.
- Pragma range: `>= 0.16 && <= 0.23` (verify current compiler at session start).
