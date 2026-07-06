# CryptoSure — Contracts (design-only)

**No `.compact` files yet.** This directory will hold the CryptoSure Compact contracts.
Per DIDzM house convention, every contract is drafted, validated via the Midnight MCP
(`midnight-compile-contract` in `skipZk` mode), then compiled locally with `compact compile`
**before** it is committed here.

Planned contracts (see `../docs/ARCHITECTURE.md`):

| Contract | Role | Key patterns |
|----------|------|--------------|
| `PremiumPool.compact` | Shielded premium pool + payout | Treasury/Pot, Escrow |
| `PolicyRegistry.compact` | Policy commitments + lifecycle + underwriting cap gate | State Machine, Credential Verification, Selective Disclosure |
| `EduCertifier.compact` | CryptoSure-EDU certs + holder-signed activation | TrustedIssuerRegistry consumer, attestation, ZK acceptance proof |
| `ClaimEngine.compact` | Claims + anti-double-claim + payout | Nullifier (SCIFz), Selective Disclosure |

Shared circuit (coordinate in the DIDz repo, not here):
- `prove_score_at_least(...)` — the DIDz credit-score band proof consumed by underwriting.

## Compact house quirks to respect (from monolith-docs/midnight/COMPACT_QUIRKS.md)

- `let` is reserved — all locals are `const` (use ternaries for branching).
- No module-level `const` — inline `pad(32, "…")` in helper circuits.
- No `/` or `%` in circuits — premium multipliers are **lookup tables** keyed by proven band.
- `disclose()` required on witness-derived booleans used in conditionals/asserts.
- `Uint<248>` max width; use `.read()` on Counter, not `.value()`.
- Pragma range: `>= 0.16 && <= 0.23` (verify current compiler at session start).
