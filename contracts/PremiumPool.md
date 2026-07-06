# PremiumPool.compact — Design Stub

> **Shielded premium pool: collect premiums, hold reserves, pay claims.**
>
> Status: DESIGN ONLY — not yet compiled. Must validate via Midnight MCP
> (`midnight-compile-contract` skipZk) before writing the `.compact` file.

---

## Purpose

The PremiumPool is CryptoSure's shielded Treasury/Pot. It:

1. **Collects premiums** when policies are purchased
2. **Holds reserves** (shielded balance, public total)
3. **Pays claims** via escrow-style release to approved claimants
4. **Emits events** for ZKSplunk telemetry (premium_in, claim_paid, claim_denied)

## Reused Patterns

| Pattern | Source |
|---------|--------|
| Treasury/Pot (`receiveShielded`, `mergeCoinImmediate`) | midnight-expert `value-handling-patterns.md` |
| Escrow (`sendShielded` + `result.change`, state machine) | midnight-expert `value-handling-patterns.md` |

---

## Ledger State

| Field | Type | Visibility | Description |
|-------|------|-----------|-------------|
| `total_balance` | `Uint<248>` | public | Total pool balance (visible to all) |
| `total_premiums_collected` | `Uint<248>` | public | Cumulative premiums received |
| `total_claims_paid` | `Uint<248>` | public | Cumulative claims paid out |
| `active_policies` | `Uint<248>` | public | Count of active policies |
| `reserve_ratio` | `Uint<248>` | public | total_balance / total_active_coverage |
| `lp_deposits` | `Map<Bytes<32>, Uint<248>>` | shielded | LP commitments → deposit amounts |
| `pending_payouts` | `Map<Bytes<32>, Uint<248>>` | shielded | Claim ID → payout amount (awaiting release) |

---

## Circuits

### 1. `deposit_premium`

**Purpose**: Add a premium payment to the pool when a policy is purchased.

**Inputs**:
- `policy_id: Bytes<32>` — commitment to the policy
- `amount: Uint<248>` — premium amount
- `score_band_proof: ZKProof` — DIDz `prove_score_at_least` proof (determines multiplier)

**Logic**:
- Verify the ZK proof of credit-score band
- Look up premium multiplier from band table
- `total_balance += amount`
- `total_premiums_collected += amount`
- `active_policies += 1`
- Emit `premium_in` event

**DIDz integration**: Consumes `prove_score_at_least` ZK circuit from DIDz.io.
The pool never learns the raw score — only the proven band.

### 2. `deposit_lp_capital`

**Purpose**: LP seeds the pool with reserve capital.

**Inputs**:
- `lp_commitment: Bytes<32>` — DIDz commitment of the LP
- `amount: Uint<248>` — capital amount

**Logic**:
- `total_balance += amount`
- `lp_deposits[lp_commitment] += amount`
- Emit `reserve_adjustment` event

**DIDz integration**: LP identity is a DIDz commitment — no raw identity on-chain.

### 3. `authorize_payout`

**Purpose**: Authorize a claim payout (called by ClaimEngine after approval).

**Inputs**:
- `claim_id: Bytes<32>` — the approved claim
- `amount: Uint<248>` — payout amount
- `claimant_commitment: Bytes<32>` — DIDz commitment of the claimant
- `adjuster_approval: ZKProof` — proof that adjuster approved

**Logic**:
- Verify adjuster approval proof
- Check `total_balance >= amount`
- `total_balance -= amount`
- `total_claims_paid += amount`
- `pending_payouts[claim_id] = amount`
- Emit `claim_paid` event

**SCIFz integration**: Claim ID includes a nullifier to prevent double-payout.

### 4. `release_payout`

**Purpose**: Release the escrowed funds to the claimant.

**Inputs**:
- `claim_id: Bytes<32>`
- `claimant_proof: ZKProof` — proof that caller controls the claimant DIDz

**Logic**:
- Verify claimant control proof
- Check `pending_payouts[claim_id] > 0`
- `sendShielded(claimant, pending_payouts[claim_id])`
- `pending_payouts[claim_id] = 0`

### 5. `deny_payout`

**Purpose**: Record a denied claim (no funds move).

**Inputs**:
- `claim_id: Bytes<32>`
- `deny_reason_hash: Bytes<32>`

**Logic**:
- Emit `claim_denied` event with reason hash

### 6. `withdraw_lp_capital`

**Purpose**: LP withdraws their capital (subject to lockup + solvency check).

**Inputs**:
- `lp_commitment: Bytes<32>`
- `amount: Uint<248>`
- `lp_control_proof: ZKProof`

**Logic**:
- Verify LP control proof
- Check lockup period elapsed
- Check `total_balance - amount >= min_reserve`
- `total_balance -= amount`
- `lp_deposits[lp_commitment] -= amount`
- `sendShielded(lp, amount)`

---

## ZKSplunk Integration

Every circuit emits an event that ZKSplunk's SplunkForwarder can attest to:

| Event type | Fields | ZKSplunk action |
|-----------|--------|-----------------|
| `premium_in` | amount, policy_id, timestamp | Log + attest pool growth |
| `claim_paid` | amount, claim_id, timestamp | Log + alert if spike |
| `claim_denied` | reason_hash, claim_id, timestamp | Log + pattern analysis |
| `reserve_adjustment` | amount, direction, timestamp | Log + solvency monitor |

---

## Compact Quirks to Respect

- `let` is reserved — all locals are `const`
- No `/` or `%` in circuits — reserve ratio computed off-chain or via lookup
- `disclose()` required on witness-derived booleans
- `Uint<248>` max width
- Premium multiplier: lookup table keyed by proven band (A=0.6, B=0.8, C=1.0, D=1.5)
- Pragma: `>= 0.16 && <= 0.23` (verify at session start)

---

## Build Order

1. Draft `.compact` file
2. Validate via `midnight-compile-contract` (skipZk=true)
3. Fix errors, re-validate
4. Local `compact compile` with full ZK
5. Deploy local → pre-prod (skip preview)
