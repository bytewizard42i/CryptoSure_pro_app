# CryptoSure — Roadmap

*Phased plan from concept to demo. Compile-first: every Compact contract is validated via
the Midnight MCP (skipZk) before it is written to a `.compact` file, then compiled locally.*

---

## Phase 0 — Design (mostly complete, 2026-07-06)

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
- [x] Honest coverage-scope doc: what wallet insurance IS and IS NOT responsible for
- [x] demoLand frontend (Vite + React + Tailwind, 9 pages, 9 mock providers)
- [x] Contract design stubs (PremiumPool, PolicyRegistry, EduCertifier, ClaimEngine)
- [x] demoLand vs realDeal convention doc
- [x] New client onboarding template (5-step DIDz → coverage → EDU → agent → confirm)
- [x] AI integration plan (3-phase: rule-based → LLM → conversational)
- [ ] Honest coverage-scope doc: what wallet insurance IS and IS NOT responsible for (detailed scope text)

## Phase 1 — Core contracts (design stubs done → validate + write .compact)

- [x] `PremiumPool` — design stub (6 circuits: deposit_premium, deposit_lp, authorize_payout, release_payout, deny_payout, withdraw_lp)
- [x] `PolicyRegistry` — design stub (5 circuits: buy_policy, activate_policy, lapse_policy, get_policy_status, verify_policy_for_claim)
- [x] Underwriting circuit design — DIDz `prove_score_at_least` consumed by buy_policy
- [x] Tier enforcement design — cap ladder, EDU-required gate for tiers ≥ $5k, score-scaled agent ceiling
- [ ] Validate all stubs via Midnight MCP (`midnight-compile-contract` skipZk)
- [ ] Write `.compact` files after validation
- [ ] Local `compact compile` with full ZK key generation

## Phase 2 — CryptoSure-EDU

- [x] `EduCertifier` — design stub (5 circuits: issue_cert, verify_cert, verify_cert_for_scope, revoke_cert, list_modules)
- [x] EDU issuer approval design — via DIDz `TrustedIssuerRegistry` (domain = "CRYPTOSURE-EDU")
- [x] Cert attestation design — DIDz `attest_to_did` + scope-hash binding
- [x] Holder-signed activation proof design — non-delegable, ZK-verified
- [x] Non-delegable boundary documented — agent/AI cannot sign EDU acceptance
- [ ] Validate EduCertifier stub via Midnight MCP
- [ ] Write `.compact` file after validation
- [ ] Premium discount for certified low-tier holders

## Phase 3 — Claims & payout

- [x] `ClaimEngine` — design stub (7 circuits: submit_claim, assign_adjuster, submit_forensic_report, approve_claim, deny_claim, confirm_payout, dispute_claim)
- [x] Anti-double-claim nullifier design — SCIFz pattern, `hash(holder, policy, event, loss_id)`
- [x] Selective disclosure design — adjuster-only, ZK-verified
- [x] Escrow-style payout design — PremiumPool.authorize_payout → release_payout
- [x] Dispute window design — time-windowed re-opening of denied claims
- [x] Forensic report integration design — report hash anchored on-chain, ZKSplunk attests
- [ ] Validate ClaimEngine stub via Midnight MCP
- [ ] Write `.compact` file after validation

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

- [x] demoLand frontend (Vite + React + Tailwind, amber DEMO MODE banner, 7-auth standard)
- [x] 9 pages: Login, Signup, Dashboard, Onboarding, Policies, Claims, EDU, Pool, AI Assistant
- [x] 9 mock providers: auth, creditScore, policies, claims, edu, pool, didz, agenticDID, ai
- [x] DIDz + AgenticDID placeholder integration with TODO markers
- [x] demoLand vs realDeal convention doc
- [ ] realDeal: local Midnight stack → pre-prod (skip preview per house convention)
