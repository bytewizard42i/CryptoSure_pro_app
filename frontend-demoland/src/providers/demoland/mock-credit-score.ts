import type {
  ICreditScoreProvider, ScoreBand, CreditScoreInfo, TierCode,
} from '../types';

const BAND_INFO: Record<ScoreBand, { estimate: number; maxTier: TierCode; multiplier: number }> = {
  A: { estimate: 850, maxTier: 'T5', multiplier: 0.6 },
  B: { estimate: 700, maxTier: 'T3', multiplier: 0.8 },
  C: { estimate: 550, maxTier: 'T1', multiplier: 1.0 },
  D: { estimate: 400, maxTier: 'T1', multiplier: 1.3 },
  unrated: { estimate: 0, maxTier: 'T1', multiplier: 1.3 },
};

export class MockCreditScoreProvider implements ICreditScoreProvider {
  async getScoreBand(): Promise<ScoreBand> {
    return 'B';
  }

  async getScoreInfo(): Promise<CreditScoreInfo> {
    const band = await this.getScoreBand();
    const info = BAND_INFO[band];
    return {
      band,
      scoreEstimate: info.estimate,
      maxTier: info.maxTier,
      premiumMultiplier: info.multiplier,
      lastUpdated: new Date().toISOString(),
    };
  }
}
