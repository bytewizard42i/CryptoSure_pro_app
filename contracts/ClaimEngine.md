# ClaimEngine.compact — Design Stub

> **Claims, anti-double-claim, selective disclosure, and payout release.**
>
> Status: DESIGN ONLY — not yet compiled.

---

## Purpose

The ClaimEngine handles CryptoSure's claim lifecycle:

1. **Receives claim submissions** with ZK proof of a covered loss event
2. **Enforces anti-double-claim** via SCIFz nullifier pattern
3. **Selectively discloses** claim details to the assigned adjuster only
4. **Triggers payout** from PremiumPool upon approval
5. **Logs all events** to ZKSplunk for audit and forensic coordination

## Reused Patterns

| Pattern | Source |
|---------|--------|
| Nullifier (anti-double-spend) | SCIFz |
| Merkle membership (policy verification) | SCIFz |
| Selective Disclosure (#18) | midnight-expert |
| Escrow release | midnight-expert (via PremiumPool) |
| Time-windowed dispute | CareToCoin |

---

## Ledger State

| Field | Type | Visibility | Description |
|-------|------|-----------|-------------|
| `claims` | `Map<Bytes<32>, ClaimRecord>` | shielded | Claim ID → record |
| `claim_count` | `Counter` | public | Total claims submitted |
| `pending_count` | `Uint<248>` | public | Claims under review |
| `nullifier_registry` | `Set<Bytes<32>>` | shielded | Anti-double-claim nullifiers |
| `dispute_window` | `Uint<248>` | public | Dispute window in blocks |

### ClaimRecord (shielded struct)

| Field | Type | Description |
|-------|------|-------------|
| `policy_id` | `Bytes<32>` | Linked policy commitment |
| `holder_did_commitment` | `Bytes<32>` | Claimant's DIDz commitment |
| `status` | `ClaimStatus` | submitted / under_review / approved / denied / paid |
| `event_type` | `ClaimEvent` | Covered event type claimed |
| `description_hash` | `Bytes<32>` | Hash of the free-text description |
| `amount` | `Uint<248>` | Claimed amount |
| `submitted_at` | `Uint<248>` | Submission timestamp |
| `resolved_at` | `Uint<248>` | Resolution timestamp (null if pending) |
| `deny_reason_hash` | `Bytes<32>` | Denial reason hash (null if approved) |
| `forensic_report_hash` | `Bytes<32>` | Forensic partner report hash (null if N/A) |
| `adjuster_id` | `Bytes<32>` | Assigned adjuster's DIDz commitment |
| `nullifier` | `Bytes<32>` | Anti-double-claim nullifier |

---

## Circuits

### 1. `submit_claim`

**Purpose**: File a new claim.

**Inputs**:
- `policy_id: Bytes<32>` — the policy to claim against
- `event_type: ClaimEvent` — the covered event type
- `description: Bytes<32>` — hash of the loss description
- `amount: Uint<248>` — claimed amount
- `holder_control_proof: ZKProof` — proof caller controls the holder DIDz
- `policy_verification: ZKProof` — proof the policy is active and covers this event
- `nullifier_input: Bytes<32>` — nullifier seed (prevents double-claim)
- `agent_grant_proof: ZKProof` — (optional) if agent is filing on behalf

**Logic**:
1. Verify holder control proof (or agent grant proof if agent-filed)
2. Verify policy is ACTIVE (via PolicyRegistry verification proof)
3. Verify policy covers `event_type` for the given `world`
4. Check `amount <= policy.coverage_limit`
5. Compute nullifier: `hash(nullifier_input, policy_id)`
6. Check nullifier NOT in `nullifier_registry` — **anti-double-claim**
7. Add nullifier to registry
8. Create ClaimRecord with status = SUBMITTED
9. Increment `claim_count` and `pending_count`
10. Emit `claim_submitted` event (ZKSplunk logs)
11. Return claim commitment

**SCIFz integration**: The nullifier pattern prevents a holder from filing
the same claim twice. The nullifier is derived from the holder's DIDz
commitment + the specific loss event, so filing for the same event on the
same policy is blocked, but filing for different events on the same policy
is allowed.

**AgenticDID integration**: If an agent files the claim, the `agent_grant_proof`
is verified. The agent's `per_action_cap` must cover the claimed amount.
However, the holder's DIDz commitment is still used for the nullifier —
the agent cannot file a claim that the holder has already filed.

### 2. `assign_adjuster`

**Purpose**: Assign an adjuster to review the claim.

**Inputs**:
- `claim_id: Bytes<32>`
- `adjuster_id: Bytes<32>` — DIDz commitment of the adjuster
- `admin_proof: ZKProof` — proof caller is CryptoSure admin

**Logic**:
1. Verify admin proof
2. Set `adjuster_id` in ClaimRecord
3. Set status = UNDER_REVIEW
4. Emit `claim_under_review` event

### 3. `submit_forensic_report`

**Purpose**: Attach a forensic recovery partner's report to the claim.

**Inputs**:
- `claim_id: Bytes<32>`
- `report_hash: Bytes<32>` — hash of the forensic report
- `adjuster_control_proof: ZKProof` — proof caller is the assigned adjuster

**Logic**:
1. Verify adjuster is assigned to this claim
2. Set `forensic_report_hash` in ClaimRecord
3. Emit `forensic_report_received` event (ZKSplunk logs)

**Forensic integration**: The forensic report hash anchors the investigation
results on-chain without revealing the report contents. The full report is
stored off-chain with the forensic partner. ZKSplunk attests to the report's
existence and integrity.

### 4. `approve_claim`

**Purpose**: Approve a claim for payout.

**Inputs**:
- `claim_id: Bytes<32>`
- `approved_amount: Uint<248>` — may be less than claimed
- `adjuster_control_proof: ZKProof` — proof caller is the assigned adjuster

**Logic**:
1. Verify adjuster is assigned
2. Check status = UNDER_REVIEW
3. Check `approved_amount <= policy.coverage_limit`
4. Set status = APPROVED, `resolved_at = now`
5. Decrement `pending_count`
6. Call `PremiumPool.authorize_payout(claim_id, approved_amount, holder_commitment, adjuster_proof)`
7. Emit `claim_approved` event

**Human-in-the-loop**: AI can pre-screen and recommend, but only a human
adjuster with a DIDz commitment can approve. The approval is a ZK proof
that the adjuster authorized the payout — the adjuster's identity is never
revealed on-chain.

### 5. `deny_claim`

**Purpose**: Deny a claim.

**Inputs**:
- `claim_id: Bytes<32>`
- `reason_hash: Bytes<32>` — hash of the denial reason
- `adjuster_control_proof: ZKProof`

**Logic**:
1. Verify adjuster is assigned
2. Check status = UNDER_REVIEW
3. Set status = DENIED, `resolved_at = now`, `deny_reason_hash = reason_hash`
4. Decrement `pending_count`
5. Call `PremiumPool.deny_payout(claim_id, reason_hash)`
6. Emit `claim_denied` event

### 6. `confirm_payout`

**Purpose**: Confirm that the payout was received (called after
PremiumPool.release_payout completes).

**Inputs**:
- `claim_id: Bytes<32>`
- `holder_control_proof: ZKProof`

**Logic**:
1. Verify holder control proof
2. Check status = APPROVED
3. Set status = PAID
4. Emit `claim_paid` event

### 7. `dispute_claim`

**Purpose**: Holder disputes a denial within the dispute window.

**Inputs**:
- `claim_id: Bytes<32>`
- `dispute_reason_hash: Bytes<32>`
- `holder_control_proof: ZKProof`

**Logic**:
1. Verify holder control proof
2. Check status = DENIED
3. Check `now - resolved_at <= dispute_window`
4. Set status = UNDER_REVIEW (re-opened)
5. Increment `pending_count`
6. Emit `claim_disputed` event

---

## Anti-Double-Claim Detail

The nullifier is computed as:

```
nullifier = hash(holder_did_commitment, policy_id, event_type, loss_identifier)
```

Where `loss_identifier` is a unique identifier for the specific loss event
(e.g., a transaction hash for theft, a device ID for device loss).

This means:
- Filing for the **same event** on the **same policy** → blocked (nullifier exists)
- Filing for a **different event** on the **same policy** → allowed (different nullifier)
- Filing for the **same event** on a **different policy** → allowed (different policy_id)
- An **agent** filing for the holder → same nullifier (holder commitment used)

---

## Forensic Recovery Integration

For theft claims (`theft_covered_vector`), the claim flow includes a
forensic recovery step:

```
submit_claim → assign_adjuster → submit_forensic_report → approve/deny
                                         ↑
                              Forensic partner traces stolen funds
                              Reports hash to adjuster
                              If recovered: pool gets funds back
```

**Partner integration**:
- Chainalysis / TRM Labs / Elliptic provide tracing
- Report is hashed and anchored on-chain via `submit_forensic_report`
- ZKSplunk attests to the report's integrity
- If funds are recovered, they return to PremiumPool (offsetting the payout)

---

## ZKSplunk Integration

| Event | ZKSplunk action |
|------|-----------------|
| `claim_submitted` | Log + pattern analysis (fraud detection) |
| `claim_under_review` | Log + adjuster assignment audit |
| `forensic_report_received` | Attest report hash + log |
| `claim_approved` | Log + payout authorization audit |
| `claim_denied` | Log + denial reason pattern analysis |
| `claim_paid` | Log + pool balance update |
| `claim_disputed` | Log + alert for dispute spike |

---

## Compact Quirks

- Nullifier: use `Set<Bytes<32>>` for nullifier registry
- `disclose()` on all status transition booleans
- `const` for all locals
- No `/` or `%` — approved_amount is a direct value, not computed
- Pragma: `>= 0.16 && <= 0.23`
