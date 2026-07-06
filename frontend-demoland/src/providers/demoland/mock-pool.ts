import type { IPoolProvider, PoolStats, PoolEvent } from '../types';

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export class MockPoolProvider implements IPoolProvider {
  async getStats(): Promise<PoolStats> {
    await delay(500);
    return {
      totalBalance: 1_250_000,
      totalPolicies: 847,
      activePolicies: 793,
      totalPremiumsCollected: 340_000,
      totalClaimsPaid: 89_000,
      pendingClaims: 3,
      lastPayoutAt: new Date(Date.now() - 2 * 86400000).toISOString(),
      reserveRatio: 0.78,
    };
  }

  async getEvents(): Promise<PoolEvent[]> {
    return this.getHistory();
  }

  async getHistory(): Promise<PoolEvent[]> {
    await delay(400);
    const now = Date.now();
    return [
      { id: 'evt-1', type: 'premium_in', amount: 120, policyId: 'pol-demo-001', claimId: null, timestamp: new Date(now - 86400000).toISOString(), txHash: '0xtx_demo_001' },
      { id: 'evt-2', type: 'claim_paid', amount: 5000, policyId: 'pol-demo-002', claimId: 'clm-001', timestamp: new Date(now - 2 * 86400000).toISOString(), txHash: '0xtx_demo_002' },
      { id: 'evt-3', type: 'premium_in', amount: 600, policyId: 'pol-demo-003', claimId: null, timestamp: new Date(now - 3 * 86400000).toISOString(), txHash: '0xtx_demo_003' },
      { id: 'evt-4', type: 'claim_denied', amount: 0, policyId: 'pol-demo-004', claimId: 'clm-002', timestamp: new Date(now - 5 * 86400000).toISOString(), txHash: '0xtx_demo_004' },
    ];
  }
}
