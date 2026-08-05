# CryptoSure Synthetic Insurance Laboratory

## Purpose

The CryptoSure Synthetic Insurance Laboratory is a deterministic DemoLand
dataset and provider contract for product design, user-interface development,
scenario testing, and future adapter validation.

Every person, organisation, risk, policy, claim, premium, reserve, decision,
and evidence artifact in the dataset is fictional. The dataset is not supplied,
reviewed, sponsored, or endorsed by Lloyd's or any insurer. It is not actuarial
advice and must not be used for production pricing, reserving, compliance, or
capital decisions.

## What version 1 contains

`frontend-demoland/src/fixtures/cryptosure-insurance-lab.v1.json` contains:

- six fictional risk submissions across wallet, everyday, and gaming coverage;
- five fictional policy bordereau records;
- four fictional claim bordereau records with paid, approved, under-review, and
  denied states;
- four monthly reserve snapshots;
- explicit provenance, affiliation, and real-data declarations.

The fixture uses stable identifiers and dates so tests, screenshots, and product
demonstrations can reproduce the same result.

## Dataset guarantees

The automated fixture tests enforce the following properties:

1. The metadata declares that the dataset contains no real people, policies, or
   claims and has no external affiliations.
2. Risk, policy, and claim identifiers are unique.
3. Every policy references a known risk submission.
4. Every claim references a known policy.
5. Financial values are finite and non-negative.
6. Claim amounts stay within their fictional policy limits.
7. Applicant aliases contain neither email addresses nor wallet identifiers.

These checks establish fixture integrity. They do not establish actuarial,
regulatory, legal, security, or production validity.

## Scenario model

The DemoLand provider calculates three deterministic views:

| Scenario | Purpose |
| --- | --- |
| Baseline | Uses the fictional policies, claims, and latest reserve snapshot as written. |
| Wallet theft surge | Adds a fictional cluster of theft losses to expose reserve and concentration pressure. |
| Custodian outage | Adds a fictional correlated custodian event to expose aggregation risk. |

The resulting loss ratio and capital-to-exposure ratio are educational product
signals only. They are not catastrophe modelling, actuarial forecasts, solvency
calculations, or regulatory capital measures.

## Shared provider boundary

The user interface calls `IInsuranceLabProvider` through the same shared
provider context used by the rest of CryptoSure.

```text
Shared Risk Laboratory UI
          |
          v
IInsuranceLabProvider
    |                 |
    v                 v
DemoLand             RealDeal
Synthetic fixture    External adapter seam
Connected            Fails closed until approved
```

DemoLand exposes the synthetic fixture and deterministic scenarios. RealDeal
does not silently substitute DemoLand data. It returns adapter status, then
fails closed when data or scenario methods are called without an approved,
configured external source.

## Lloyd's boundary

The repository contains a named Lloyd's adapter boundary, not a Lloyd's
integration. Its status is `not-configured` and it declares the prerequisites
that must be satisfied before implementation:

- an approved Lloyd's API Platform account;
- an active subscription and subscription key for a specific API product;
- confirmed product terms and permitted uses;
- an agreed field mapping;
- a declared evidence classification;
- approved credential storage and rotation;
- contract tests against an authorised sandbox or test endpoint.

No endpoint, schema, credential, dataset, endorsement, or relationship is
invented. Product-specific documentation must be reviewed when access is
granted because a generic Lloyd's policy-and-claims sandbox is not assumed.

## Safe extension rules

When adding another dataset or carrier adapter:

1. Add provenance and real-data declarations before adding records.
2. Use fictional aliases in public DemoLand fixtures.
3. Keep credentials outside the repository and document environment-variable
   names in an `.env.example` only after an integration is approved.
4. Validate identifiers, references, numerical bounds, and dates.
5. Declare whether each field is synthetic, public, sandbox, test-network,
   partner-provided, or production.
6. Keep the RealDeal provider fail closed when any required evidence is absent.
7. Add provider-contract, fixture-integrity, and mode-parity tests.

## Commands

```bash
cd frontend-demoland
npm run lint
npm run test
npm run verify:mode-parity
```
