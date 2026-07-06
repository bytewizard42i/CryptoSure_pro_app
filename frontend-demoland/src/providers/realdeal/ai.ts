// =============================================================================
// CryptoSure realDeal — AI Assistant Provider
// =============================================================================
// Future AI integration for claim pre-screening, coverage recommendations,
// and conversational assistance. See docs/AI_INTEGRATION.md for roadmap.
// =============================================================================

import type { IAIAssistantProvider, ChatMessage, PolicyWorld, ScoreBand, ClaimEvent } from '../types';

export function createRealAIProvider(): IAIAssistantProvider {
  return {
    async chat(messages: ChatMessage[]): Promise<{ response: string }> {
      // TODO_AI: Phase 3 — Full conversational assistant
      // Connect to LLM service with CryptoSure context (policy, claim, score)
      throw new Error('realDeal ai: AI service not configured');
    },

    async suggestCoverage(profile: { world: PolicyWorld; scoreBand: ScoreBand }): Promise<string> {
      // TODO_AI: Phase 2 — LLM-powered coverage recommendations
      // Uses score band + coverage world to suggest appropriate tier
      throw new Error('realDeal ai: AI service not configured');
    },

    async preScreenClaim(description: string, event: ClaimEvent): Promise<{ likely: boolean; reason: string }> {
      // TODO_AI: Phase 1 — Rule-based claim pre-screening
      // Checks if the claim event is covered by the policy scope
      // Returns a recommendation — human adjuster makes final decision
      throw new Error('realDeal ai: AI service not configured');
    },
  };
}
