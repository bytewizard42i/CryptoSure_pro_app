# CryptoSure — Contracts Overview

> Quick reference for the 4 Compact smart contracts. All compile-validated via Midnight MCP (skipZk mode).
>
> **Compiler:** compactc v0.31.x, language 0.23, pragma `>= 0.16 && <= 0.23`

---

## Contract Summary

| Contract | File | Circuits | Purpose |
|----------|------|----------|---------|
| **PremiumPool** | `PremiumPool.compact` | 10 | Shielded treasury: collects premiums, holds reserves, pays claims |
| **PolicyRegistry** | `PolicyRegistry.compact` | 12 | Policy lifecycle: creation, tier gate, EDU gate, activation, lapse/expire |
| **EduCertifier** | `EduCertifier.compact` | 10 | EDU certification: issuance, verification, revocation, module checking |
| **ClaimEngine** | `ClaimEngine.compact` | 14 | Claims: submission, anti-double-claim, adjuster flow, dispute window |

---

## PremiumPool.compact

**Pattern:** Treasury/Pot (midnight-expert value-handling-patterns)

**Shielded coin operations:** `receiveShielded`, `sendShielded`, `mergeCoinImmediate`

| Circuit | Access | Description |
|---------|--------|-------------|
| `claim_admin` | deployer | Claim initial admin role |
| `add_admin` | admin | Add admin to set |
| `add_adjuster` | admin | Authorize an adjuster to approve payouts |
| `deposit_premium` | holder (via SDK) | Receive shielded premium coin, merge into pool |
| `deposit_lp_capital` | LP | Receive shielded LP capital, merge into pool, track deposit |
| `authorize_payout` | adjuster | Record a pending payout for a claimant |
| `release_payout` | claimant | Send shielded coin from pool to claimant |
| `deny_payout` | adjuster | Cancel a pending payout |
| `withdraw_lp_capital` | LP | Send shielded coin from pool back to LP |
| `record_lapse` | admin/holder | Decrement active policy counter |
| `get_pool_balance` | public | Read pool total (Uint<128>) |
| `get_lp_deposit` | LP | Read own deposit amount |

**Key types:** `Uint<128>` for all coin amounts, `Bytes<32>` for commitments, `ShieldedCoinInfo` for send results.

---

## PolicyRegistry.compact

**Pattern:** State machine (PENDING → ACTIVE → LAPSED/EXPIRED/CLAIMED)

| Circuit | Access | Description |
|---------|--------|-------------|
| `claim_admin` | deployer | Claim initial admin role |
| `add_admin` / `remove_admin` | admin | Manage admin set |
| `update_scope_version` | admin | Force EDU re-sign for new scope text |
| `buy_policy` | holder/agent | Create policy commitment, enforce tier + EDU gates |
| `activate_policy` | holder (non-delegable) | Activate a pending policy after EDU completion |
| `lapse_policy` | holder/admin | Lapse an active policy |
| `expire_policy` | holder/admin | Mark policy as expired |
| `mark_claimed` | holder | Mark policy as claimed (paired with ClaimEngine.submit_claim) |
| `get_policy_status` | public | Read policy status enum |
| `verify_policy_for_claim` | holder | Verify active + get world (for ClaimEngine) |
| `get_coverage_limit` | holder | Read coverage limit (for claim amount validation) |
| `get_policy_count` / `get_active_count` | public | Aggregate counters |

**Tier gate:** T2+ requires `edu_satisfied = true` + non-zero `edu_commitment`.
**Everyday world:** Requires non-zero `rwa_commitment` (RWAz entry).

---

## EduCertifier.compact

**Pattern:** Attestation slots (DIDzRegistry pattern) + non-delegable signature

| Circuit | Access | Description |
|---------|--------|-------------|
| `claim_admin` / `add_admin` | admin | Manage admin set |
| `derive_cert_id` | public | Compute cert ID from holder + issuer + scope + nonce |
| `has_module` | public | Check if a module bit is set in a bitfield |
| `issue_cert` | issuer | Issue EDU cert (requires non-zero holder_signature) |
| `verify_cert` | holder | Verify cert validity + scope hash + holder signature |
| `verify_cert_for_scope` | holder | Verify cert for specific scope version (forces re-sign on update) |
| `revoke_cert` | issuer/admin | Revoke a certification |
| `check_modules` | holder | Verify required module bitfield is complete |
| `get_cert_count` / `get_revoked_count` | public | Aggregate counters |
| `is_cert_revoked` | public | Check revocation status |

**Non-delegable boundary:** `issue_cert` structurally requires a non-zero `holder_signature` (Bytes<64>). Even if an agent guided the holder through EDU modules via AgenticDID, the final scope acceptance signature must come from the holder's key. There is no `issue_cert` path that omits it.

**Module bitfield:** `Uint<32>` bitfield — 7 modules (wallet_hygiene, seed_custody, phishing_awareness, hardware_wallet, recovery_planning, scope_review, gaming_asset_safety).

---

## ClaimEngine.compact

**Pattern:** Nullifier (anti-double-claim, SCIFz pattern) + state machine + time-windowed dispute

| Circuit | Access | Description |
|---------|--------|-------------|
| `claim_admin` / `add_admin` / `remove_admin` | admin | Manage admin set |
| `add_adjuster` / `remove_adjuster` | admin | Manage adjuster set |
| `set_dispute_window` | admin | Configure dispute window length (blocks) |
| `compute_nullifier` | public | Compute anti-double-claim nullifier |
| `derive_claim_id` | public | Compute claim ID from holder + policy + nonce |
| `submit_claim` | holder | File a claim (enforces nullifier uniqueness) |
| `assign_adjuster` | admin | Assign adjuster → moves to UNDER_REVIEW |
| `submit_forensic_report` | adjuster | Anchor forensic report hash on-chain |
| `approve_claim` | adjuster | Approve claim for payout (amount ≤ claimed) |
| `deny_claim` | adjuster | Deny claim with reason hash |
| `confirm_payout` | holder | Confirm payout received (paired with PremiumPool.release_payout) |
| `dispute_claim` | holder | Dispute a denial within the dispute window |
| `reassign_disputed_claim` | admin | Re-assign adjuster for a disputed claim |
| `get_claim_status` / `get_claim_count` / `get_pending_count` / `get_dispute_window` | public | Queries |

**Anti-double-claim:** Nullifier = `hash(holder_commitment, policy_id, event_type, loss_identifier)`. Same loss event on same policy = blocked. Different events on same policy = allowed.

**Claim lifecycle:** SUBMITTED → UNDER_REVIEW → APPROVED → PAID (or DENIED → DISPUTED → back to UNDER_REVIEW).

---

## Multi-Contract Transaction Flows (SDK orchestration)

Compact does not support cross-contract calls. The SDK composes multi-contract transactions:

| Flow | Contracts called in one tx |
|------|---------------------------|
| **Buy policy** | `PolicyRegistry.buy_policy` + `PremiumPool.deposit_premium` |
| **Submit claim** | `ClaimEngine.submit_claim` + `PolicyRegistry.mark_claimed` |
| **Approve claim** | `ClaimEngine.approve_claim` + `PremiumPool.authorize_payout` |
| **Release payout** | `PremiumPool.release_payout` + `ClaimEngine.confirm_payout` |
| **Deny claim** | `ClaimEngine.deny_claim` + `PremiumPool.deny_payout` |

---

## Privacy Model

Per John's ruling §0: **everything private by default, prove and share selectively**.

| Data | On-chain? | Format |
|------|-----------|--------|
| Pool total balance | Public | `Uint<128>` |
| Policy count / active count | Public | `Counter` |
| Claim count / pending count | Public | `Counter` |
| Policy holder identity | Committed | `Bytes<32>` key commitment |
| Policy details (tier, coverage, premium) | Committed | `PolicyRecord` in `Map` |
| Claim details (amount, event, description) | Committed | `ClaimRecord` in `Map` |
| EDU cert details (modules, scope, signature) | Committed | `CertRecord` in `Map` |
| LP deposit amounts | Committed | `Map<Bytes<32>, Uint<128>>` |
| Adjuster identity | Committed | `Bytes<32>` in `Set` |
| Nullifier registry | Public (hash only) | `Set<Bytes<32>>` |

---

## Ecosystem Integration Points

| Partner | Integration | Verification |
|---------|-------------|-------------|
| **DIDz.io** | Holder identity = DIDz key commitment | Off-chain ZK proof (prove_score_at_least) |
| **AgenticDID** | Agent-managed policies under scoped grants | Off-chain grant verification |
| **RWAz** | Everyday coverage insured object = RWAz entry | Off-chain ownership proof |
| **TrustedIssuerRegistry** | EDU issuer approval (domain "CRYPTOSURE-EDU") | Off-chain registry query |
| **SCIFz** | Anti-double-claim nullifier pattern | On-chain nullifier set |
| **ZKSplunk** | Event logging for telemetry/audit | Off-chain indexer |
| **EncryptVault** | Wallet-ownership proofs | Off-chain verification |

---

## Files

```
contracts/
├── PremiumPool.compact       # Shielded treasury (10 circuits)
├── PolicyRegistry.compact    # Policy lifecycle (12 circuits)
├── EduCertifier.compact      # EDU certification (10 circuits)
├── ClaimEngine.compact       # Claims processing (14 circuits)
├── PremiumPool.md            # Design stub (archive)
├── PolicyRegistry.md         # Design stub (archive)
├── EduCertifier.md           # Design stub (archive)
└── ClaimEngine.md            # Design stub (archive)
```
