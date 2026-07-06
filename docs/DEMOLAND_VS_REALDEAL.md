# CryptoSure — demoLand vs realDeal Convention

> **One codebase, two worlds. The UI never knows which one it's in.**

---

## The Pattern

CryptoSure follows the DIDzMonolith house convention: every frontend runs in
either **demoLand** (mock data, no blockchain) or **realDeal** (live Midnight
contracts, real DIDz identity, real capital). The mode is selected at build
time via the `VITE_CS_MODE` environment variable.

```
VITE_CS_MODE=demoland   →  mock providers, localStorage, simulated delays
VITE_CS_MODE=realdeal   →  Midnight SDK, DIDz contracts, real transactions
```

Default is `demoland` if the variable is unset.

---

## Provider Architecture

Both modes implement the same `Providers` interface (see
`frontend-demoland/src/providers/types.ts`). The UI calls provider methods
like `providers.policies.listPolicies()` — it never checks the mode.

```
┌─────────────────────────────────────────────┐
│                 React UI                      │
│  (calls useProviders() — mode-agnostic)       │
└──────────────────┬──────────────────────────┘
                   │
         ┌─────────┴─────────┐
         │  ProvidersProvider │  (reads VITE_CS_MODE)
         └──────┬──────┬─────┘
                │      │
   ┌────────────┘      └────────────┐
   │  demoLand                      │  realDeal
   │  MockAuthProvider              │  MidnightWalletProvider
   │  MockPolicyProvider            │  PolicyRegistry.compact
   │  MockClaimProvider             │  ClaimEngine.compact
   │  MockEduProvider               │  EduCertifier.compact
   │  MockPoolProvider              │  PremiumPool.compact
   │  MockDidzProvider              │  DIDzRegistry.compact
   │  MockAgenticDIDProvider        │  AgenticDID scoped grants
   │  MockAIAssistantProvider       │  LLM service (future)
   └──────────────────────────────  └─────────────────────────────
```

---

## What demoLand Does

- **Auth**: 7-method standard (email, PGP, DID wallet, Trezor, biometric,
  Chrome OAuth, Brave OAuth). Sessions stored in localStorage.
- **Policies**: Pre-seeded mock policies. `buyPolicy()` creates a new mock
  policy with a simulated delay.
- **Claims**: Mock claims with status transitions. `submitClaim()` adds to
  the list.
- **EDU**: Mock certifications and modules. `issueCertById()` simulates
  completion.
- **Pool**: Hardcoded pool stats and event history.
- **DIDz**: Returns a fake commitment string (`0xDEMO_didz_commitment_*`).
- **AgenticDID**: Returns a mock grant with demo caps.
- **AI**: Rule-based responses (keyword matching, no LLM).

### demoLand visual signals

- Amber `🎭 DEMO MODE` banner at the top of every page
- All amounts are simulated — no real value moves
- DIDz/AgenticDID sections show placeholder commitments with TODO markers

---

## What realDeal Will Do

- **Auth**: Midnight wallet connection (Passport or compatible wallet).
  DIDz commitment derived from the wallet's signing key.
- **Policies**: `PolicyRegistry.compact` on Midnight. `buyPolicy()` submits
  a ZK proof of credit-score band + EDU cert (if required) and creates an
  on-chain policy commitment.
- **Claims**: `ClaimEngine.compact`. `submitClaim()` files a ZK claim proof
  with selective disclosure to the adjuster. Anti-double-claim via SCIFz
  nullifier.
- **EDU**: `EduCertifier.compact`. Issuer approval via DIDz
  `TrustedIssuerRegistry`. Holder-signed activation proof is non-delegable.
- **Pool**: `PremiumPool.compact` — shielded Treasury/Pot. Real premiums
  flow in, real payouts flow out via escrow release.
- **DIDz**: `DIDzRegistry.compact` — real identity commitment, real credit
  score attestation via ZK proof.
- **AgenticDID**: Real scoped grants with `per_action_cap` and
  `cumulative_cap` enforced on-chain.
- **AI**: LLM-powered (see `docs/AI_INTEGRATION.md`).

### Network progression (house convention)

1. **Local first** — full local stack (node + indexer + proof-server)
2. **Pre-prod second** — stable public testnet
3. **Skip preview** — not needed, adds friction

---

## Ecosystem Connections (demoLand → realDeal)

| Ecosystem | demoLand | realDeal |
|-----------|----------|----------|
| **DIDz.io** | Fake commitment string | `DIDzRegistry.compact` on Midnight; `prove_score_at_least` ZK circuit for underwriting |
| **AgenticDID** | Mock grant with demo caps | AgenticDID scoped grants on-chain; `per_action_cap` + `cumulative_cap` enforced; score-scaled tier ceiling |
| **RWAz** | Not yet wired | RWA registry entry as the insured object for everyday `.me` coverage; appraised-value band feeds the cap |
| **KYCz** | Not yet wired | Optional regulated higher-assurance path for T4–T5 tiers |
| **SCIFz** | Not yet wired | Nullifier for anti-double-claim; Merkle membership for policy verification |
| **ZKSplunk** | Not yet wired | Pool health monitoring; claim event attestation; tamper-evident telemetry |
| **EncryptVault** | Not yet wired | Wallet-ownership proofs binding the insured wallet to the policy |

---

## Switching Modes

### Development

```bash
# demoLand (default)
cd frontend-demoland
npm run dev

# realDeal (will throw until providers are implemented)
VITE_CS_MODE=realdeal npm run dev
```

### Build

```bash
VITE_CS_MODE=demoland npm run build   # demo deployment
VITE_CS_MODE=realdeal npm run build   # production (not yet functional)
```

---

## Adding a New Provider

1. Add the interface to `types.ts`
2. Implement the mock in `providers/demoland/mock-*.ts`
3. Add a stub in `providers/realdeal/index.ts` (throw until implemented)
4. Wire into `providers/demoland/index.ts` and the `Providers` interface
5. Use `useProviders()` in any page — it works in both modes

---

## Status

- **demoLand**: Fully functional with mock data for all 9 providers
- **realDeal**: Stub only — throws on instantiation. Will be implemented
  when Compact contracts are deployed (see `ROADMAP.md` Phase 1–4).
