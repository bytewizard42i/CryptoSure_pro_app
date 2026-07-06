# CryptoSure — New Client Onboarding Template

> **From "never heard of CryptoSure" to "insured and certified" in 5 steps.**

---

## Overview

This template describes the standard onboarding flow for a new CryptoSure
client. It covers both the **demoLand** experience (what the frontend does
today) and the **realDeal** flow (what happens when Midnight contracts are
live).

The onboarding is implemented in
`frontend-demoland/src/pages/onboarding/index.tsx` as a 5-step wizard.

---

## The 5 Steps

### Step 1 — Identity Registration (DIDz)

| | demoLand | realDeal |
|---|---------|----------|
| **What happens** | User enters name + email; a fake DIDz commitment is generated | User connects Midnight wallet; `DIDzRegistry.compact` creates a real identity commitment |
| **What's stored** | localStorage: `{ displayName, email, didzCommitment }` | On-chain: DIDz registry entry (commitment only, no PII) |
| **Key principle** | Identity is a non-transferable registry entry, NOT an NFT | Same — keys rotate/recover, identity never moves |

**UI elements**:
- Name + email fields
- Wallet connection button (demoLand: simulated)
- Privacy notice: "Your identity is a zero-knowledge commitment. We never see your raw identity data."

**DIDz integration point**: `providers.didz.registerIdentity()`

---

### Step 2 — Coverage Selection

| | demoLand | realDeal |
|---|---------|----------|
| **What happens** | User picks a coverage world (wallet / everyday / gaming) and a tier | Same, but tier is gated by DIDz credit-score band proof |
| **What's stored** | localStorage: `{ world, tier }` | On-chain: policy commitment with tier + scope hash |
| **Key principle** | Higher tiers require EDU certification (T2+) | Same — `PolicyRegistry.compact` enforces EDU gate |

**UI elements**:
- Coverage world cards (wallet, everyday, gaming) with icons
- Tier selector ($500 → $50,000) with EDU-required badges
- Premium estimate (demoLand: flat rate; realDeal: score-band-adjusted)

**DIDz integration point**: `providers.creditScore.getScoreInfo()` → premium multiplier
**RWAz integration point** (everyday only): RWA registry entry as the insured object

**Tier gate logic**:
```
T0 ($500)    — no EDU required, any score band
T1 ($1,000)  — no EDU required, any score band
T2 ($5,000)  — EDU required, score band ≥ C
T3 ($10,000) — EDU required, score band ≥ B (or A)
T4 ($25,000) — EDU required, score band ≥ B
T5 ($50,000) — EDU required, score band ≥ A
```

---

### Step 3 — EDU Certification (if required)

| | demoLand | realDeal |
|---|---------|----------|
| **What happens** | User sees available EDU modules and can "complete" them instantly | User completes modules, passes assessment, issuer signs cert via `EduCertifier.compact` |
| **What's stored** | localStorage: `{ modules: [], certId }` | On-chain: EDU attestation with holder signature (non-delegable) |
| **Key principle** | EDU acceptance must be signed by the holder — agents cannot do this | Same — enforced by `EduCertifier.compact` |

**UI elements**:
- Module list with checkboxes (wallet hygiene, seed custody, phishing, etc.)
- "Complete & Sign" button
- Non-delegable notice: "This step requires your personal cryptographic signature. An agent cannot complete this for you."

**DIDz integration point**: `providers.edu.issueCert()` — issuer approved via `TrustedIssuerRegistry`
**AgenticDID boundary**: Even if an agent manages the policy, the EDU signature is non-delegable.

---

### Step 4 — Agent Delegation (optional)

| | demoLand | realDeal |
|---|---------|----------|
| **What happens** | User can optionally delegate policy management to an agent with spend caps | `AgenticDID` scoped grant created on-chain with `per_action_cap` + `cumulative_cap` |
| **What's stored** | localStorage: `{ agentId, perActionCap, cumulativeCap }` | On-chain: AgenticDID grant with both caps enforced |
| **Key principle** | Two separate caps: per-action AND cumulative. Score-scaled tier ceiling. | Same — both caps enforced by AgenticDID circuits |

**UI elements**:
- Toggle: "Enable agent management" (off by default)
- Agent ID input
- Per-action cap slider ($0 – $50,000)
- Cumulative cap slider ($0 – $500,000)
- Tier ceiling display: "Agent can buy up to T{X} based on your score band"
- Notice: "Agent can manage policies and file claims, but CANNOT sign EDU acceptance."

**AgenticDID integration point**: `providers.agenticDID.createGrant()`

**Score-scaled ceiling**:
```
Band A → agent ceiling T5 ($50,000)
Band B → agent ceiling T3 ($10,000)
Band C → agent ceiling T2 ($5,000)
Band D → agent ceiling T1 ($1,000)
```

---

### Step 5 — Review & Confirmation

| | demoLand | realDeal |
|---|---------|----------|
| **What happens** | Summary screen → "Confirm" → policy created in mock store | Summary → ZK proof submitted → `PolicyRegistry.compact` creates on-chain policy → premium paid to `PremiumPool.compact` |
| **What's stored** | localStorage: full policy record | On-chain: policy commitment + premium pool deposit |

**UI elements**:
- Summary card: identity, coverage world, tier, premium, EDU status, agent (if any)
- "Confirm & Purchase" button
- Success screen with policy ID

**Provider calls**:
- `providers.policies.buyPolicy({ world, tier, scopeHash, eduCommitment? })`
- `providers.pool.getStats()` — show updated pool balance

---

## Post-Onboarding

After onboarding, the user lands on the **Dashboard** which shows:
- Active policies
- Pending claims
- Credit score band
- Pool balance
- DIDz identity commitment
- AgenticDID grant status (if delegated)

---

## RWAz Connection (Everyday Coverage)

For `everyday` coverage world, the insured object is an **RWAz registry
entry**. The onboarding flow for everyday coverage includes an additional
sub-step in Step 2:

1. User selects "Everyday coverage"
2. User selects or creates an RWAz entry (device, bike, instrument, etc.)
3. RWAz entry's appraised-value band feeds the coverage cap
4. Policy is bound to the RWAz entry's commitment

**demoLand**: RWAz entry is simulated (mock object + mock value band)
**realDeal**: `RWAz.compact` registry entry; appraised value proven in ZK

---

## Onboarding Flow Diagram

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│  Step 1   │────▶│  Step 2   │────▶│  Step 3   │────▶│  Step 4   │────▶│  Step 5   │
│  DIDz     │     │ Coverage  │     │   EDU     │     │  Agent    │     │ Confirm   │
│  Identity │     │ Selection │     │   Cert    │     │ Delegate  │     │ & Purchase│
└──────────┘     └──────────┘     └──────────┘     └──────────┘     └──────────┘
      │                │                │                │                │
      ▼                ▼                ▼                ▼                ▼
  DIDzRegistry    PolicyRegistry   EduCertifier    AgenticDID       PremiumPool
  .compact        .compact         .compact        scoped grant     .compact
                  (tier gate)      (non-delegable) (per+cum caps)  (premium in)
```

---

## Customization for New Client Types

This template can be adapted for:

- **Individual wallet holders** — standard 5-step flow
- **Gaming asset owners** — Step 2 uses gaming world, RWAz entry = game asset
- **Agent-managed accounts** — Step 4 is mandatory, Step 3 still non-delegable
- **Enterprise/LP onboarding** — different flow (see `docs/PARTNERS_AND_LIQUIDITY.md`)
