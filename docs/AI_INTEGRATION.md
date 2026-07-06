# CryptoSure — AI Integration Plan

> **How AI can assist with claims, underwriting, and customer support — phased and privacy-preserving.**

---

## Overview

AI is NOT required for CryptoSure to function. The protocol works fully
without it — ZK proofs handle underwriting, claims verification, and
certification. However, AI can significantly improve the user experience,
reduce operational costs, and assist human adjusters.

This document outlines a **three-phase AI integration plan**, from
rule-based assistance to full conversational AI with context awareness.

---

## Design Principles

1. **Privacy-first**: AI never sees raw identity, raw credit scores, or
   full asset details. It operates on ZK-proven band/eligibility bits and
   user-provided free text.
2. **Human-in-the-loop**: AI assists, humans decide. AI never auto-approves
   a claim payout. AI pre-screens and recommends; a human adjuster confirms.
3. **DIDz-aware**: AI can request ZK proofs of specific attributes (score
   band, EDU status) without seeing underlying values.
4. **AgenticDID-compatible**: AI agents can operate under scoped grants
   with `per_action_cap` and `cumulative_cap` — same rules as any agent.
5. **Non-delegable EDU**: AI cannot sign the EDU acceptance on behalf of
   the holder. This is a hard boundary.

---

## Phase 1 — Rule-Based Claim Pre-Screening (demoLand, current)

**Status**: Implemented in `MockAIAssistantProvider`

### What it does

- User describes a loss event in natural language
- Rule-based system checks keywords against covered event types
- Returns `{ likely: boolean, reason: string }`
- Helps users avoid filing claims for clearly non-covered events

### Current implementation

```
providers.ai.preScreenClaim(description, event)
→ { likely: true, reason: "Hardware wallet compromise is a covered event..." }
```

### Covered event rules

| Event type | Likely covered if... | NOT covered if... |
|-----------|---------------------|-------------------|
| `theft_covered_vector` | "hardware", "compromised" | "sent", "approved", "transfer" (voluntary) |
| `gaming_asset_destruction` | Any gaming asset loss | — |
| `gaming_asset_theft` | Any gaming asset theft | — |
| Any | — | "scam", "phishing", "drainer" (signed malicious approval) |

### What AI does NOT do in Phase 1

- No claim approval
- No claim denial
- No access to policy details
- No LLM — pure keyword matching

---

## Phase 2 — LLM-Powered Coverage Recommendations

**Status**: Planned (post-pilot)

### What it does

- Analyzes user's coverage world + DIDz score band
- Recommends optimal tier and EDU modules
- Explains policy scope in plain language
- Suggests risk-reduction actions (e.g., "complete hardware_wallet module
  to unlock T3")

### Integration points

```
providers.ai.suggestCoverage({ world, scoreBand })
→ "For wallet insurance, I recommend T2 ($5,000) after completing EDU..."
```

### LLM context (privacy-preserving)

The LLM receives:
- Coverage world (wallet / everyday / gaming)
- DIDz score band (A/B/C/D — one of 4 values, not the raw score)
- Current EDU certification status (boolean)
- Current active policies (tier + world only, no PII)

The LLM does NOT receive:
- Raw credit score
- Identity / DIDz commitment
- Wallet addresses
- Asset details
- Claim history details

### Suggested LLM providers

- OpenAI GPT-4o (general-purpose, strong reasoning)
- Anthropic Claude (strong at structured outputs)
- Local Llama/Mistral (for maximum privacy — runs on CryptoSure infra)

### AgenticDID integration

An AI agent providing coverage recommendations can operate under an
AgenticDID scoped grant:
- `per_action_cap`: 0 (read-only, no spend)
- `cumulative_cap`: 0
- Purpose: `coverage_recommendation`
- The agent can query `providers.creditScore.getScoreBand()` and
  `providers.policies.listPolicies()` but cannot buy or modify policies

---

## Phase 3 — Full Conversational Assistant

**Status**: Future (post-MVP)

### What it does

- Natural language chat interface (see `AIAssistantPage`)
- Context-aware: knows user's policies, claims, EDU status, pool stats
- Can guide users through:
  - Buying a policy
  - Filing a claim (step-by-step)
  - Completing EDU modules
  - Understanding coverage scope
  - Checking claim status
- Can pre-screen claims and explain the forensic recovery process

### Chat interface

Already implemented in demoLand at `frontend-demoland/src/pages/ai-assistant/`.
The UI is ready; only the backend changes between phases.

### Context payload (privacy-preserving)

```typescript
interface AIAssistantContext {
  currentPolicy: Policy | null;    // tier + world + status (no PII)
  currentClaim: Claim | null;       // status + event type (no PII)
  creditScoreBand: ScoreBand | null; // A/B/C/D only
  poolStats: PoolStats | null;       // public pool data
}
```

### What the AI can do

| Action | AI can | AI cannot |
|--------|--------|-----------|
| Recommend coverage tier | ✅ | — |
| Explain policy scope | ✅ | — |
| Pre-screen a claim | ✅ (recommendation only) | Auto-approve or auto-deny |
| Guide EDU completion | ✅ | Sign EDU acceptance (non-delegable) |
| Check claim status | ✅ | Modify claim status |
| Buy a policy | ❌ | ❌ (unless under AgenticDID grant with caps) |
| File a claim | ❌ | ❌ (unless under AgenticDID grant with caps) |

### AgenticDID + AI: the boundary

If an AI agent is delegated via AgenticDID:
- It CAN buy policies up to the score-scaled tier ceiling
- It CAN file claims on behalf of the holder
- It CANNOT sign the EDU acceptance — this is non-delegable by construction
- Both `per_action_cap` and `cumulative_cap` are enforced on-chain
- The AI agent's actions are logged to ZKSplunk for audit

---

## Phase 4 — AI-Assisted Underwriting (research)

**Status**: Research / not planned for MVP

### Concept

- AI models analyze on-chain behavior patterns (via ZKSplunk telemetry) to
  suggest credit-score adjustments to the DIDz oracle
- AI assists human underwriters in evaluating complex claims (e.g., multi-
  hop theft with mixer involvement)
- AI flags suspicious claim patterns (potential fraud)

### Privacy constraints

- AI sees only ZK-proven attributes and on-chain public data
- AI does not see raw identity, wallet addresses, or full asset inventories
- Fraud detection models operate on pattern anomalies, not PII
- All AI-assisted decisions are logged to ZKSplunk with audit trail

### DIDz oracle integration

The DIDz credit score oracle could accept AI-suggested adjustments:
1. AI analyzes ZKSplunk telemetry (anonymized patterns)
2. AI proposes score adjustment: `{ entity_commitment, delta, evidence_hash }`
3. DIDz oracle validates the proposal against its own rules
4. If accepted, the oracle updates the attestation
5. The AI never sees the entity's identity or raw score

---

## Implementation Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                    CryptoSure Frontend                        │
│                                                               │
│  ┌─────────────────┐  ┌──────────────────┐  ┌──────────────┐ │
│  │ AIAssistantPage │  │ ClaimsPage       │  │ PoliciesPage │ │
│  └────────┬────────┘  └────────┬─────────┘  └──────┬───────┘ │
│           │                    │                   │          │
│           ▼                    ▼                   ▼          │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │              IAIAssistantProvider                        │ │
│  │  chat() · suggestCoverage() · preScreenClaim()           │ │
│  └──────────────────────┬──────────────────────────────────┘ │
└─────────────────────────┼────────────────────────────────────┘
                          │
              ┌───────────┴───────────┐
              │  demoLand             │  realDeal
              │  MockAIAssistant      │  AI Service
              │  (rule-based)         │  (LLM + context)
              └──────────────────────┘
```

---

## Current Status

| Phase | Status | Component |
|-------|--------|-----------|
| Phase 1 — Rule-based pre-screening | ✅ Implemented (demoLand) | `MockAIAssistantProvider` |
| Phase 2 — LLM coverage recommendations | Planned | `IAIAssistantProvider.suggestCoverage()` |
| Phase 3 — Conversational assistant | UI ready (demoLand) | `AIAssistantPage` + `MockAIAssistantProvider.chat()` |
| Phase 4 — AI-assisted underwriting | Research | DIDz oracle + ZKSplunk |

---

## Key Takeaway

AI is an **assistant layer** on top of the ZK-proof-based protocol. The
protocol works without it. AI improves UX and operational efficiency but
never replaces the cryptographic guarantees of Midnight, DIDz identity,
or the non-delegable EDU signature.
