import type { Providers } from '../types';

// =============================================================================
// realDeal Provider Factory — STUB
// =============================================================================
// This factory creates providers that connect to real Midnight infrastructure.
// It is NOT implemented yet. When ready, each provider will:
//
// auth:         Connect to Midnight wallet (Passport or compatible)
// creditScore:  Call DIDz prove_score_at_least ZK circuit
// policies:     Interact with PolicyRegistry.compact on-chain
// claims:       Interact with ClaimEngine.compact + forensic partner APIs
// edu:          Interact with EduCertifier.compact + DIDz TrustedIssuerRegistry
// pool:         Read PremiumPool.compact state + ZKSplunk telemetry
// didz:         Connect to DIDzRegistry.compact (DIDz.io)
// agenticDID:   Connect to AgenticDID scoped grant system
// ai:           Connect to AI service (see docs/AI_INTEGRATION.md)
//
// Network progression: local → pre-prod (skip preview per house convention)
// =============================================================================

export function createRealProviders(): Providers {
  throw new Error(
    'realDeal providers are not implemented yet. Run in demoLand mode: VITE_CS_MODE=demoland'
  );
}
