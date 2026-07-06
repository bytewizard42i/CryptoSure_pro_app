# PolicyRegistry.compact — Design Stub

> **Policy commitments, lifecycle, and underwriting cap gate.**
>
> Status: DESIGN ONLY — not yet compiled.

---

## Purpose

The PolicyRegistry is CryptoSure's on-chain policy manager. It:

1. **Creates policy commitments** when a user buys a policy
2. **Enforces the tier ladder** with EDU gating for T2+
3. **Manages policy lifecycle**: PENDING → ACTIVE → CLAIMED / LAPSED / EXPIRED
4. **Verifies underwriting**: DIDz credit-score band proof sets premium + cap
5. **Binds EDU certification** to high-tier policies

## Reused Patterns

| Pattern | Source |
|---------|--------|
| State Machine (#5) | midnight-expert `compact-patterns` |
| Credential Verification (#14) | midnight-expert |
| Selective Disclosure (#18) | midnight-expert |
| `TrustedIssuerRegistry` | DIDz.io |
| `attest_to_did` + attestation slots | DIDz.io |

---

## Ledger State

| Field | Type | Visibility | Description |
|-------|------|-----------|-------------|
| `policies` | `Map<Bytes<32>, PolicyRecord>` | shielded | Policy ID → record |
| `policy_count` | `Counter` | public | Total policies issued |
| `active_count` | `Uint<248>` | public | Active policy count |
| `scope_versions` | `Map<Bytes<32>, Uint<248>>` | public | Scope hash → current version |

### PolicyRecord (shielded struct)

| Field | Type | Description |
|-------|------|-------------|
| `holder_did_commitment` | `Bytes<32>` | DIDz commitment (never revealed) |
| `world` | `PolicyWorld` | wallet / everyday / gaming |
| `tier` | `TierCode` | T0–T5 |
| `coverage_limit` | `Uint<248>` | Max payout |
| `premium` | `Uint<248>` | Premium paid |
| `status` | `PolicyStatus` | pending / active / lapsed / claimed / expired |
| `scope_hash` | `Bytes<32>` | Versioned "what's covered" text hash |
| `scope_version` | `Uint<248>` | Scope version number |
| `edu_required` | `bool` | True for T2+ |
| `edu_satisfied` | `bool` | EDU cert verified |
| `edu_commitment` | `Bytes<32>` | EDU cert commitment (null if not required) |
| `rwa_commitment` | `Bytes<32>` | RWAz entry commitment (everyday only) |
| `agent_grant_commitment` | `Bytes<32>` | AgenticDID grant (null if self-managed) |
| `created_at` | `Uint<248>` | Block timestamp |
| `activated_at` | `Uint<248>` | Activation timestamp |
| `expires_at` | `Uint<248>` | Expiry timestamp |

---

## Circuits

### 1. `buy_policy`

**Purpose**: Create a new policy commitment.

**Inputs**:
- `holder_did_commitment: Bytes<32>` — DIDz commitment
- `world: PolicyWorld` — coverage world
- `tier: TierCode` — desired tier
- `scope_hash: Bytes<32>` — versioned scope text hash
- `score_band_proof: ZKProof` — DIDz `prove_score_at_least` proof
- `edu_commitment: Bytes<32>` — (optional, required for T2+)
- `edu_proof: ZKProof` — (optional) EDU cert + holder-signed acceptance
- `rwa_commitment: Bytes<32>` — (optional, everyday only) RWAz entry
- `agent_grant_proof: ZKProof` — (optional) AgenticDID scoped grant proof
- `premium_payment: ShieldedInput` — premium amount

**Logic**:
1. Verify DIDz `prove_score_at_least` proof → get proven band
2. Check tier ≤ max_tier_for_band(band) — **tier gate**
3. If tier ≥ T2: require `edu_commitment` + `edu_proof`
4. Verify EDU proof: cert is valid, issuer approved, holder signed scope
5. If world = everyday: require `rwa_commitment`
6. If agent-initiated: verify AgenticDID grant proof, check caps
7. Compute premium = base_premium(tier) × multiplier(band)
8. Verify premium payment ≥ computed premium
9. Create PolicyRecord with status = PENDING (or ACTIVE if EDU satisfied)
10. Call `PremiumPool.deposit_premium(policy_id, premium, band_proof)`
11. Return policy commitment

**DIDz integration**: Consumes `prove_score_at_least` ZK circuit. The registry
learns only the proven band, not the raw score.

**AgenticDID integration**: If agent-initiated, verifies the scoped grant.
Checks `per_action_cap >= premium` and `cumulative_cap >= premium`. The
agent's tier ceiling is score-scaled: `max_tier = f(principal_score_band)`.

**RWAz integration**: For everyday coverage, the `rwa_commitment` binds the
policy to a specific RWAz registry entry. The coverage cap is
`min(tier_cap, rwa_value_band_cap)`.

**EDU integration**: For T2+, verifies the EDU cert via `EduCertifier.compact`.
The holder signature on the scope acceptance is **non-delegable** — even if
an agent initiated the purchase, the holder must have personally signed.

### 2. `activate_policy`

**Purpose**: Activate a pending policy (after EDU completion).

**Inputs**:
- `policy_id: Bytes<32>`
- `edu_proof: ZKProof` — EDU cert + holder-signed acceptance
- `holder_control_proof: ZKProof` — proof caller controls the holder DIDz

**Logic**:
1. Verify holder control proof
2. Verify EDU proof (cert valid, issuer approved, scope matches, holder signed)
3. Check policy status = PENDING
4. Set `edu_satisfied = true`, `edu_commitment = cert_commitment`
5. Set status = ACTIVE, `activated_at = now`
6. Increment `active_count`

**Non-delegable**: The holder control proof ensures the holder personally
activated. An agent cannot activate on behalf of the holder.

### 3. `lapse_policy`

**Purpose**: Lapse a policy (premium not paid, or expired).

**Inputs**:
- `policy_id: Bytes<32>`
- `reason: LapserReason` — non_payment / expired / manual

**Logic**:
1. Check status = ACTIVE
2. Set status = LAPSED
3. Decrement `active_count`

### 4. `get_policy_status`

**Purpose**: Publicly query a policy's status (no PII revealed).

**Inputs**:
- `policy_id: Bytes<32>`

**Returns**: `PolicyStatus` (public — only the status enum, no holder info)

### 5. `verify_policy_for_claim`

**Purpose**: Verify a policy is active and covers a given event type (called
by ClaimEngine).

**Inputs**:
- `policy_id: Bytes<32>`
- `event_type: ClaimEvent`
- `holder_control_proof: ZKProof`

**Returns**: `{ is_active: bool, coverage_limit: Uint<248>, world: PolicyWorld }`

---

## Tier Gate Logic

```
Band A → max tier T5 ($50,000)
Band B → max tier T4 ($25,000)  [or T3 for agent-initiated]
Band C → max tier T2 ($5,000)
Band D → max tier T1 ($1,000)
Unrated → max tier T0 ($500)

T0, T1: EDU suggested (premium discount) but not required
T2+: EDU required + holder-signed scope acceptance
```

## Premium Multiplier Table

| Band | Multiplier | Example T2 premium |
|------|-----------|-------------------|
| A | 0.6× | $30/mo |
| B | 0.8× | $40/mo |
| C | 1.0× | $50/mo |
| D | 1.5× | $75/mo |
| Unrated | 2.0× | $100/mo |

---

## AgenticDID Score-Scaled Ceiling

| Principal band | Agent max tier | Agent per-action cap ceiling |
|---------------|---------------|---------------------------|
| A | T5 | $50,000 |
| B | T3 | $10,000 |
| C | T2 | $5,000 |
| D | T1 | $1,000 |

The agent's `per_action_cap` and `cumulative_cap` are both enforced. Even
if the principal is band A, the agent cannot exceed its granted caps.

---

## Compact Quirks

- No `/` or `%` — premium multiplier is a lookup table
- `disclose()` on all witness-derived booleans (tier gate, EDU check)
- `const` for all locals (no `let`)
- Pragma: `>= 0.16 && <= 0.23`
