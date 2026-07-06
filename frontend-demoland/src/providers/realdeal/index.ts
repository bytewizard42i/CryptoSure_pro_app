import type { Providers } from '../types';
import { createSdkContext, type SdkContext } from '../../sdk/contract-helpers';
import { createRealAuthProvider } from './auth';
import { createRealCreditScoreProvider } from './credit-score';
import { createRealPolicyProvider } from './policy';
import { createRealClaimProvider } from './claim';
import { createRealEduProvider } from './edu';
import { createRealPoolProvider } from './pool';
import { createRealDidzProvider } from './didz';
import { createRealAgenticDIDProvider } from './agenticdid';
import { createRealAIProvider } from './ai';

// =============================================================================
// realDeal Provider Factory
// =============================================================================
// Creates providers that connect to real Midnight infrastructure.
// Each provider wraps an SDK contract client that calls on-chain circuits.
//
// Network progression: local → pre-prod (skip preview per house convention)
//
// Contract wiring:
//   auth:         Midnight wallet (Passport or compatible) → DIDz key commitment
//   creditScore:  DIDz prove_score_at_least ZK circuit → proven score band
//   policies:     PolicyRegistry.compact → buy/activate/lapse/expire/mark_claimed
//   claims:       ClaimEngine.compact → submit/assign/approve/deny/confirm/dispute
//   edu:          EduCertifier.compact → issue/verify/revoke + TrustedIssuerRegistry
//   pool:         PremiumPool.compact → deposit/authorize/release/deny/withdraw + ZKSplunk
//   didz:         DIDzRegistry.compact → register_did (non-transferable registry entry)
//   agenticDID:   AgenticDIDRegistry.compact → create_delegation (scoped grants)
//   ai:           AI service (see docs/AI_INTEGRATION.md) — Phase 1-3 roadmap
//
// Multi-contract transaction orchestration (SDK composes in one tx):
//   buyPolicy:    PolicyRegistry.buy_policy + PremiumPool.deposit_premium
//   submitClaim:  ClaimEngine.submit_claim + PolicyRegistry.mark_claimed
//   approveClaim: ClaimEngine.approve_claim + PremiumPool.authorize_payout
//   releasePayout: PremiumPool.release_payout + ClaimEngine.confirm_payout
// =============================================================================

export function createRealProviders(mode?: 'local' | 'pre-prod'): Providers {
  const ctx: SdkContext = createSdkContext(mode ?? 'local');

  return {
    auth: createRealAuthProvider(),
    creditScore: createRealCreditScoreProvider(),
    policies: createRealPolicyProvider(ctx),
    claims: createRealClaimProvider(ctx),
    edu: createRealEduProvider(ctx),
    pool: createRealPoolProvider(ctx),
    didz: createRealDidzProvider(),
    agenticDID: createRealAgenticDIDProvider(),
    ai: createRealAIProvider(),
  };
}
