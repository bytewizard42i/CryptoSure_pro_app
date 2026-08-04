# CryptoSure — Coverage Tiers & Scope

**Date**: July 6, 2026
**Status**: Design

This is the honest, specific scope document. In the contract, a *version* of this text is
hashed (`scopeHash`) and bound into every policy. The policyholder accepts a specific
version; disputes reference the exact version they signed.

---

## Part A — Crypto wallet insurance (`CryptoSure.app`)

### A.1 The tier ladder

| Tier | Coverage limit | EDU requirement | Activation |
|------|---------------|-----------------|-----------|
| T0 | **$500** | Suggested (discount if certified) | Immediate on purchase |
| T1 | **$1,000** | Suggested (discount if certified) | Immediate on purchase |
| T2 | **$5,000** | **Required** | Holder-signed EDU cert → activate |
| T3 | **$10,000** | **Required** | Holder-signed EDU cert → activate |
| T4 | **$25,000** | **Required** (advanced module) | Holder-signed EDU cert → activate |
| T5 | **$50,000** | **Required** (advanced module + optional KYCz) | Holder-signed EDU cert → activate |

- **Max tier available** to a given holder is capped by their **DIDz credit score band**
  (see `DIDZ_CREDIT_SCORE.md`). A low score may cap a holder at, say, T1 regardless of
  willingness to pay.
- **Premium** scales with tier, score band, and EDU status. Certification lowers premium
  at every tier (and is mandatory to even reach T2+).

### A.2 What IS covered (the covered event set)

Coverage applies **only** to these defined loss events, and only within the accepted scope
version:

1. **Verified theft of keys via a covered vector** — e.g. a proven compromise of a
   *certified-configured* hardware wallet, where the holder followed the EDU-taught setup.
2. **Custodial/bridge failure riders** (optional add-on) — loss due to a named, covered
   custodian or bridge failing, if that rider was purchased and the counterparty is on the
   covered list.
3. **Covered device loss/destruction** affecting an insured hot-wallet balance up to the
   tier limit, where hygiene requirements were met.
4. **Inheritance/recovery failure** where the holder used the CryptoSure-taught recovery
   plan and it failed through no fault of the holder (narrow, evidence-based).

The exact covered vectors are enumerated per scope version. New vectors are added by new
scope versions (holders re-accept to gain new coverage).

### A.3 What is NOT covered (read this twice)

CryptoSure will **not** pay for:

- **Voluntary transfers.** You sent funds to a scammer, "investment," romance scam, fake
  support, or any address you approved. Authorizing a transfer is not a covered loss.
- **Malicious approvals / drainers you signed** after being taught to recognize them in
  the phishing/approval module. Signing `setApprovalForAll` to a drainer is on you.
- **Forgotten/lost seed phrases** where you declined the recovery plan, or never set one up.
- **Third-party smart-contract / dApp exploits** (a DeFi protocol you used got hacked)
  unless a specific covered-protocol rider was purchased.
- **Market losses.** Price went down. Depeg. Rug of a token you bought. Not insurable here.
- **Sanctioned / illegal activity**, or claims from wallets on a denylist (OFAC-style,
  reusing the CareToCoin screening design).
- **Non-covered custodians/bridges** not on the rider's named list.
- **Negligence contradicting your signed EDU cert** — if you certified you'd use a hardware
  wallet for the insured balance and you kept it all in a browser hot wallet, that's a
  scope violation.

> The narrowness is the point. Honest crypto insurance covers a **small, provable** set of
> events, not "I lost money somehow."

### A.4 Wallet-hygiene requirements (bound to the policy)

For T2+ the holder attests (via the signed EDU cert) to maintaining, e.g.:
- Hardware wallet for the insured balance above a stated hot-wallet float.
- A recovery plan (seed custody / m-of-n / social recovery) on file as a commitment.
- Periodic approval hygiene (revoking stale token approvals).
Failing a requirement that a claim depends on can void that claim (scope violation).

---

## Part B — Everyday insurance (`CryptoSure.pro`)

### B.1 What it covers

Ordinary real-world items and risks, underwritten with ZK proofs. Examples:

- **Devices & gadgets**: phones, laptops, tablets, cameras, drones, game consoles.
- **Mobility**: bikes, e-bikes, scooters (theft/damage).
- **Instruments & tools**: guitars, keyboards, power tools, pro/AV gear.
- **Small valuables**: watches, small jewelry (below an appraisal threshold).
- **Situational**: rental-deposit protection, ticketed-event protection, short-term
  gear rental cover.

### B.2 The insured object = an RWAz entry

Where possible, the insured item is a **RWAz registry entry** (a real-world asset already
committed on-chain). This gives underwriting a privacy-preserving handle on:
- asset **type** (risk class), **age**, and **appraised value band** (the coverage cap),
- **ownership** (the holder controls the RWA entry — proven, not revealed).

The owner's **DIDz credit score** plus the asset's **appraised value band** set the
insurable cap (see `DIDZ_CREDIT_SCORE.md` §RWAz).

### B.3 What everyday coverage does NOT do

- No health/life/auto/home (regulated lines needing licensed carriers — out of scope for
  the protocol MVP; a licensed-partner path is future work).
- No coverage above the asset's appraised value band.
- Same exclusions philosophy: intentional loss, fraud, and undisclosed material facts void
  cover.

### B.4 Honesty & legal note

CryptoSure is a **protocol and screening/attestation aid**, not a licensed insurer or legal
advice. Any real-money deployment (especially regulated lines) requires compliance review
and likely a licensed carrier / MGA partner and reinsurance for the pool. demoLand uses
simulated pools and claims; realDeal wiring is future, partner-dependent work.

---

## Part C — How tier, score, and EDU interact (quick table)

| Holder situation | Max tier | EDU | Premium effect |
|------------------|---------|-----|----------------|
| High score, certified | up to T5 (+KYCz for T5) | done | lowest multiplier |
| High score, not certified | capped at T1 | suggested | no discount; can't reach T2+ |
| Mid score, certified | up to T3 | done | mid multiplier |
| Low score, certified | capped at T1 | suggested | higher multiplier |
| Denylisted wallet | none | — | ineligible |
