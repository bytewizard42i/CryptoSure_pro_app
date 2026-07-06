// =============================================================================
// CryptoSure realDeal — Pool Provider
// =============================================================================
// Reads PremiumPool.compact public state for solvency transparency.
// ZKSplunk integration for telemetry and event monitoring.
// =============================================================================

import type { IPoolProvider, PoolStats, PoolEvent } from '../types';
import { PremiumPoolClient, type SdkContext } from '../../sdk/contract-helpers';

export function createRealPoolProvider(ctx: SdkContext): IPoolProvider {
  const client = new PremiumPoolClient(ctx);

  return {
    async getStats(): Promise<PoolStats> {
      // TODO_SDK: Read PremiumPool public counters:
      //   get_pool_balance(), get_total_premiums(), get_total_claims_paid(),
      //   get_active_policy_count()
      // These are public on-chain — no ZK proof needed.
      throw new Error('realDeal pool: SDK not connected');
    },

    async getHistory(): Promise<PoolEvent[]> {
      // TODO_ZKSPLUNK: Query ZKSplunk for pool events
      // ZKSplunk indexes on-chain events for observability and forensics.
      throw new Error('realDeal pool: ZKSplunk not connected');
    },

    async getEvents(): Promise<PoolEvent[]> {
      return this.getHistory();
    },
  };
}
