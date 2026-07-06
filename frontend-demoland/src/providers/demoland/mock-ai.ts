import type {
  IAIAssistantProvider, ChatMessage,
  PolicyWorld, ScoreBand, ClaimEvent,
} from '../types';

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// =============================================================================
// MOCK AI ASSISTANT PROVIDER
// =============================================================================
// This is a rule-based mock. See docs/AI_INTEGRATION.md for the phased plan:
// Phase 1: Rule-based claim pre-screening (this mock)
// Phase 2: LLM-powered coverage recommendations
// Phase 3: Full conversational assistant with context awareness
// =============================================================================

export class MockAIAssistantProvider implements IAIAssistantProvider {
  async chat(messages: ChatMessage[]): Promise<{ response: string }> {
    await delay(800);

    const lastMsg = messages[messages.length - 1]?.content || '';
    let response = '';
    const lower = lastMsg.toLowerCase();

    if (lower.includes('claim') && lower.includes('file')) {
      response = 'To file a claim, go to the Claims page and select your policy. You\'ll need to describe the loss event and amount. For theft claims, our forensic partners (Chainalysis, TRM Labs) will trace the stolen funds. Make sure your loss matches a covered event in your policy scope.';
    } else if (lower.includes('coverage') || lower.includes('tier')) {
      if (lower.includes('a') || lower.includes('good')) {
        response = 'With score band A, you qualify for up to T5 ($50,000) coverage at the best premium rate (0.6x multiplier). I recommend completing CryptoSure-EDU to unlock higher tiers.';
      } else if (lower.includes('b')) {
        response = 'With score band B, you qualify for up to T3 ($10,000) coverage at 0.8x premium multiplier. Complete EDU certification to activate T2+ tiers.';
      } else {
        response = 'Your current score band limits coverage to T1 ($1,000). Improving your DIDz credit score through good ecosystem behavior will unlock higher tiers.';
      }
    } else if (lower.includes('edu') || lower.includes('cert')) {
      response = 'CryptoSure-EDU is required for tiers $5,000 and above. The certification covers wallet hygiene, seed custody, phishing awareness, hardware wallets, and recovery planning. You must personally sign the scope acceptance (non-delegable, even if an agent manages your policy).';
    } else if (lower.includes('pool') || lower.includes('balance')) {
      response = 'The premium pool currently holds approximately $1,250,000 with 793 active policies. Reserve ratio: 78%. 3 claims are pending review. Visit the Pool page for live stats.';
    } else if (lower.includes('agent') || lower.includes('delegate')) {
      response = 'AgenticDID allows you to delegate policy management to an agent with spend caps (per_action_cap and cumulative_cap). The agent can buy policies up to your score-scaled tier ceiling, but cannot sign the EDU acceptance for you — that\'s non-delegable.';
    } else {
      response = 'I can help with claims, coverage tiers, EDU certification, pool status, and agent delegation. What would you like to know?';
    }

    return { response };
  }

  async suggestCoverage(profile: { world: PolicyWorld; scoreBand: ScoreBand }): Promise<string> {
    await delay(600);
    if (profile.world === 'gaming') {
      return 'For gaming asset insurance, start with T1 ($1,000) to cover individual rare items. If you hold high-value collections (NFTs worth $5k+), complete EDU and unlock T2-T3. The gaming pilot uses a service-contract model with less regulatory friction.';
    }
    if (profile.world === 'wallet') {
      if (profile.scoreBand === 'A' || profile.scoreBand === 'B') {
        return 'For wallet insurance, I recommend T2 ($5,000) after completing EDU. This covers hardware-wallet compromise and device loss. If you custody more than $25k, consider T4 with the advanced EDU module.';
      }
      return 'Start with T1 ($1,000) wallet coverage. As your DIDz credit score improves, you\'ll unlock higher tiers. Complete EDU for a premium discount even at T1.';
    }
    return 'For everyday coverage, register your asset as an RWAz entry. Your coverage cap is determined by your credit score band and the asset\'s appraised value band.';
  }

  async preScreenClaim(description: string, event: ClaimEvent): Promise<{ likely: boolean; reason: string }> {
    await delay(500);
    const lower = description.toLowerCase();

    // Rule-based pre-screening
    if (event === 'theft_covered_vector') {
      if (lower.includes('hardware') || lower.includes('compromised')) {
        return { likely: true, reason: 'Hardware wallet compromise is a covered event. Forensic tracing will verify the theft path.' };
      }
      if (lower.includes('sent') || lower.includes('approved') || lower.includes('transfer')) {
        return { likely: false, reason: 'Voluntary transfers and approved transactions are NOT covered. Signing a transaction is not a covered loss.' };
      }
    }
    if (event === 'gaming_asset_destruction' || event === 'gaming_asset_theft') {
      return { likely: true, reason: 'Gaming asset loss events are covered under the gaming pilot scope. Provide transaction evidence of the loss.' };
    }
    if (lower.includes('scam') || lower.includes('phishing') || lower.includes('drainer')) {
      return { likely: false, reason: 'Phishing/drainer losses where you signed a malicious approval are NOT covered (EDU teaches you to recognize these). File only if the attack bypassed your certified hygiene setup.' };
    }

    return { likely: true, reason: 'Event appears to match a covered category. Full review by an adjuster is required.' };
  }
}
