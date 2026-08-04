# CryptoSure — Coverage Scope (Detailed)

> **This document IS the scope.** Its hash (`scopeHash`) is bound into every policy.
> The holder signs acceptance of a specific version. Disputes reference the exact
> version signed. New versions add coverage; holders re-sign to gain new coverage.
>
> **Current version:** 1.0.0
> **Effective date:** July 6, 2026
> **Hash:** To be computed on deployment (SHA-256 of canonicalized text)

---

## How to Read This Document

- **"Covered"** means CryptoSure will pay a claim if the event is proven to have occurred
  under the conditions described.
- **"Not covered"** means CryptoSure will not pay, regardless of circumstances.
- **"Conditions"** are requirements the holder must meet for coverage to apply.
- **"Evidence"** is what the holder must provide to prove the loss.

When in doubt, assume it's not covered. The covered set is deliberately narrow and
specific. This is not "I lost money somehow" insurance — it is insurance for a
**defined, provable** set of events.

---

# Part A — Crypto Wallet Insurance (`CryptoSure.app`)

## A.1 Covered Loss Events

Coverage applies **only** to the events in this section, and only when all conditions
in §A.3 are met.

### Event 1: Hardware Wallet Compromise

**What it is:** An attacker extracts keys from a hardware wallet that was configured
according to the EDU-taught setup process.

**Covered when:**
- The insured wallet was a hardware wallet (Ledger, Trezor, GridPlus, or other
  CryptoSure-approved device).
- The device was configured per the EDU "Hardware Wallet Setup" module.
- The compromise was through a **device vulnerability** (e.g., firmware exploit,
  supply-chain attack on the device manufacturer), not through holder action.
- The holder can demonstrate the device was in their possession or properly stored
  at the time of compromise.

**Evidence required:**
- Transaction history showing the unauthorized transfer.
- Hardware wallet device information (model, firmware version).
- A forensic report from a CryptoSure-approved forensic partner (see
  `docs/FORENSIC_RECOVERY.md`) tracing the stolen funds.
- Proof that the EDU hardware wallet setup was completed (EDU cert with
  `hardware_wallet` module).

**Payout limit:** Up to the policy tier limit ($500 – $50,000).

---

### Event 2: Certified Device Loss/Destruction

**What it is:** The device containing an insured hot-wallet balance is lost, stolen,
or destroyed, and the wallet balance cannot be recovered because the seed phrase is
also lost or inaccessible.

**Covered when:**
- The insured balance was on a device that was registered as the insured device
  (via EncryptVault wallet-ownership proof).
- The holder followed the EDU-taught wallet hygiene requirements (§A.3).
- The loss was reported within 72 hours of discovery.
- The holder can prove the device is genuinely inaccessible (police report for
  theft, insurance claim for destruction, or equivalent documentation).
- The seed phrase is genuinely inaccessible (not simply forgotten — see §A.2,
  "Forgotten seed phrases").

**Evidence required:**
- Police report or equivalent official documentation of loss/destruction.
- Transaction history showing the wallet balance at time of loss.
- Proof that recovery was attempted per the EDU-taught recovery plan.
- Forensic partner report confirming funds cannot be recovered.

**Payout limit:** Up to the policy tier limit, minus any recovered funds.

---

### Event 3: Custodial/Bridge Failure (Rider Required)

**What it is:** A named custodian or bridge on the CryptoSure covered list fails,
resulting in loss of the holder's funds held by that custodian or bridged through
that bridge.

**Covered when:**
- The holder purchased the specific custodial/bridge rider for the named entity.
- The custodian/bridge is on the covered list at the time of failure.
- The failure is a **total or partial insolvency, hack, or operational failure**
  — not a voluntary freeze, regulatory action against the holder, or market event.
- The holder's funds were held by the custodian/bridge for less than 180 days
  (prevents buying coverage after known insolvency rumors).

**Evidence required:**
- Proof of deposit with the custodian/bridge.
- Official announcement or public record of the failure.
- Transaction history showing the deposit and the inability to withdraw.

**Payout limit:** Up to the rider's sub-limit, which may be less than the policy
tier limit. See the rider terms for the specific custodian/bridge.

**Covered list (v1.0.0):** To be populated per scope version. The initial covered
list will be empty — riders are a future product. This section exists to define
the terms under which riders will operate.

---

### Event 4: Recovery Plan Failure

**What it is:** The holder used the CryptoSure-taught recovery plan (seed custody,
m-of-n, or social recovery) and the recovery failed through no fault of the holder.

**Covered when:**
- The holder completed the EDU "Recovery Planning" module.
- A recovery plan was on file (committed hash of the plan, not the plan itself).
- The recovery plan was followed correctly.
- The failure was due to an **external factor** (e.g., the custodian holding the
  backup seed went out of business, the social recovery contact became
  incapacitated) — not holder error.
- The holder attempted recovery within 30 days of losing primary access.

**Evidence required:**
- The committed recovery plan hash (proving a plan existed).
- Documentation of the recovery attempt and the external failure.
- Forensic partner report confirming the failure was external.

**Payout limit:** Up to the policy tier limit, minus any partially recovered funds.

---

## A.2 What Is NOT Covered

**Read this section twice.** If something is not listed in §A.1 as covered, it is
not covered. The following are explicit exclusions for clarity.

### Exclusion 1: Voluntary Transfers

You sent funds to a scammer, "investment opportunity," romance scam, fake support
agent, or any address you voluntarily approved. **Authorizing a transfer is not a
covered loss.** CryptoSure covers theft, not fraud-induced voluntary action.

**Examples not covered:**
- Sending ETH to a "support agent" who asked for it
- Investing in a project that turned out to be a rug pull
- Sending funds to a romance scammer
- Paying for a fake NFT listing

### Exclusion 2: Malicious Approvals / Drainers

You signed `setApprovalForAll`, `approve`, or any transaction that gave a smart
contract or address permission to spend your tokens, and that permission was
abused. If you completed the EDU "Phishing & Drainer Awareness" module, you were
taught to recognize and avoid these attacks.

**Examples not covered:**
- Signing a drainer contract that empties your wallet
- Approving a malicious NFT marketplace
- Signing a blind signature request from a phishing site

### Exclusion 3: Forgotten/Lost Seed Phrases

You forgot your seed phrase, lost the paper it was written on, or cannot access
your backup. If you declined the EDU-taught recovery plan, or never set one up,
this is not covered.

**The distinction:** Device loss (Event 2) is covered when the seed is also
inaccessible through no fault of the holder (e.g., both device and backup were
in a house fire). Simply forgetting your seed is not covered.

### Exclusion 4: Third-Party Smart Contract Exploits

A DeFi protocol, dApp, or smart contract you interacted with was hacked, and your
funds were stolen as a result. This is not covered unless you purchased a specific
covered-protocol rider (when available).

**Examples not covered:**
- A lending protocol you deposited into was exploited
- An NFT marketplace you listed on was hacked
- A yield aggregator you used was drained
- A bridge you crossed was exploited (unless bridge rider purchased, Event 3)

### Exclusion 5: Market Losses

Price went down. A token depegged. A project you invested in rugged. A stablecoin
lost its peg. These are market events, not insurable losses under CryptoSure.

**Examples not covered:**
- Token price dropped 90%
- Stablecoin depegged (unless a specific depeg rider exists)
- LP position lost value due to impermanent loss
- NFT floor price collapsed

### Exclusion 6: Sanctioned / Illegal Activity

Claims from wallets on a denylist (OFAC-style screening, reusing the CareToCoin
screening design), or claims arising from illegal activity.

### Exclusion 7: Non-Covered Custodians/Bridges

Funds held by a custodian or bridged through a bridge that is NOT on the covered
list for your rider. The covered list is explicit and version-specific.

### Exclusion 8: EDU Scope Violation

If you certified (via your signed EDU cert) that you would maintain specific
hygiene requirements, and a claim depends on those requirements being met, failing
them voids that claim.

**Examples:**
- You certified you'd use a hardware wallet for balances above your hot-wallet
  float, but kept everything in a browser wallet → claim denied.
- You certified you'd maintain a recovery plan, but never created one → recovery
  failure claim denied.
- You certified you'd periodically revoke stale token approvals, but had 47
  active approvals at time of loss → drainer claim denied (you didn't follow
  the hygiene you signed).

### Exclusion 9: Negligence

Gross negligence that contradicts basic self-custody practices, even if not
explicitly covered by an EDU module. Examples:
- Sharing your seed phrase with anyone, ever, for any reason.
- Entering your seed phrase into a website.
- Storing your seed phrase in plaintext on a cloud service.
- Using a public computer to access your wallet.

### Exclusion 10: Known Vulnerabilities

If you continued to use a wallet, device, or protocol after a known vulnerability
was publicly disclosed and you were notified (via the CryptoSure alert system or
EDU update), claims arising from that known vulnerability are not covered.

---

## A.3 Conditions for All Coverage

Regardless of which covered event applies, the following conditions must be met:

### Condition 1: Active Policy

The policy must be in ACTIVE status at the time of the loss event. Lapsed, expired,
or pending policies do not provide coverage.

### Condition 2: EDU Certification (T2+)

For tiers T2 and above ($5,000+), the holder must have a valid, non-revoked EDU
certification with the required modules for their tier. The certification must
have been valid at the time of the loss event.

### Condition 3: Wallet Hygiene Requirements

For all tiers, the holder must maintain the wallet hygiene practices they certified
to in their EDU acceptance. For T0/T1 (where EDU is suggested but not required),
basic hygiene is assumed (don't share your seed phrase, don't enter it on websites).

### Condition 4: Timely Reporting

Claims must be submitted within 30 days of the holder discovering the loss. Late
claims may be denied at adjuster discretion.

### Condition 5: Cooperation

The holder must cooperate with the adjuster and forensic recovery partner. This
includes:
- Providing requested evidence (§A.1 per event).
- Authorizing the forensic partner to trace stolen funds.
- Not interfering with the recovery process.
- Providing truthful information (false statements void the claim and may
  constitute fraud).

### Condition 6: Subrogation

If CryptoSure pays a claim, the right to recover stolen funds transfers to
CryptoSure (subrogation). The holder assigns this right as a condition of payout.
Recovered funds are split: 80-90% to the pool (offsetting the payout), 10-20% to
the forensic partner (success fee).

---

## A.4 Claims Process Summary

1. **Submit claim** — Holder files a claim via ClaimEngine with a ZK proof of
   the covered event. The anti-double-claim nullifier prevents filing twice for
   the same loss.
2. **Adjuster assignment** — CryptoSure assigns an adjuster who reviews the claim
   with selective disclosure (adjuster sees claim details; public sees only that
   a claim was filed).
3. **Forensic report** — For theft claims, a forensic partner traces the funds
   and submits a report hash (anchored on-chain).
4. **Decision** — Adjuster approves or denies within the dispute window.
5. **Payout** — If approved, PremiumPool authorizes a payout. Holder claims it
   via `release_payout`.
6. **Dispute** — If denied, holder may dispute within the dispute window. A new
   adjuster is assigned.
7. **Recovery** — For theft claims, forensic recovery continues after payout.
   Recovered funds return to the pool.

See `docs/FORENSIC_RECOVERY.md` for the full recovery pipeline.

---

# Part B — Everyday Insurance (`CryptoSure.pro`)

## B.1 Covered Events

Everyday insurance covers **accidental damage, theft, and total loss** of insured
real-world items registered as RWAz entries.

### Covered:
- **Theft** — Stolen from the holder's possession or residence (police report
  required).
- **Accidental damage** — Dropped, crushed, water damage, etc. (photos + repair
  assessment required).
- **Total loss** — Destroyed by fire, natural disaster, or other catastrophic
  event (official documentation required).
- **Loss** — Item is lost and cannot be recovered (police report + 30-day waiting
  period).

### Not covered:
- Normal wear and tear, cosmetic damage, depreciation.
- Intentional damage or fraud.
- Loss arising from illegal activity.
- Coverage above the RWAz appraised value band.
- Health, life, auto, or home insurance (regulated lines requiring licensed
  carriers — future work via partner path).

## B.2 Conditions

- The insured item must be a valid RWAz registry entry.
- The holder must prove ownership of the RWAz entry (off-chain ZK proof).
- The holder's DIDz credit score + the asset's appraised value band set the
  insurable cap.
- Claims require evidence appropriate to the event type (police report, photos,
  repair assessment, etc.).

---

# Part C — Scope Versioning

## C.1 How Scope Changes

This document is versioned. Each version has a unique `scopeHash`. When the scope
changes:
1. A new version is published with an incremented version number.
2. The new `scopeHash` is set in `PolicyRegistry` via `update_scope_version`.
3. Existing policies remain bound to the scope version they signed.
4. New policies are bound to the current scope version.
5. Holders may re-sign to accept a new scope version (gaining new coverage).

## C.2 What Triggers a New Version

- Adding a new covered event.
- Adding a new custodian/bridge to the covered list.
- Clarifying existing language (does not change coverage, but increments version
  for transparency).
- Removing or narrowing coverage (requires holder notification; existing policies
  keep their original scope).

## C.3 Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-07-06 | Initial scope document. Defines covered events 1-4, exclusions 1-10, conditions 1-6. |

---

## Legal Disclaimer

CryptoSure is a **protocol and screening/attestation aid**, not a licensed insurer
or legal advice. This scope document defines the protocol's claim evaluation logic.
Any real-money deployment requires:
- A licensed insurer (VT captive formation planned — see `docs/PILOT_JURISDICTION.md`).
- Regulatory approval (WV sandbox application planned).
- Legal review of this scope document.
- Compliance with applicable insurance regulations in the operating jurisdiction.

The demoLand environment simulates all claims and payouts for demonstration
purposes. No real claims are evaluated or paid under this scope document until
the protocol is deployed with a licensed insurer backing it.
