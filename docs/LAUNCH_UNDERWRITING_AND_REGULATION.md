# CryptoSure Launch Underwriting and Regulation Deep Dive

**Date:** July 20, 2026
**Working scope:** United States launch, with initial wallet coverage limits of
**$500, $1,000, $5,000, and $10,000**.

> This is a product and regulatory strategy memo, not legal, actuarial, tax, or
> insurance advice. A licensed insurance regulatory attorney, actuary, carrier,
> and producer must approve the final structure, policy forms, rates, marketing,
> and launch states.

## Executive conclusion

Crypto wallets are insurable. In several respects they are unusually attractive
insurance objects: ownership can be cryptographically attested, value can be
timestamped, transfers are immutable, loss events can be monitored continuously,
and stolen assets can sometimes be traced, frozen, and recovered.

Those strengths do not make recovery or payment a sure thing. Crypto losses can
move globally in minutes, cross bridges, enter mixers or informal markets, and
become expensive to pursue. The hardest claims question is often not whether a
transfer occurred, but whether it was genuinely unauthorized, whether the holder
still controls the keys, and whether an exclusion or security condition applies.

The strongest launch model is therefore:

1. CryptoSure operates as the protocol, product, evidence, and program layer.
2. A licensed carrier or Lloyd's-backed insurer bears the regulated insurance risk.
3. A licensed producer or surplus-lines broker distributes the coverage.
4. CryptoSure does not custody customer assets or represent an on-chain pool as a
   substitute for a carrier's legally required reserves.
5. The first policy covers one or two tightly defined, provable events and excludes
   voluntary transfers, market losses, and third-party protocol failures.

### Carrier-backed, in plain English

The licensed carrier is the insurance company legally standing behind the policy. It
holds regulated reserves, accepts the insurance risk, and pays valid covered claims.
CryptoSure supplies the specialized wallet product, security controls, customer
experience, evidence workflow, and recovery coordination. See the
[`PLAIN_ENGLISH_INSURANCE_ROLES.md`](PLAIN_ENGLISH_INSURANCE_ROLES.md) guide.

For Pennsylvania regulatory classification, use the repository's authoritative external
source record for [Keystone Smart Launch](../ref-docs/PA_KEYSTONE_SMART_LAUNCH.md).

## Why the diamond comparison is directionally right

Diamonds are insured through proof of ownership, appraisal, specified perils,
storage requirements, deductibles, exclusions, and claims investigation. A wallet
can use the same insurance logic with stronger telemetry.

| Insurance question | Diamond | Crypto wallet |
|---|---|---|
| Ownership | Receipt, appraisal, photographs | Signed wallet-ownership proof and DIDz credential |
| Value | Periodic appraisal | Named oracle and timestamped on-chain balance |
| Security controls | Safe, alarm, location | Hardware wallet, multisig, recovery plan, approvals hygiene |
| Loss evidence | Police report, physical investigation | Transaction graph, device evidence, chain analytics, police report |
| Recovery | Pawn shops, resale networks, law enforcement | Exchange freeze, seizure, tracing, legal process |
| Main weakness | Object can disappear without a trace | Bearer asset can move globally and irreversibly in minutes |

The better claim is not that crypto is risk-free. It is that crypto can produce a
more measurable and auditable insurance process than many physical assets.

## Recommended v1 coverage

### Cover at launch

1. **Verified unauthorized wallet compromise**
   - Funds leave the insured address without the policyholder intentionally
     initiating or approving the transfer.
   - The wallet was enrolled and seasoned before the event.
   - The event passes wallet ownership, transaction, device, sanctions, and fraud
     review.
2. **Certified device theft or destruction**, considered only after carrier review
   - The insured device and required backup become inaccessible through a documented
     external event.
   - A police, fire, or equivalent official report is required.
   - The holder proves that the approved recovery plan was followed and failed.

### Exclude at launch

- Voluntary transfers to scammers or fake support agents.
- Malicious token approvals and blind signatures unless a later rider explicitly
  covers them.
- Forgotten seed phrases without a qualifying external loss event.
- Market losses, depegs, rug pulls, and investment losses.
- Third-party protocol, bridge, exchange, or custodian failure.
- Known vulnerabilities ignored after notification.
- Illegal or sanctioned activity.
- Losses occurring before policy inception or during the seasoning period.

This narrow scope is a feature. It lets CryptoSure gather credible frequency,
severity, fraud, and recovery data before widening the promise.

## Proposed opening tiers

The pricing below is a **hypothesis for carrier conversations**, not a quote or
actuarially approved rate. It intentionally includes deductibles and meaningful
security controls.

| Limit | Illustrative annual price | Illustrative monthly price | Deductible | Minimum controls |
|---:|---:|---:|---:|---|
| $500 | $49 | $4.99 | $50 | Wallet ownership proof, 30-day seasoning, basic CryptoSure-EDU, address monitoring |
| $1,000 | $79 | $7.99 | $100 | All $500 controls plus stronger device and recovery attestation |
| $5,000 | $299 | $29.99 | $250 | Hardware wallet, signed EDU certification, approved recovery plan, continuous monitoring |
| $10,000 | $549 | $54.99 | $500 | All $5,000 controls plus multisig or equivalent recovery control and enhanced review |

The percentage rate declines as the limit rises because customer acquisition,
policy administration, support, monitoring, and claims intake create fixed costs.
The small tiers should therefore include visible non-insurance value, such as
wallet monitoring, security alerts, education, and recovery coordination.

### Illustrative portfolio economics

Assume 10,000 policies with this early mix:

- 45% at $500
- 35% at $1,000
- 15% at $5,000
- 5% at $10,000

The result is approximately:

- **$18.25 million** total policy limit exposure
- **$1.22 million** annual written premium using the illustrative prices
- **$122** average annual premium per policy
- **6.7%** blended premium-to-limit rate

A launch program might target a 45% to 55% ultimate loss ratio while reserving the
remaining premium for acquisition, administration, monitoring, claims handling,
taxes and fees, reinsurance or capital cost, contingency, and margin. That target
must be tested against real claims data.

### A simple loss-cost framework

For each security cohort:

```text
expected loss cost
  = claim frequency
  × average paid severity as a percentage of limit
  × (1 - realized recovery percentage)
```

Example only: a 4% annual claim frequency, 75% average severity, and 5% realized
recovery produces a 2.85% net loss cost before expenses, fraud leakage, capital,
taxes, and profit.

Recovery should not be over-credited in pricing. A $500 claim cannot economically
support a bespoke forensic investigation and international legal process. Recovery
becomes more useful when automated tracing finds funds at a cooperative exchange,
when several claims share one attack, or when losses reach the $5,000 and $10,000
tiers.

## Initial underwriting and capacity targets

### 1. Evertas and its carrier relationships

**Best first conversation.** Evertas currently describes itself as a crypto-native
underwriter and Lloyd's coverholder. It offers crime theft/loss and digital property
coverage, and identifies Arch Insurance as a backer of its crypto policies. The
conversation should be about a carrier-backed embedded program, underwriting
authority, policy wording, reinsurance, and loss-data design.

### 2. Arch through the Evertas/Lloyd's channel

Arch is the regulated risk-bearing relationship behind Evertas's Lloyd's program.
CryptoSure should not approach this as “fund our pool.” The proposition is a tightly
controlled, carrier-fronted program with differentiated evidence, prevention, and
claims economics.

### 3. Lloyd's syndicates through a specialist broker

Lloyd's published a 2020 wallet-insurance precedent created by Atrium with Coincover,
with additional backing from Tokio Marine Kiln and Markel. The product started at a
limit as low as GBP 1,000. That is strong market evidence for the concept, although
current appetite and personnel must be re-confirmed through a licensed specialist
broker.

### 4. Relm Insurance

Relm is a Bermuda-regulated specialty insurer focused on crypto, digital assets, and
Web3. It is a credible candidate for program capacity, reinsurance, or an offshore
institutional pilot. Its suitability for direct U.S. consumer limits requires legal,
licensing, and distribution review.

### 5. Chainproof

Chainproof describes itself as a Bermuda-regulated digital-asset insurer with crime,
custody, slashing, and DeFi deposit products. Its present positioning is institutional,
so the strongest opening may be reinsurance, portfolio analytics, or capacity design
rather than a direct retail program.

### Important role distinction

- **Carrier or Lloyd's syndicate:** bears the regulated insurance risk.
- **Coverholder or MGA:** may have delegated underwriting authority.
- **Broker or producer:** places and sells the policy.
- **Coincover or another protection platform:** technology, monitoring, recovery,
  or distribution partner, not necessarily the risk-bearing insurer.
- **CryptoSure:** protocol, product, privacy, evidence, policy administration, and
  partner orchestration layer, subject to the licenses its activities require.

## United States regulatory map

### State insurance regulation is the center of gravity

Insurance remains state-regulated. A carrier needs authority for the applicable
property and casualty line, and producers, surplus-lines brokers, MGAs, TPAs, and
adjusters may each require licenses. Policy forms, rates, marketing, cancellations,
renewals, claims handling, complaint procedures, taxes, and solvency rules depend on
the state and product classification.

### Admitted versus surplus lines

**Admitted route:** stronger consumer protection and access to state guaranty-fund
protection, but typically requires state rate and form review. Pennsylvania makes
approved rate and form filings publicly searchable through SERFF.

**Surplus-lines route:** the most plausible first home for a novel risk with little
credible loss history. NAIC describes surplus lines as the market for specialized,
innovative risks that are not available in the admitted market. The transaction must
flow through a licensed surplus-lines broker, state eligibility and tax rules apply,
and guaranty-fund protection generally does not.

For $49 and $79 retail premiums, broker and compliance costs can overwhelm the
economics. This is why an embedded B2B2C master-policy or affinity program may be more
practical than selling one small policy at a time.

### West Virginia sandbox warning

West Virginia's insurance innovation statute currently says applications had to be
submitted on or before **December 31, 2025**. The sandbox also could not waive carrier
licensing, solvency, guaranty-fund, tax, or fee requirements. CryptoSure should not
base its launch plan on that sandbox unless the Insurance Commissioner confirms a new
or extended application authority.

### Vermont captive warning

Vermont remains a sophisticated captive domicile, but a pure captive generally
insures its parent and affiliates, not an open retail customer population. A sponsored
cell, agency captive, or reinsurance captive could eventually retain a measured slice
of CryptoSure risk after a licensed fronting carrier issues the consumer policies.
A captive is a later capital-efficiency tool, not a shortcut around insurance law.

### Federal overlays

1. **OFAC and sanctions:** insurance participants must screen relevant parties through
   the policy lifecycle. Policies should contain a sanctions limitation, and screening
   should occur at issuance, renewal, claim, and payment.
2. **AML and money transmission:** if CryptoSure receives, holds, converts, or transmits
   customer crypto, federal and state money-services analysis is required. The safer
   first architecture keeps customer assets with regulated payment and custody partners.
3. **Securities:** a token that gives passive investors a claim on premium income,
   underwriting profit, or reserve-pool yield may be a security. The SEC's 2026 guidance
   makes clear that putting a financial instrument on a crypto network does not change
   whether it is a security. Do not launch a retail “LP token” without securities counsel
   and a compliant offering and transfer structure.
4. **Tax:** the IRS treats digital assets as property. Crypto-denominated premiums,
   claim payments, conversions, and LP transactions may create reporting and taxable
   disposition issues.
5. **Privacy and underwriting fairness:** zero-knowledge proofs reduce data exposure,
   but risk factors must remain explainable, actuarily supportable, and compliant with
   unfair-discrimination rules. “Private” cannot mean unreviewable.

## Recommended launch sequence

### Phase 0: carrier discovery and evidence prototype

- No live insurance and no customer premiums.
- Demonstrate wallet enrollment, DIDz selective disclosure, scope hashing, monitoring,
  claim evidence packaging, sanctions checks, and simulated payout flow.
- Obtain carrier, broker, actuary, claims, and insurance counsel feedback before
  freezing product wording.

### Phase 1: one-state or one-partner embedded pilot

- Carrier-backed B2B2C or affinity structure.
- Start with $500 and $1,000 limits.
- Cover verified unauthorized key compromise only.
- Require a 30-day seasoning period, $50 or $100 deductible, basic EDU, monitoring,
  rapid reporting, and named chain-analytics review.
- Cap policies per customer, address, household, device, and incident cluster.

### Phase 2: hardened tiers

- Add $5,000 and $10,000 after the first credible exposure and claims data.
- Require hardware wallets, signed EDU scope acceptance, approved recovery plans,
  higher deductibles, enhanced device controls, and manual underwriting where needed.
- Add incident aggregation limits and reinsurance for correlated attacks.

### Phase 3: delegated program and retained risk

- Seek MGA or coverholder authority only after carrier confidence and operational proof.
- Consider a Vermont sponsored cell, agency captive, or Bermuda reinsurance structure
  to retain a small, capped layer of risk.
- Keep customer-facing policies backed by a licensed carrier.

## The “Sure thing” brand promise

**“Where crypto protection is a Sure thing!”** is memorable, but in regulated insurance
marketing it can sound like a guaranteed payout. The safer interpretation is:

- Sure about what is covered.
- Sure about what is excluded.
- Sure that the policy version cannot quietly change.
- Sure that reserves and status are auditable.
- Sure that a claim follows a defined, reviewable process.

Suggested supporting disclosure:

> “Sure” describes CryptoSure's commitment to clear terms, verifiable evidence, and
> transparent process. Coverage and claim payment remain subject to the issued policy,
> exclusions, limits, deductibles, underwriting, and applicable law.

## Principal risks to solve before launch

1. **Adverse selection:** people buy only after a wallet or device begins showing signs
   of compromise.
2. **Moral hazard:** the holder secretly transfers funds and reports theft.
3. **Correlated loss:** one wallet library or firmware vulnerability affects thousands
   of insured addresses at once.
4. **Security drift:** a wallet is safe at enrollment and unsafe six months later.
5. **Valuation dispute:** token price changes between loss, report, investigation, and
   payment.
6. **Recovery optimism:** traced funds are not the same as legally recoverable funds.
7. **Privacy versus compliance:** the protocol must minimize disclosure without blocking
   required identity, sanctions, fraud, adjuster, and legal checks.
8. **Retail unit economics:** support and compliance can cost more than the expected
   loss on a $500 policy.
9. **Pool tokenization:** turning underwriting participation into a liquid token can add
   securities, broker-dealer, custody, tax, and market-conduct obligations.
10. **Marketing language:** “insured,” “guaranteed,” and “sure thing” require carrier and
    regulatory review before public launch.

## Source links

- NAIC, Surplus Lines overview: <https://content.naic.org/insurance-topics/surplus-lines>
- NAIC, Federal Insurance Office overview: <https://content.naic.org/insurance-topics/federal-insurance-office>
- Pennsylvania Insurance Department, rate and form filing search: <https://www.pa.gov/agencies/insurance/posted-filings-reports-company-orders/product-and-rate-filings/insurance-company-filings-search.html>
- West Virginia Code, Insurance Innovation application: <https://code.wvlegislature.gov/33-60-2/>
- Vermont captive licensing statute, 8 V.S.A. section 6002: <https://legislature.vt.gov/statutes/section/08/141/06002>
- OFAC, Compliance for the Insurance Industry: <https://ofac.treasury.gov/faqs/topic/1616>
- SEC, Statement on Tokenized Securities, January 28, 2026: <https://www.sec.gov/newsroom/speeches-statements/corp-fin-statement-tokenized-securities-012826-statement-tokenized-securities>
- IRS, Digital assets: <https://www.irs.gov/filing/digital-assets>
- FBI IC3, 2025 Annual Report: <https://www.ic3.gov/AnnualReport/Reports/2025_IC3Report.pdf>
- U.S. Department of Justice, 2025 cryptocurrency seizure and victim-fund return statistics: <https://www.justice.gov/opa/pr/justice-department-announces-seizure-over-28-million-cryptocurrency-cash-and-other-assets>
- Evertas: <https://evertas.com/>
- Lloyd's, Coincover wallet insurance precedent: <https://www.lloyds.com/insights/media-centre/press-releases/lloyds-launches-new-cryptocurrency-wallet-insurance-solution-for-coincover>
- Relm Insurance: <https://relminsurance.com/>
- Chainproof: <https://www.chainproof.co/>
