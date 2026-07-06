// =============================================================================
// CryptoSure realDeal — DIDz Provider
// =============================================================================
// Connects to DIDzRegistry.compact (DIDz.io) for identity registration.
// DIDz identities are non-transferable registry entries (NOT NFTs).
// The identity is a key commitment — never revealed on-chain.
// =============================================================================

import type { IDidzProvider, DidzIdentity } from '../types';

export function createRealDidzProvider(): IDidzProvider {
  return {
    async getIdentity(): Promise<DidzIdentity | null> {
      // TODO_SDK: Query DIDzRegistry for the holder's DIDz
      // The DIDz is identified by a key commitment derived from the wallet.
      // Privacy: only the commitment is on-chain, not the raw identity.
      throw new Error('realDeal didz: DIDzRegistry not connected');
    },

    async registerIdentity(): Promise<DidzIdentity> {
      // TODO_SDK: Call DIDzRegistry.register_did(profile_commitment)
      // The profile commitment is a hash of off-chain profile data + salt.
      // The DIDz is permanent, non-transferable, and never expires (for humans).
      // It is a REGISTRY ENTRY, not a token/NFT.
      throw new Error('realDeal didz: DIDzRegistry not connected');
    },
  };
}
