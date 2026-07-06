// =============================================================================
// CryptoSure realDeal — Policy Provider
// =============================================================================
// Interacts with PolicyRegistry.compact on Midnight.
// Buy policy = multi-contract tx: PolicyRegistry.buy_policy + PremiumPool.deposit_premium
// =============================================================================

import type { IPolicyProvider, Policy, BuyPolicyParams, TierCode, PolicyWorld, PolicyStatus } from '../types';
import { TIER_CODE, POLICY_WORLD, POLICY_STATUS, COVERAGE_LIMIT } from '../../sdk/contract-types';
import { PolicyRegistryClient, computePremium, type SdkContext } from '../../sdk/contract-helpers';

export function createRealPolicyProvider(ctx: SdkContext): IPolicyProvider {
  const client = new PolicyRegistryClient(ctx);

  return {
    async listPolicies(): Promise<Policy[]> {
      // TODO_SDK: Query PolicyRegistry for all policies owned by this holder
      // The SDK can filter by holder commitment (off-chain indexer query)
      throw new Error('realDeal policies: SDK not connected');
    },

    async getPolicy(policyId: string): Promise<Policy> {
      // TODO_SDK: Query PolicyRegistry.get_policy_status + holder query
      throw new Error('realDeal policies: SDK not connected');
    },

    async buyPolicy(params: BuyPolicyParams): Promise<Policy> {
      // TODO_SDK: Orchestrate multi-contract tx:
      //   1. PolicyRegistry.buy_policy(...)
      //   2. PremiumPool.deposit_premium(coin, scoreBand)
      // The premium is computed from tier × band multiplier (off-chain).
      // The coin is constructed by the SDK from the holder's wallet.
      throw new Error('realDeal policies: SDK not connected');
    },

    async activatePolicy(policyId: string, eduProof: string): Promise<Policy> {
      // TODO_SDK: Call PolicyRegistry.activate_policy
      // Non-delegable: holder must personally sign (wallet required)
      throw new Error('realDeal policies: SDK not connected');
    },

    async lapsePolicy(policyId: string): Promise<Policy> {
      // TODO_SDK: Call PolicyRegistry.lapse_policy + PremiumPool.record_lapse
      throw new Error('realDeal policies: SDK not connected');
    },
  };
}
