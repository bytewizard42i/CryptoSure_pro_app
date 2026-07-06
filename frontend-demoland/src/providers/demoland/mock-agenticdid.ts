import type { IAgenticDIDProvider, AgentGrant } from '../types';

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// =============================================================================
// PLACEHOLDER AgenticDID PROVIDER
// =============================================================================
// In realDeal, this connects to AgenticDID's scoped grant system on Midnight.
// per_action_cap AND cumulative_cap are both enforced on-chain.
// Score-scaled caps: tier ceiling = f(principal score band).
// Non-delegable EDU signature is enforced by EduCertifier, not here.
// See docs/ECOSYSTEM_COORDINATION.md §2 for the full integration design.
// =============================================================================

export class MockAgenticDIDProvider implements IAgenticDIDProvider {
  private grant: AgentGrant | null = null;

  async getGrant(): Promise<AgentGrant | null> {
    await delay(300);
    return this.grant;
  }

  async createGrant(agentId: string, perActionCap: number, cumulativeCap: number): Promise<AgentGrant> {
    await delay(1000);
    this.grant = {
      agentId,
      perActionCap,
      cumulativeCap,
      remaining: cumulativeCap,
      maxTierByBand: 'T3',
    };
    console.log(`[demoLand] Agent grant created: ${agentId} (cap: $${perActionCap}/action, $${cumulativeCap} total)`);
    return { ...this.grant };
  }
}
