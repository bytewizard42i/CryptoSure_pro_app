// =============================================================================
// CryptoSure realDeal — AgenticDID Provider
// =============================================================================
// Connects to AgenticDIDRegistry.compact for agent delegation.
// Agents act under scoped grants with per_action_cap AND cumulative_cap
// (both enforced on-chain). Score-scaled tier ceiling for agent-initiated
// policies.
// =============================================================================

import type { IAgenticDIDProvider, AgentGrant } from '../types';

export function createRealAgenticDIDProvider(): IAgenticDIDProvider {
  return {
    async getGrant(): Promise<AgentGrant | null> {
      // TODO_SDK: Query AgenticDIDRegistry for active grants
      // Returns the agent's delegation details including caps and remaining budget
      throw new Error('realDeal agenticDID: AgenticDIDRegistry not connected');
    },

    async createGrant(agentId: string, perActionCap: number, cumulativeCap: number): Promise<AgentGrant> {
      // TODO_SDK: Call AgenticDIDRegistry.create_delegation
      // Both per_action_cap and cumulative_cap are enforced on-chain.
      // The delegation reserves the child cumulative budget from the parent.
      // Score-scaled: agent max tier = f(principal_score_band)
      throw new Error('realDeal agenticDID: AgenticDIDRegistry not connected');
    },
  };
}
