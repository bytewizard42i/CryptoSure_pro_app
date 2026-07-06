# CryptoSure — Ecosystem Coordination

> **How DIDz, AgenticDID, RWAz, and ZKSplunk form the cornerstone of CryptoSure's
> operational security, claims integrity, and forensic observability.**
>
> **Date**: July 7, 2026

---

## The Thesis

CryptoSure is not a standalone product. It is the **consumer-facing insurance layer** of
the DIDzMonolith ecosystem, and its security model depends on four internal systems working
in concert:

| System | Role in CryptoSure | One-liner |
|--------|-------------------|-----------|
| **DIDz** | Identity + credit score + EDU certification | *Who you are and how much we trust you* |
| **AgenticDID** | Agent authority + delegated spend caps | *What your agents can do on your behalf* |
| **RWAz** | Insured object registry + value bands | *What you're insuring and what it's worth* |
| **ZKSplunk** | Observability + threat detection + attestation | *Whether the system is honest and healthy* |

Without these four, CryptoSure is just a smart contract with a pool. **With** them, it
becomes a privacy-preserving insurance protocol with end-to-end claim integrity, forensic
traceability, and real-time operational security.

---

## Architecture Overview

```
                         ┌─────────────────────────────────────────────────────┐
                         │                   CryptoSure                         │
                         │                                                      │
                         │  PolicyRegistry · PremiumPool · ClaimEngine · EDU    │
                         └──────┬──────────┬──────────┬──────────┬──────────────┘
                                │          │          │          │
                    ┌───────────▼──┐ ┌──────▼──────┐ ┌▼─────────┐ ┌▼──────────────┐
                    │    DIDz.io   │ │ AgenticDID  │ │  RWAz    │ │   ZKSplunk    │
                    │              │ │             │ │          │ │               │
                    │ DIDzRegistry │ │ Scoped      │ │ RWA      │ │ MidnightVitals│
                    │ TrustedIssuer│ │ grants      │ │ registry │ │ → Splunk HEC  │
                    │ Registry     │ │ per_action  │ │ value    │ │               │
                    │              │ │ _cap        │ │ bands    │ │ zkZap threat  │
                    │ Credit score │ │ cumulative  │ │ steward  │ │ detection     │
                    │ attestations │ │ _cap        │ │ history  │ │               │
                    │              │ │             │ │          │ │ On-chain      │
                    │ EDU cert     │ │ Non-        │ │ Cap =    │ │ attestation   │
                    │ verification │ │ delegable   │ │ f(score, │ │ (tamper-      │
                    │              │ │ EDU sig     │ │ value)   │ │  evident)     │
                    └──────────────┘ └─────────────┘ └──────────┘ └───────────────┘
                         │                                              │
                         │              ┌────────────────┐              │
                         └──────────────│  Forensic      │──────────────┘
                                        │  Partners      │
                                        │  (external)    │
                                        │                │
                                        │ Chainalysis    │
                                        │ TRM Labs       │
                                        │ Elliptic       │
                                        │ Crystal        │
                                        └────────────────┘
```

---

## 1. DIDz → CryptoSure: Identity, Trust, and Certification

### 1.1 Policyholder Identity

Every CryptoSure policy is bound to a **DIDz identity** — a non-transferable registry
entry (not an NFT, per John's ruling §0b). The DIDz provides:

- **One canonical identity per entity** — accountability anchor, never on the wire.
- **Pairwise presentation DIDs** per counterparty — anti-collusion (CryptoSure sees
  a presentation DID, not the canonical DID).
- **Privacy default** (§0): on-chain = commitments + status bits only. Raw identity
  facts stay off-chain, revealed one bit at a time via ZK circuits.

**Integration point**: `PolicyRegistry` stores a DIDz commitment (not the raw DID).
At claim time, the holder proves `assert_i_control(didz_commitment)` via a ZK circuit
imported from DIDz.

### 1.2 Credit Score → Premium and Coverage Cap

The DIDz credit score (see [`DIDZ_CREDIT_SCORE.md`](DIDZ_CREDIT_SCORE.md)) is a
privacy-preserving reputation signal:

- **Off-chain scoring oracle** computes a 0–1000 score from ecosystem signals.
- **On-chain**: signed score attestation as a DIDz commitment.
- **CryptoSure consumes it via ZK band proofs** — only boolean thresholds are revealed:
  - "Score ≥ 550?" → gates tier eligibility (coverage cap).
  - "Score ≥ 700?" → gates premium multiplier (pricing).

**Integration point**: CryptoSure imports DIDz's `prove_score_at_least` circuit. No
score logic is duplicated. The scoring oracle is registered as a Trusted Issuer in
`TrustedIssuerRegistry` with `primaryDomain = hash("CREDIT-SCORE")`.

### 1.3 CryptoSure-EDU Certification

Higher tiers ($5k–$50k) require a **CryptoSure-EDU certification** — a behavioral
hygiene credential issued by approved issuers registered in DIDz's
`TrustedIssuerRegistry`:

- Issuer domain: `hash("CRYPTOSURE-EDU")` (and `hash("CRYPTOSURE-GAMING-EDU")` for
  the gaming pilot).
- The holder signs the EDU acceptance — this signature is **non-delegable**, even
  under AgenticDID (see §2 below).
- EDU completion also feeds back into the credit score as a positive signal.

**Integration point**: `EduCertifier` contract consumes `TrustedIssuerRegistry` to
validate issuer authority, then checks the attestation on `DIDzRegistry`.

### 1.4 What DIDz Provides (Summary)

| DIDz Component | CryptoSure Usage | ZK Proof |
|----------------|-----------------|----------|
| `DIDzRegistry` | Policyholder identity binding | `assert_i_control` |
| `TrustedIssuerRegistry` | EDU issuer + scoring oracle approval | Issuer membership proof |
| Credit score attestation | Premium band + coverage cap | `prove_score_at_least` |
| EDU certification | Tier activation gate ($5k+) | Attestation existence + holder signature |
| Selective disclosure | Reveal only booleans, never raw values | Band-proof circuits |

---

## 2. AgenticDID → CryptoSure: Agent Authority and Spend Caps

### 2.1 Agent-Managed Policies

AgenticDID allows a principal (human DIDz holder) to delegate authority to an agent
(automated or human) to purchase and manage insurance on their behalf. The delegation
uses **scoped grants** with two independent spend limits:

- **`per_action_cap`**: maximum spend per single transaction (e.g., one policy purchase).
- **`cumulative_cap`**: maximum total spend across all delegated actions.

Both are enforced on-chain. `max-Uint64` sentinel = unlimited; `0` = valid no-spend.
Child grants reserve from parent cumulative budget (delegation chains can't overspend).

**Integration point**: CryptoSure's `PolicyRegistry.buyPolicy()` accepts an optional
grant proof. The circuit verifies the grant is valid, the principal's DIDz matches the
policyholder, and the premium ≤ `per_action_cap` and remaining `cumulative_cap`.

### 2.2 Score-Scaled Caps

A grant's caps may be expressed relative to the **principal's credit-score band**:

- A higher-score principal can authorize an agent to buy up to a higher CryptoSure tier.
- Design: the grant records `maxInsuranceTierByBand` and the agent must prove the
  principal's band at purchase time.
- This means a principal with score ≥ 850 can delegate an agent to buy up to $50k
  coverage, while a principal with score ≥ 550 can only delegate up to $5k.

### 2.3 Non-Delegable EDU Signature

For tiers $5k and above, the **holder (human) must personally sign the EDU acceptance**.
An agent cannot self-satisfy this requirement — even with full delegated authority.

- The agent orchestrates the purchase (selects tier, pays premium, binds RWAz object).
- The principal (human) must independently sign the EDU acceptance proof.
- This prevents an agent from upgrading coverage beyond what the human has certified for.

**Integration point**: `EduCertifier` requires a holder-signed acceptance proof that
includes a domain-separated tag (`pad(32, "CRYPTOSURE-EDU-ACCEPT")`). The circuit
verifies the signature against the DIDz-registered owner key, not the agent's key.

### 2.4 What AgenticDID Provides (Summary)

| AgenticDID Component | CryptoSure Usage |
|----------------------|-----------------|
| Scoped grants (`per_action_cap`, `cumulative_cap`) | Limit agent purchasing authority |
| Delegation chains | Multi-level agent hierarchies for enterprise policies |
| Score-scaled caps | Tier ceiling = f(principal score band) |
| Agent-vs-human credential class | Distinguish agent-initiated vs human-initiated claims |
| Non-delegable EDU signature | Human-in-the-loop for high-tier activation |

---

## 3. RWAz → CryptoSure: Insured Objects and Value Bands

### 3.1 The Insured Object

For everyday `.me` coverage (tiers $500–$50k), the insured object is an **RWAz registry
entry** — a real-world asset registered on Midnight with:

- **Appraised-value band** (privacy-preserving — the raw value is never on-chain).
- **Owner DIDz commitment** (links to the policyholder).
- **Stewardship history** (fraud flags, transfer history, clean-record duration).

### 3.2 Insurable Cap = f(score band, value band)

CryptoSure combines two privacy-preserving band proofs to set the coverage cap:

```
maxCoverage = lookupTable[scoreBand][valueBand]
```

Neither the raw credit score nor the raw appraised value is ever revealed. The circuit
learns only "score is in band B and value is in band V" → cap is $X.

**Integration point**: `PolicyRegistry.buyPolicy()` accepts an RWAz ownership proof
and value-band proof. The circuit verifies:
1. The RWAz entry exists and is owned by the policyholder's DIDz.
2. The appraised-value band is valid (issued by an approved appraiser in
   `TrustedIssuerRegistry`).
3. The coverage requested ≤ `lookupTable[scoreBand][valueBand]`.

### 3.3 Stewardship History → Credit Score

RWAz stewardship data feeds back into the DIDz credit score:

- **Clean history** (no fraud flags, long ownership duration) → positive signal.
- **Fraud flags** → negative signal, potentially caps the holder at lower tiers.
- **Transfer velocity** (rapid transfers may indicate money laundering) → risk signal.

This creates a **feedback loop**: good asset stewardship → higher score → higher
coverage cap → lower premium. Bad stewardship → lower score → lower cap → higher premium.

### 3.4 Gaming Assets (Pilot)

For the gaming asset insurance pilot (see [`GAMING_ASSET_INSURANCE.md`](GAMING_ASSET_INSURANCE.md)),
RWAz entries represent in-game digital assets:

- NFTs, game items, virtual real estate.
- Value band derived from marketplace floor prices + rarity scores.
- Stewardship = ownership duration + transfer history on-chain.

### 3.5 What RWAz Provides (Summary)

| RWAz Component | CryptoSure Usage |
|----------------|-----------------|
| RWA registry entries | The insured object itself |
| Appraised-value bands | Coverage cap input (privacy-preserving) |
| Owner DIDz binding | Link insured object to policyholder |
| Stewardship history | Credit score input + fraud detection |
| Fraud flags | Claim denial trigger + score penalty |

---

## 4. ZKSplunk → CryptoSure: Observability, Threat Detection, and Attestation

### 4.1 The Cornerstone of CryptoSure OpSec

ZKSplunk is the **operational spine** of CryptoSure. It bridges Midnight's ZK-proof
infrastructure to Splunk's enterprise observability platform, providing:

1. **Real-time vital monitoring** — proof server, network, wallet, contracts.
2. **zkZap threat detection** — anomaly detection on public ledger signals.
3. **Tamper-evident on-chain attestation** — telemetry commitments anchored on-chain.
4. **Incident response** — detect → decide → act, with on-chain incident records.

Without ZKSplunk, CryptoSure operates blind. With it, every claim, every policy
interaction, and every pool operation is monitored, attested, and auditable.

### 4.2 What ZKSplunk Monitors in CryptoSure

CryptoSure registers as a **monitored DApp** in ZKSplunk. The `SplunkForwarder` is
wired into CryptoSure's contract lifecycle:

| Vital Monitor | What It Watches | CryptoSure-Specific Signal |
|---------------|-----------------|---------------------------|
| **proof-server** | Midnight proof server health | Proof generation for claim circuits — latency spikes = potential griefing |
| **network** | Indexer + block cadence | Block height stalls = payout delays; sync lag = stale policy state |
| **wallet** | Wallet connectivity + DUST balance | Pool wallet health — low DUST = can't pay claims |
| **contracts** | Contract readability + last interaction | PolicyRegistry/ClaimEngine responsiveness — silent contract = potential freeze |

### 4.3 zkZap Threat Signals for CryptoSure

ZKSplunk's zkZap security layer re-reads telemetry as **threat signals**. For CryptoSure,
the following signals are critical:

| zkZap Signal | Observable Evidence | CryptoSure Risk |
|--------------|---------------------|-----------------|
| **proof-flood** | Sustained proof-server latency blow-up | Attacker flooding claim circuit to delay legitimate payouts |
| **failed-auth-bruteforce** | Burst of failed/rejected calls to one entry point | Attacker trying to forge claim proofs |
| **wallet-drain** | Rapid `claimed_unshielded_spends` (addr + amount) | Pool wallet being drained — emergency freeze needed |
| **mint-anomaly** | `shielded_mints` / `unshielded_mints` rate spike | Unauthorized minting of policy tokens |
| **indexer-outage** | Health-check failures + growing sync lag | Claims can't verify on-chain state — halt new claims |

### 4.4 On-Chain Attestation: Tamper-Evident Claims Trail

Every CryptoSure vital check produces a **telemetry snapshot** that is:

1. **Canonically hashed** (SHA-256 of deterministic JSON — see `telemetry-commitment.ts`).
2. **Anchored on-chain** via the `zksplunk.compact` contract's `attestObservation()` circuit.
3. **Correlated in Splunk** via the shared `attestation_commitment` field.

This means an auditor can:
- Query Splunk for all CryptoSure events in a time window.
- Re-hash the off-chain telemetry data.
- Verify the hash matches what was attested on-chain at that block height.
- **Prove the telemetry wasn't tampered with** between collection and audit.

For CryptoSure, this is the **claims integrity backbone**:

```
Claim filed → ClaimEngine circuit fires → proof server generates ZK proof
            → ZKSplunk captures vital check (proof-server latency, success/fail)
            → Telemetry commitment anchored on-chain
            → Splunk indexes the event with attestation linkage
            → Auditor can verify: "this claim was processed honestly at block N"
```

### 4.5 Incident Response Loop

When zkZap detects a threat signal against CryptoSure:

```
Detect (zkZap) → Decide (severity assessment) → Act:
  ├── Low severity    → Splunk alert + log
  ├── Medium severity → Notify opsec admin (email/Slack)
  ├── High severity   → Open on-chain incident (reportIncident)
  └── Critical        → Open incident + trigger emergency freeze
                        (pause ClaimEngine payouts until resolved)
```

The on-chain incident record is **tamper-evident** — once `reportIncident()` is called,
the incident exists on-chain with a commitment to the evidence. Status transitions
(open → acknowledged → mitigated → resolved) are all on-chain.

### 4.6 Integration Architecture

```
CryptoSure DApp
├── PolicyRegistry.compact     ──┐
├── PremiumPool.compact         ──┤
├── ClaimEngine.compact         ──┼── ZKSplunk SplunkForwarder
├── EduCertifier.compact       ──┤    │
└── (wallet / proof server)    ──┘    │
                                      ▼
                               ┌──────────────┐
                               │ vitals-adapter│  (vital checks → Splunk events)
                               └──────┬───────┘
                                      │
                          ┌───────────┼───────────┐
                          ▼           ▼           ▼
                    ┌──────────┐ ┌──────────┐ ┌──────────────┐
                    │ Splunk   │ │ zkZap    │ │ zksplunk.    │
                    │ HEC      │ │ detector │ │ compact      │
                    │ (index)  │ │ (threats)│ │ (attest +    │
                    │          │ │          │ │  incidents)  │
                    └──────────┘ └──────────┘ └──────────────┘
```

### 4.7 What ZKSplunk Provides (Summary)

| ZKSplunk Component | CryptoSure Usage |
|--------------------|-----------------|
| `SplunkForwarder` | Streams CryptoSure vitals to Splunk |
| `vitals-adapter` | Translates ZK-specific events to Splunk format |
| `telemetry-commitment` | Canonical hashing for tamper-evident audit trail |
| `attestation-client` | Anchors commitments on-chain via `zksplunk.compact` |
| zkZap detector | Threat signal detection (proof-flood, wallet-drain, etc.) |
| `reportIncident` | On-chain incident records for critical events |
| Splunk dashboards | Operational visibility for claims, pool health, anomalies |

---

## 5. Cross-System Coordination: A Claim Lifecycle

To illustrate how all four systems coordinate, here is a complete claim lifecycle:

### Phase 1: Policy Purchase

1. **DIDz**: Holder proves identity via `assert_i_control(didz_commitment)`.
2. **DIDz**: Holder proves credit-score band via `prove_score_at_least(threshold)`.
3. **RWAz**: Holder proves ownership of insured RWA + value band.
4. **AgenticDID** (if agent-initiated): Agent proves valid grant + spend cap compliance.
5. **DIDz**: For tiers $5k+, holder signs EDU acceptance (non-delegable).
6. **CryptoSure**: `PolicyRegistry.buyPolicy()` — premium paid, policy committed on-chain.
7. **ZKSplunk**: Vital check event indexed in Splunk with on-chain attestation.

### Phase 2: Loss Event

1. Holder experiences a covered loss (e.g., wallet compromise, gaming asset destruction).
2. Holder (or agent) initiates a claim via `ClaimEngine.fileClaim()`.
3. **ZKSplunk**: Claim filing triggers a vital check — proof server health, contract
   responsiveness. Telemetry commitment anchored on-chain.

### Phase 3: Claim Verification

1. **DIDz**: Holder proves identity + policy ownership via ZK.
2. **SCIFz**: Nullifier check — this claim hasn't been filed before (anti-double-claim).
3. **RWAz**: Verify the insured asset's state (e.g., was it transferred? destroyed?).
4. **Forensic Partner** (external): Chainalysis/TRM/Elliptic traces the loss event:
   - For theft: trace stolen funds to current wallet(s).
   - For accidental loss: verify the loss pattern matches covered events.
5. **ZKSplunk**: Forensic investigation results logged as Splunk events with attestation.
   zkZap monitors for anomalies during the investigation (e.g., sudden wallet activity
   suggesting the "theft" was self-inflicted).

### Phase 4: Payout

1. **CryptoSure**: `ClaimEngine.approveClaim()` — escrow release from `PremiumPool`.
2. **ZKSplunk**: Payout event indexed + attested. zkZap watches for wallet-drain signals
   (if the payout address suddenly moves funds to a high-risk entity, alert fires).
3. **DIDz**: Claim history feeds back into credit score (successful claim = neutral,
   fraudulent claim attempt = severe score penalty).
4. **RWAz**: If asset was recovered, RWAz entry updated. If lost permanently, entry
   marked.

### Phase 5: Audit

1. Auditor queries Splunk for all events related to this claim.
2. Re-hashes off-chain telemetry data.
3. Verifies hashes match on-chain attestations at the relevant block heights.
4. **Result**: Tamper-evident proof that the claim was processed honestly, from filing
   to payout, with every system's contribution visible and verifiable.

---

## 6. Privacy Guarantees Across the Stack

| Fact | On-chain | In Splunk | Revealed to forensic partner |
|------|----------|-----------|------------------------------|
| Policyholder identity | Commitment only | Not stored | Only if legally compelled |
| Credit score | Commitment only | Not stored | Never |
| RWA value | Band only | Not stored | Only if needed for claim |
| Claim amount | Shielded | Event metadata (not PII) | Yes (for tracing) |
| Forensic trace results | Commitment | Indexed + attested | Yes (investigator needs it) |
| System health | Attestation only | Full telemetry | Not shared (opsec) |
| Incident records | On-chain (tamper-evident) | Full detail | On need-to-know basis |

**Key principle**: ZKSplunk never reads private state. It monitors *public* signals
(metadata, volumes, proof-server health, contract call patterns). Privacy is preserved
by construction, not by policy.

---

## 7. Failure Modes and Resilience

| Failure | Impact on CryptoSure | Mitigation |
|---------|---------------------|------------|
| **Proof server down** | Can't generate claim proofs → claims stall | ZKSplunk alerts; claims queue with timeout SLA |
| **Indexer outage** | Can't verify on-chain state → new policies halt | ZKSplunk alert; read-only mode for existing policies |
| **Pool wallet drained** | Can't pay claims | zkZap wallet-drain signal → emergency freeze |
| **Forensic partner unavailable** | Can't verify theft claims | Multi-partner redundancy (Chainalysis + TRM + Elliptic) |
| **Scoring oracle compromised** | Bad credit scores → wrong pricing | DIDz TrustedIssuerRegistry suspension circuit; score freshness windows |
| **Agent exceeds authority** | Unauthorized policy purchase | AgenticDID per_action_cap + cumulative_cap enforced on-chain |
| **ZKSplunk connector down** | No observability → blind operations | Connector heartbeat alert; fallback to local logging; claims pause if no attestation for N blocks |

---

## 8. Contract Build Order (Cross-Repo)

The ecosystem coordination requires contracts in a specific build order:

1. **DIDz**: `prove_score_at_least` circuit (shared band-proof) — exported for CryptoSure.
2. **DIDz**: `TrustedIssuerRegistry` entries for `CREDIT-SCORE` and `CRYPTOSURE-EDU` domains.
3. **RWAz**: Value-band proof circuit (exported, shared).
4. **AgenticDID**: Grant verification circuit with score-scaled cap support.
5. **CryptoSure**: `PremiumPool` (Treasury/Pot) — simplest, unblocks payout testing.
6. **CryptoSure**: `PolicyRegistry` (commitments + state machine + underwriting cap gate).
7. **CryptoSure**: `EduCertifier` (TrustedIssuerRegistry consumer + attestation + signed-acceptance).
8. **CryptoSure**: `ClaimEngine` (nullifier + selective disclosure + payout call).
9. **ZKSplunk**: Register CryptoSure contracts as monitored DApps in `zksplunk.compact`.

Each contract: draft → MCP compile (skipZk) → fix → local `compact compile` → commit.
No `.compact` written to disk before it validates.

---

## 9. Open Coordination Questions

- **Forensic partner data sharing**: How do Chainalysis/TRM results flow into the ZKSplunk
  attestation pipeline? Need an off-chain integration layer that hashes forensic reports
  and anchors them alongside vital checks.
- **Cross-chain claims**: If an insured asset moves across chains (e.g., Cardano → Midnight
  bridge), how does RWAz track it? Needs bridge monitoring in ZKSplunk.
- **Agent-initiated claims**: Should agents be allowed to file claims, or only humans?
  Current design: claims require holder proof (non-delegable), but agents can initiate
  the process.
- **Regulatory attestation**: Can ZKSplunk's on-chain attestations serve as regulatory
  evidence for insurance commissioners? Needs legal review per jurisdiction.
- **Gaming pilot EDU**: The `CRYPTOSURE-GAMING-EDU` domain needs its own issuer set —
  potentially game publishers or platform operators as trusted issuers.

---

## 10. References

- [`DIDZ_CREDIT_SCORE.md`](DIDZ_CREDIT_SCORE.md) — Credit score design and cross-repo changes
- [`DIDzM_REUSE.md`](DIDzM_REUSE.md) — What CryptoSure lifts from the DIDz family
- [`FORENSIC_RECOVERY.md`](FORENSIC_RECOVERY.md) — Forensic recovery pipeline and case studies
- [`GAMING_ASSET_INSURANCE.md`](GAMING_ASSET_INSURANCE.md) — Gaming asset pilot design
- [`PARTNERS_AND_LIQUIDITY.md`](PARTNERS_AND_LIQUIDITY.md) — LP strategy and partner categories
- [`PARTNER_CONTACTS.md`](PARTNER_CONTACTS.md) — Contact directory for all partners
- [`PILOT_JURISDICTION.md`](PILOT_JURISDICTION.md) — Regulatory analysis and pilot recommendation
- ZKSplunk README — `ZKSplunk_Splunking_w_Midnight/README.md`
- ZKSplunk zkZap Protocol — `ZKSplunk_Splunking_w_Midnight/docs/ZKZAP_SECURITY_PROTOCOL.md`
- DIDz three-pillar model — `DIDZ_AGENTICDID_IMPLEMENTATION_PLAN.md` (synced across DIDz-io, AgenticDID, RWAz)
