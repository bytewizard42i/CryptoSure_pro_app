# CryptoSure — Roadmap

*Phased plan from concept to demo. Compile-first: every Compact contract is validated via
the Midnight MCP (skipZk) before it is written to a `.compact` file, then compiled locally.*

---

## Phase 0 — Design (current, 2026-07-06)

- [x] Concept + two-world model (everyday `.me` + crypto wallet `.app`)
- [x] Architecture: premium pool, policy, underwriting, activation, claim, payout
- [x] Tier model ($500 → $50k) + EDU gating rules
- [x] CryptoSure-EDU certification flow (holder-signed activation)
- [x] DIDz credit score → premium + cap integration design
- [x] DIDzM reuse map (Escrow/Treasury, TrustedIssuerRegistry, SCIFz, RWAz, AgenticDID)
- [ ] Honest coverage-scope doc: what wallet insurance IS and IS NOT responsible for

## Phase 1 — Core contracts (design → validated Compact)

- [ ] `PremiumPool` — shielded Treasury/Pot: collect premiums, hold reserves, pay claims
- [ ] `PolicyRegistry` — policy commitments (holder DIDz, tier, scope hash, EDU commit)
- [ ] Underwriting circuit — verify DIDz credit-score band → set premium + cap in ZK
- [ ] Tier enforcement — cap ladder, EDU-required gate for tiers ≥ $5k

## Phase 2 — CryptoSure-EDU

- [ ] EDU issuer approval via DIDz `TrustedIssuerRegistry` (domain = "CRYPTOSURE-EDU")
- [ ] Cert attestation (DIDz `attest_to_did`) + scope-hash binding
- [ ] Holder-signed activation proof (cert + current scope hash, ZK-verified)
- [ ] Premium discount for certified low-tier holders

## Phase 3 — Claims & payout

- [ ] Claim submission: ZK proof a covered loss event occurred
- [ ] Anti-double-claim nullifier (SCIFz pattern)
- [ ] Selective disclosure to adjuster only (not public)
- [ ] Escrow-style payout release from `PremiumPool`
- [ ] Reclaim/expiry paths, dispute window

## Phase 4 — Ecosystem integration

- [ ] DIDz: credit-score band proof circuit consumed by underwriting
- [ ] AgenticDID: agent-managed policies under spend-capped grants
- [ ] RWAz: everyday-coverage insured object = RWA registry entry
- [ ] KYCz: regulated higher-assurance path for the largest tiers

## Phase 5 — demoLand / realDeal

- [ ] demoLand frontend (amber DEMO MODE banner, 7-auth standard, simulated pool/claims)
- [ ] realDeal: local Midnight stack → pre-prod (skip preview per house convention)
