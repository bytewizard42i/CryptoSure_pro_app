import type { IDidzProvider, DidzIdentity } from '../types';

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// =============================================================================
// PLACEHOLDER DIDz PROVIDER
// =============================================================================
// In realDeal, this connects to DIDz.io's DIDzRegistry on Midnight.
// The identity is a non-transferable registry entry (not an NFT, per John's §0b).
// Credit score attestation comes from the DIDz scoring oracle.
// All identity facts stay as on-chain commitments — never revealed.
// See docs/ECOSYSTEM_COORDINATION.md §1 for the full integration design.
// =============================================================================

export class MockDidzProvider implements IDidzProvider {
  private identity: DidzIdentity | null = null;

  async getIdentity(): Promise<DidzIdentity | null> {
    await delay(300);
    if (!this.identity) {
      this.identity = {
        commitment: '0xDEMO_didz_commitment_a1b2c3d4',
        registeredAt: new Date(Date.now() - 30 * 86400000).toISOString(),
      };
    }
    return { ...this.identity };
  }

  async registerIdentity(): Promise<DidzIdentity> {
    await delay(1500);
    this.identity = {
      commitment: `0xDEMO_didz_${Date.now().toString(16)}`,
      registeredAt: new Date().toISOString(),
    };
    console.log(`[demoLand] DIDz identity registered: ${this.identity.commitment}`);
    return { ...this.identity };
  }
}
