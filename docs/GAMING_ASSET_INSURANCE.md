# CryptoSure — Gaming Asset Insurance Pilot

> **A less-regulated entry point: insuring in-game digital assets against accidental loss.**

---

## Why Gaming Assets?

John's insight: just as the **equine protocol** served as a less-regulated pilot
for SafeHealthData, gaming asset insurance can serve as a less-regulated pilot
for CryptoSure's core model.

Gaming assets are an ideal pilot because:

1. **Lower regulatory burden** — in-game items may be structured as service
   contracts or warranties rather than traditional insurance
2. **Clear ownership** — game platforms track item ownership in databases or
   on-chain
3. **Defined value** — marketplace prices provide objective valuation data
4. **Engaged demographic** — gamers are crypto-curious, comfortable with
   digital assets, and underserved by traditional insurance
5. **Large market** — Counter-Strike skins alone are a $4B+ market (per NY AG
   lawsuit vs. Valve, 2025); global in-game item markets are estimated at
   $50B+
6. **Testable risk model** — accidental loss (deleted accounts, platform
   shutdowns, item duping/rollback events) is well-defined and verifiable

---

## What We Insure

### Covered events (accidental loss)

| Event | Description | Verification method |
|-------|-------------|-------------------|
| **Account deletion / lockout** | Player loses access to their game account (not ban-related) | Platform API confirmation |
| **Platform shutdown** | Game server closes, items become inaccessible | Public announcement + server status |
| **Item rollback / duping event** | Platform rolls back transactions due to a bug or exploit, destroying legitimate items | Platform incident report |
| **Accidental item destruction** | In-game mechanic destroys an item by accident (e.g., misclick in a destruction/sacrifice UI) | Game log verification |
| **Theft via account compromise** | Hacker gains account access and transfers/deletes items | Platform log + forensic confirmation |
| **Smart contract failure** (on-chain items) | Blockchain-based item contract has a bug that locks or destroys items | On-chain evidence |

### NOT covered

| Exclusion | Reason |
|-----------|--------|
| **Intentional item destruction** | Player chose to destroy the item (game mechanic, not accident) |
| **Ban / suspension** | Platform banned the player for TOS violation |
| **Market value decline** | Item becomes less valuable over time — this is not loss, it's depreciation |
| **Item duping by the insured** | Player exploited a bug to duplicate items — fraud |
| **Rust/ban waves** | Anti-cheat enforcement actions |
| **Pre-existing conditions** | Items already compromised before policy activation |

---

## Regulatory Strategy: Service Contract vs. Insurance

### The key distinction

Most states regulate **insurance** heavily (licensing, capital requirements,
rate filing, guaranty fund participation). **Service contracts** and
**warranties** face much lighter regulation — often just registration and
bonding requirements.

A service contract is an agreement to repair, replace, or indemnify a product
for operational or structural failure. If we structure gaming asset coverage
as a **service contract** (we will restore or replace the item, or pay
equivalent value if restoration is impossible), we may avoid insurance
licensing in many states.

### State service contract regulation (summary)

| State | Service contract regulation | Insurance license required? |
|-------|---------------------------|---------------------------|
| **PA** | Service Contract Act — registration + bonding | Likely no, if structured properly |
| **WV** | Service Contract Regulation — registration required | Likely no |
| **OH** | Service contract registration with DOI | Likely no |
| **DE** | Limited regulation | Likely no |
| **NJ** | Service contract registration | Likely no |
| **NY** | Heavily regulated — may treat as insurance | Possibly yes |
| **MD** | Service contract registration | Likely no |

**Action item**: Engage counsel in each target state to confirm the service
contract structure. This is the single most important legal opinion for the
gaming pilot.

### Why this matters for CryptoSure

If the gaming pilot works as a service contract, we can:
- Launch **without** forming a captive insurer
- Launch **without** applying for the WV sandbox
- Test the ZK-proof-based claims verification with real users
- Build a track record and claims history
- Use that track record to support the full insurance licensing process later

---

## How It Works

### Policy lifecycle

```
1. ENROLLMENT
   Player links game account → CryptoSure verifies item ownership
   → Player selects items to insure → Premium calculated based on:
     - Item marketplace value (oracle feed)
     - Player's DIDz credit score (if available)
     - Item type / game platform risk profile

2. ACTIVATION
   Premium paid → Policy committed on Midnight (shielded)
   → Item ownership proof bound to policy
   → Coverage active

3. CLAIM
   Player reports loss → ZK proof submitted:
     - Proof of ownership at policy activation
     - Proof of loss event (platform API data, game logs, on-chain evidence)
     - Proof item is no longer accessible/owned
   → Adjuster reviews (selective disclosure)
   → If approved: payout from pool or item replacement

4. RECOVERY (if theft)
   If loss was due to theft → forensic recovery partner engaged
   → Traced funds/items recovered → returned to pool
   → Player keeps payout; pool is made whole
```

### Parametric option

For certain loss types (platform shutdown, rollback events), we can use a
**parametric trigger**: if a specific on-chain or platform event occurs, all
affected policies auto-pay without individual claim filing. This is faster,
cheaper, and more transparent.

Example: "If GamePlatform X announces server shutdown, all policies for items
on that platform auto-pay at declared value within 7 days."

---

## Tiers & Pricing

| Tier | Coverage limit | Target items | Premium estimate |
|------|---------------|-------------|-----------------|
| **Casual** | $100 | Low-value skins, common items | $2–5/month |
| **Enthusiast** | $500 | Mid-tier skins, rare items | $5–15/month |
| **Collector** | $5,000 | High-value skins, rare collectibles | $15–50/month |
| **Whale** | $25,000 | Blue-chip items, full inventories | $50–200/month |

Pricing is indicative. Actual premiums will be data-driven from:
- Item volatility (marketplace price history)
- Platform risk (history of shutdowns, hacks, rollbacks)
- Player's DIDz credit score (if available — lower score = higher premium)
- Claims history (no-claims discount)

---

## Gaming-Specific EDU Module

CryptoSure-EDU for gaming assets is lighter than the wallet hygiene curriculum:

| Module | Content | Required for |
|--------|---------|-------------|
| **Account security basics** | 2FA, strong passwords, don't share credentials | All tiers |
| **Phishing awareness** | Fake login pages, trade scams, API key scams | All tiers |
| **Item custody** | How to verify item ownership, trade safely, avoid scam trades | Enthusiast+ |
| **Platform risk awareness** | Understanding that game platforms can shut down, roll back, or ban | Collector+ |
| **What is and isn't covered** | The scope document — what you're buying and what you're not | All tiers (must sign) |

The gaming EDU cert is issued as a DIDz attestation (same mechanism as the
wallet EDU cert, different domain: `hash("CRYPTOSURE-GAMING-EDU")`).

---

## Target Platforms (initial)

| Platform | Asset type | Why | Regulatory note |
|----------|-----------|-----|-----------------|
| **Steam / CS2** | Skins, cases | Largest market ($4B+), well-defined item IDs | Valve API access needed |
| **Roblox** | Limiteds, game passes | Huge younger demographic, parent-friendly insurance angle | COPPA considerations |
| **Ethereum-based games** | On-chain items (NFTs) | Native on-chain verification, perfect for ZK claims | Smart contract evidence |
| **World of Warcraft** | Characters, items | Long account history, clear ownership tracking | Blizzard API access |

---

## Pilot Deployment Plan

### Phase G1 — Design (current)

- [x] Define covered/not-covered events
- [x] Service contract vs. insurance analysis
- [ ] Legal opinion on service contract structure (target: PA, WV, OH)
- [ ] Platform API access feasibility study
- [ ] Gaming EDU curriculum draft

### Phase G2 — demoLand

- [ ] Simulated gaming asset policies (fake items, simulated loss events)
- [ ] demoLand frontend with gaming-specific UI (item gallery, policy cards)
- [ ] Simulated parametric trigger demo (platform shutdown scenario)
- [ ] Gaming EDU cert demo (interactive quiz, cert issuance)

### Phase G3 — Real pilot (limited)

- [ ] Service contract registration in 2–3 states
- [ ] Partnership with 1 platform for API access
- [ ] Real policies sold (capped at 500 users, $50K total exposure)
- [ ] Claims processed, track record built
- [ ] Forensic recovery partner engaged for theft cases

### Phase G4 — Scale

- [ ] Expand to more platforms and states
- [ ] Transition to full insurance licensing if needed
- [ ] Integrate with CryptoSure's main premium pool
- [ ] Cross-sell to wallet insurance and everyday coverage

---

## Relationship to CryptoSure Core

The gaming pilot is a **subset** of CryptoSure, not a separate product:

- Same **premium pool** (or a dedicated sub-pool for the pilot)
- Same **policy registry** (with `policy_type = "gaming"`)
- Same **claim engine** (with gaming-specific loss verification circuits)
- Same **DIDz credit score** integration (if player has a DIDz)
- Same **EDU certifier** (with gaming-specific curriculum)
- Same **forensic recovery** pipeline (for theft cases)

The gaming pilot validates the core CryptoSure model in a lower-risk,
lower-regulation environment before tackling full insurance licensing.

---

## Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| Platform changes API terms | Diversify across platforms; contract with platform directly |
| Item value manipulation | Use time-weighted average price (TWAP) from multiple marketplaces |
| Fraudulent claims | Game log verification + forensic review + DIDz credit score |
| Regulatory reclassification | Legal opinion upfront; maintain service contract structure; be prepared to pivot to insurance licensing |
| Platform shutdown (we insured items on a dead game) | Parametric trigger auto-pays; this is a covered event, not a risk to us |
| Young user demographic | Parent/guardian involvement for minors; COPPA compliance; age verification via DIDz |

---

## Sources & References

- NY AG lawsuit vs. Valve (CS2 skins $4B market): https://www.gamespot.com/articles/gamestop-ceo-came-up-with-plan-to-buy-ebay-on-the-toilet-wants-it-to-become-re-seller-of-digital-gaming-items/
- Jorgensen & Company digital asset insurance (covers in-game assets): https://www.jorgensenandcompany.com/digital-asset-insurance
- MyRepublic Geek Insurance (Singapore, collectibles/gaming): https://www.finews.asia/finance/43186-collectors-geeks-gamers-myrepublic-hl-assurance
- Smart contracts in parametric insurance market: https://market.us/report/smart-contracts-in-parametric-insurance-market/
