# CryptoSure Product Application

This directory contains one CryptoSure product user interface with two provider
configurations. It is not a DemoLand-only interface and it must never grow a
separate RealDeal page tree.

## One user interface, two evidence environments

DemoLand uses the routes, layouts, components, and interactions that the final
product is expected to use. Its provider implementations return placeholders,
mock data, and simulated evidence. DemoLand must not create external effects.

RealDeal uses the same routes, layouts, components, and interactions. Its
provider implementations connect the shared contracts to approved test
application programming interfaces, sandbox services, deployed contracts, and
real infrastructure.

RealDeal does not automatically mean production insurance, mainnet, live money,
regulatory approval, or guaranteed coverage. Every provider must state whether
its evidence is simulated, local, sandbox, test-network, or production.

## Provider boundary

`src/providers/types.ts` defines the contracts used by the user interface.
`src/providers/context.tsx` is the only mode-selection point.

- `src/providers/demoland/` implements the contracts with placeholders and mocks.
- `src/providers/realdeal/` implements the same contracts with approved external
  test services and infrastructure.
- `src/fixtures/cryptosure-insurance-lab.v1.json` contains deterministic,
  truth-labelled fictional records for risk, policy, claim, and reserve testing.
- `src/pages/`, `src/layouts/`, and `src/components/` must not import either
  provider implementation directly.

The architecture test in `tests/mode-parity.test.mjs` enforces this boundary.
The fixture tests in `tests/insurance-lab.test.mjs` enforce synthetic provenance,
referential integrity, numerical bounds, and RealDeal fail-closed behavior.

The `/lab` route provides an underwriting and portfolio stress laboratory. Its
Lloyd's adapter is a deliberately unconfigured interface boundary, not a live
integration or endorsement. See `../docs/SYNTHETIC_INSURANCE_LAB.md`.

## Commands

```bash
npm install
npm run dev:demo
npm run dev:real
npm run verify:mode-parity
```

The RealDeal development command is expected to fail closed when required test
services are not configured. Do not replace those failures with fabricated
success data.
