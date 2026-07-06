# EduCertifier.compact — Design Stub

> **CryptoSure-EDU certification + holder-signed activation.**
>
> Status: DESIGN ONLY — not yet compiled.

---

## Purpose

The EduCertifier manages CryptoSure's educational certification system:

1. **Approves EDU issuers** via DIDz `TrustedIssuerRegistry` (domain = "CRYPTOSURE-EDU")
2. **Issues certifications** as DIDz attestations bound to a scope hash
3. **Verifies holder-signed acceptance** — the non-delegable signature
4. **Enables premium discounts** for certified low-tier holders

## Reused Patterns

| Pattern | Source |
|---------|--------|
| `TrustedIssuerRegistry` (issuer approval by domain + assurance) | DIDz.io |
| `attest_to_did` (attestation slots) | DIDz.io |
| Credential Verification (#14) | midnight-expert |
| `assert_i_control` (holder control proof) | DIDz.io |

---

## Ledger State

| Field | Type | Visibility | Description |
|-------|------|-----------|-------------|
| `certs` | `Map<Bytes<32>, CertRecord>` | shielded | Cert ID → record |
| `cert_count` | `Counter` | public | Total certs issued |
| `issuer_domain` | `Bytes<32>` | public | "CRYPTOSURE-EDU" (constant) |

### CertRecord (shielded struct)

| Field | Type | Description |
|-------|------|-------------|
| `holder_did_commitment` | `Bytes<32>` | DIDz commitment of the certified holder |
| `issuer_id` | `Bytes<32>` | DIDz commitment of the issuer |
| `modules_completed` | `Set<EduModule>` | Completed module IDs |
| `scope_hash` | `Bytes<32>` | Versioned scope text the holder signed |
| `scope_version` | `Uint<248>` | Scope version |
| `holder_signature` | `Bytes<64>` | Non-delegable holder signature on scope |
| `issued_at` | `Uint<248>` | Issuance timestamp |
| `expires_at` | `Uint<248>` | Expiry (null = never expires) |

---

## Circuits

### 1. `issue_cert`

**Purpose**: Issue an EDU certification to a holder.

**Inputs**:
- `holder_did_commitment: Bytes<32>`
- `modules: Set<EduModule>` — completed modules
- `scope_hash: Bytes<32>` — current scope version
- `holder_signature: Bytes<64>` — holder's signature on scope_hash
- `issuer_control_proof: ZKProof` — proof caller is an approved issuer
- `issuer_id: Bytes<32>` — DIDz commitment of the issuer

**Logic**:
1. Verify issuer is approved by `TrustedIssuerRegistry` for domain "CRYPTOSURE-EDU"
2. Verify holder_signature is valid for `scope_hash` under holder's key
3. Verify `holder_control_proof` — the holder personally signed (non-delegable)
4. Create CertRecord
5. Create DIDz attestation: `attest_to_did(holder_commitment, "CRYPTOSURE-EDU", cert_commitment)`
6. Increment `cert_count`
7. Return cert commitment

**Non-delegable enforcement**: The `holder_signature` + `holder_control_proof`
together ensure that even if an agent initiated the process (via AgenticDID),
the holder must have personally signed the scope acceptance. This is a hard
boundary — no circuit can bypass it.

**DIDz integration**: Issuer approval via `TrustedIssuerRegistry`. The cert
itself is a DIDz attestation, verifiable via ZK proofs.

### 2. `verify_cert`

**Purpose**: Verify a holder's EDU certification (called by PolicyRegistry
during activation).

**Inputs**:
- `cert_commitment: Bytes<32>`
- `scope_hash: Bytes<32>` — the scope version to verify against
- `holder_control_proof: ZKProof` — proof the caller controls the holder DIDz

**Returns** (via ZK, no values revealed on-chain):
- `is_valid: bool` — cert exists, not expired, scope matches
- `holder_signed: bool` — holder signature verified
- `modules_complete: bool` — required modules are present

**Logic**:
1. Look up cert by commitment
2. Check `expires_at > now` (or never expires)
3. Check `scope_hash` matches current scope version
4. Check `holder_signature` is valid
5. Check required modules for the requested tier are present
6. Return verification bits (all via ZK — no PII revealed)

### 3. `verify_cert_for_scope`

**Purpose**: Verify a cert is valid for a specific scope version (used when
scope text is updated).

**Inputs**:
- `cert_commitment: Bytes<32>`
- `required_scope_hash: Bytes<32>`
- `holder_control_proof: ZKProof`

**Returns**: `bool` — cert is valid and scope matches

**Logic**:
- If scope was updated, the holder must re-sign the new scope hash
- Old certs with old scope hashes are NOT valid for new scope versions
- This forces holders to re-read and re-accept the scope when it changes

### 4. `revoke_cert`

**Purpose**: Revoke a certification (issuer-only, for fraud/incorrect issuance).

**Inputs**:
- `cert_commitment: Bytes<32>`
- `issuer_control_proof: ZKProof`
- `reason_hash: Bytes<32>`

**Logic**:
1. Verify caller is the original issuer
2. Mark cert as revoked
3. Emit revocation event (ZKSplunk logs)

### 5. `list_modules`

**Purpose**: Public query of available EDU modules.

**Returns**: `Set<EduModule>` — the list of recognized module IDs

---

## EDU Module Definitions

| Module ID | Title | Required for tiers |
|-----------|-------|-------------------|
| `wallet_hygiene` | Wallet Hygiene | T2+ |
| `seed_custody` | Seed Phrase Custody | T2+ |
| `phishing_awareness` | Phishing & Drainer Awareness | T2+ |
| `hardware_wallet` | Hardware Wallet Setup | T3+ |
| `recovery_planning` | Recovery Planning | T3+ |
| `scope_review` | Policy Scope Review | T2+ |
| `gaming_asset_safety` | Gaming Asset Safety | T2+ (gaming world) |

---

## Non-Delegable Boundary — Detailed

The holder signature on the scope acceptance is the **cornerstone** of
CryptoSure's honesty model. It proves the holder read (or at least
cryptographically acknowledged) what is and is not covered.

### What this means in practice:

1. **Self-managed policy**: Holder signs scope → cert issued → policy activated
2. **Agent-managed policy (AgenticDID)**: Agent buys policy → holder still
   must personally sign scope → cert issued → policy activated
3. **AI-assisted onboarding**: AI can guide the holder through EDU modules,
   but the final signature MUST come from the holder's key
4. **No circuit bypass**: There is no `issue_cert` path that omits the
   holder signature. The circuit structurally requires it.

### Why this matters:

If a holder files a claim saying "I didn't know phishing wasn't covered,"
the on-chain proof shows they signed the scope that explicitly states
phishing/drainer losses are not covered. This protects the pool and LPs
from bad-faith claims.

---

## TrustedIssuerRegistry Integration

The EduCertifier does NOT maintain its own issuer list. It delegates to
DIDz's `TrustedIssuerRegistry`:

```
TrustedIssuerRegistry.is_approved(issuer_id, domain="CRYPTOSURE-EDU")
→ bool
```

This means:
- Issuer approval/revocation is managed by the DIDz governance process
- Multiple EDU issuers can be approved (different regions, languages)
- The issuer's assurance tier can gate which tiers they can certify for

---

## Compact Quirks

- `Set<EduModule>` — verify this is supported in current compactc version
- `disclose()` on all verification booleans
- `const` for all locals
- Pragma: `>= 0.16 && <= 0.23`
