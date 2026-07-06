# CryptoSure — Roadmap

*Phased plan from concept to demo. Compile-first: every Compact contract is validated via
the Midnight MCP (skipZk) before it is written to a `.compact` file, then compiled locally.*

---

## Phase 0 — Design (current, 2026-07-07)

- [x] Concept + two-world model (everyday `.me` + crypto wallet `.app`)
- [x] Architecture: premium pool, policy, underwriting, activation, claim, payout
- [x] Tier model ($500 → $50k) + EDU gating rules
- [x] CryptoSure-EDU certification flow (holder-signed activation)
- [x] DIDz credit score → premium + cap integration design
- [x] DIDzM reuse map (Escrow/Treasury, TrustedIssuerRegistry, SCIFz, RWAz, AgenticDID)
- [x] Pilot jurisdiction analysis (PA + surrounding states → WV sandbox + Vermont captive)
- [x] Partners & liquidity providers strategy + open call for forensic recovery partners
- [x] Partner contacts directory (forensics, gaming insurers, LPs, brokers)
- [x] Forensic recovery pipeline design + crypto immutability thesis
- [x] Gaming asset insurance pilot design (less-regulated entry point)
- [x] Ecosystem coordination design (DIDz + AgenticDID + RWAz + ZKSplunk → CryptoSure opsec)
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
- [ ] ZKSplunk: register CryptoSure contracts as monitored DApp; wire SplunkForwarder

## Phase 5 — Forensic recovery & gaming pilot

- [ ] Forensic partner integration: Chainalysis/TRM/Elliptic API for claim tracing
- [ ] Forensic report → ZKSplunk attestation pipeline (hash + anchor investigation results)
- [ ] Gaming asset insurance pilot (service-contract model, WV sandbox)
- [ ] CRYPTOSURE-GAMING-EDU issuer set (game publishers/platform operators)
- [ ] RWAz gaming asset entries (NFTs, game items, virtual real estate)

## Phase 6 — Partner outreach & regulatory filing

- [ ] P0 outreach: Relm Insurance (co-development), Jorgensen & Co. (gaming asset tech layer)
- [ ] P1 outreach: Newfront (broker + Evertas intro), Chainalysis (Partner Program)
- [ ] P2 outreach: TRM Labs, Elliptic, Evertas (via Newfront)
- [ ] WV insurance sandbox application (or Vermont captive filing)
- [ ] LP onboarding: first institutional capacity provider signed

## Phase 7 — demoLand / realDeal

- [ ] demoLand frontend (amber DEMO MODE banner, 7-auth standard, simulated pool/claims)
- [ ] realDeal: local Midnight stack → pre-prod (skip preview per house convention)
