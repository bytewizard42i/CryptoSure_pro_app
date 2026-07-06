// =============================================================================
// CryptoSure realDeal — Credit Score Provider
// =============================================================================
// Calls DIDz prove_score_at_least ZK circuit to prove the holder's credit
// score band without revealing the raw score. The band determines:
//   - Max tier allowed (tier gate)
//   - Premium multiplier (lower band = higher premium)
// =============================================================================

import type { ICreditScoreProvider, CreditScoreInfo, ScoreBand, TierCode } from '../types';
import { SCORE_BAND, MAX_TIER_FOR_BAND, PREMIUM_MULTIPLIER } from '../../sdk/contract-types';

export function createRealCreditScoreProvider(): ICreditScoreProvider {
  return {
    async getScoreBand(): Promise<ScoreBand> {
      // TODO_DIDZ: Call DIDz prove_score_at_least ZK circuit
      // The prover generates a ZK proof that their score >= threshold.
      // The verifier (this provider) learns only the proven band, not the raw score.
      // Privacy model: raw score never leaves the prover's device.
      throw new Error('realDeal creditScore: DIDz ZK circuit not connected');
    },

    async getScoreInfo(): Promise<CreditScoreInfo> {
      // TODO_DIDZ: Get score band + derive tier/multiplier
      const band = await this.getScoreBand();

      const bandCode = SCORE_BAND[band.toUpperCase() as keyof typeof SCORE_BAND] ?? SCORE_BAND.UNRATED;
      const maxTierNum = MAX_TIER_FOR_BAND[bandCode] ?? 0;
      const maxTier = `T${maxTierNum}` as TierCode;
      const multiplier = PREMIUM_MULTIPLIER[bandCode] ?? 1.0;

      return {
        band,
        scoreEstimate: 0, // Never revealed in realDeal — 0 is placeholder
        maxTier,
        premiumMultiplier: multiplier,
        lastUpdated: new Date().toISOString(),
      };
    },
  };
}
