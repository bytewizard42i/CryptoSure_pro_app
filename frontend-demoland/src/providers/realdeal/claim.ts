// =============================================================================
// CryptoSure realDeal — Claim Provider
// =============================================================================
// Interacts with ClaimEngine.compact on Midnight.
// Submit claim = multi-contract tx: ClaimEngine.submit_claim + PolicyRegistry.mark_claimed
// Approve claim = multi-contract tx: ClaimEngine.approve_claim + PremiumPool.authorize_payout
// Release payout = multi-contract tx: PremiumPool.release_payout + ClaimEngine.confirm_payout
// =============================================================================

import type { IClaimProvider, Claim, SubmitClaimParams } from '../types';
import { ClaimEngineClient, type SdkContext } from '../../sdk/contract-helpers';

export function createRealClaimProvider(ctx: SdkContext): IClaimProvider {
  const client = new ClaimEngineClient(ctx);

  return {
    async listClaims(): Promise<Claim[]> {
      // TODO_SDK: Query ClaimEngine for all claims by this holder
      // Uses the off-chain indexer to filter by holder commitment
      throw new Error('realDeal claims: SDK not connected');
    },

    async getClaim(claimId: string): Promise<Claim> {
      // TODO_SDK: Query ClaimEngine.get_claim_status + holder query
      throw new Error('realDeal claims: SDK not connected');
    },

    async submitClaim(params: SubmitClaimParams): Promise<Claim> {
      // TODO_SDK: Orchestrate multi-contract tx:
      //   1. ClaimEngine.submit_claim(...)
      //   2. PolicyRegistry.mark_claimed(policyId)
      // The nullifier prevents double-claiming the same loss event.
      throw new Error('realDeal claims: SDK not connected');
    },

    async resolveClaim(claimId: string, approve: boolean, reason?: string): Promise<Claim> {
      // TODO_SDK: If approve:
      //   1. ClaimEngine.approve_claim(...)
      //   2. PremiumPool.authorize_payout(...)
      // If deny:
      //   1. ClaimEngine.deny_claim(...)
      //   2. PremiumPool.deny_payout(...)
      // Only the assigned adjuster can call this.
      throw new Error('realDeal claims: SDK not connected');
    },
  };
}
