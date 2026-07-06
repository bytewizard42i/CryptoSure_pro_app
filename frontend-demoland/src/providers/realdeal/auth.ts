// =============================================================================
// CryptoSure realDeal — Auth Provider
// =============================================================================
// Connects to Midnight wallet (Passport or compatible) for authentication.
// The wallet provides the DIDz key commitment that all other providers use.
// =============================================================================

import type { IAuthProvider, AuthSession, SignUpData, SignUpMethod } from '../types';

export function createRealAuthProvider(): IAuthProvider {
  return {
    async login(method: SignUpMethod, email?: string, _password?: string): Promise<AuthSession> {
      // TODO_SDK: Connect to Midnight wallet (Passport/lace/compatible)
      // The wallet returns a public key — we derive the DIDz commitment from it.
      // For did-wallet method, the wallet IS the auth.
      // For other methods (email, pgp, trezor, biometric, oauth), we still
      // need a wallet connection for on-chain interactions.
      throw new Error('realDeal auth: Midnight wallet not connected — install @midnight-ntwrk/sdk');
    },

    async signup(data: SignUpData): Promise<AuthSession> {
      // TODO_SDK: Create wallet + register DIDz identity via DIDzRegistry.compact
      // Flow: wallet.create() → DIDzRegistry.register_did(profile_commitment)
      // The DIDz is a non-transferable registry entry, NOT an NFT.
      throw new Error('realDeal auth: DIDz registration requires SDK connection');
    },

    async logout(): Promise<void> {
      // Disconnect wallet
    },

    getSession(): AuthSession | null {
      // Return cached session from wallet connection
      return null;
    },

    isAuthenticated(): boolean {
      return false;
    },

    listSignedUpUsers(): SignUpData[] {
      return [];
    },
  };
}
