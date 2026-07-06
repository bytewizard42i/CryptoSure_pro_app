// =============================================================================
// CryptoSure realDeal — EDU Provider
// =============================================================================
// Interacts with EduCertifier.compact on Midnight.
// Issuer approval is delegated to DIDz TrustedIssuerRegistry (domain "CRYPTOSURE-EDU").
// The holder signature on scope acceptance is NON-DELEGABLE — even if an agent
// guided the holder through EDU modules, the final signature must come from
// the holder's key.
// =============================================================================

import type { IEduProvider, EduCert, EduModule, EduModuleInfo } from '../types';
import { EduCertifierClient, type SdkContext } from '../../sdk/contract-helpers';
import { TIER_CODE, EDU_MODULE_BITS, REQUIRED_MODULES } from '../../sdk/contract-types';

export function createRealEduProvider(ctx: SdkContext): IEduProvider {
  const client = new EduCertifierClient(ctx);

  return {
    async getCert(): Promise<EduCert | null> {
      // TODO_SDK: Query EduCertifier for the holder's current cert
      // Uses off-chain indexer to find cert by holder commitment
      throw new Error('realDeal edu: SDK not connected');
    },

    async getCertifications(): Promise<EduCert[]> {
      // TODO_SDK: Query all certs for this holder
      throw new Error('realDeal edu: SDK not connected');
    },

    async issueCert(modules: EduModule[], scopeHash: string, holderSignature: string): Promise<EduCert> {
      // TODO_SDK: Call EduCertifier.issue_cert
      // Pre-conditions (verified off-chain):
      //   1. Issuer is approved by TrustedIssuerRegistry for domain "CRYPTOSURE-EDU"
      //   2. Holder signature is valid for scopeHash under holder's key
      //   3. Holder control proof verified
      // Non-delegable: holderSignature must be from holder's key, not agent's
      throw new Error('realDeal edu: SDK not connected');
    },

    async issueCertById(moduleId: EduModule): Promise<EduCert> {
      // Convenience: issue cert for a single module
      // In practice, certs are issued after completing all required modules
      throw new Error('realDeal edu: SDK not connected');
    },

    async verifyCertForScope(scopeHash: string): Promise<boolean> {
      // TODO_SDK: Call EduCertifier.verify_cert or verify_cert_for_scope
      // Called by PolicyRegistry during activation
      throw new Error('realDeal edu: SDK not connected');
    },

    async listModules(): Promise<EduModuleInfo[]> {
      // Static list — same in demoLand and realDeal
      return [
        { id: 'wallet_hygiene', title: 'Wallet Hygiene', description: 'Secure wallet setup and management', estimatedTime: '15 min', requiredFor: ['T2', 'T3', 'T4', 'T5'] },
        { id: 'seed_custody', title: 'Seed Phrase Custody', description: 'Best practices for seed phrase storage', estimatedTime: '20 min', requiredFor: ['T2', 'T3', 'T4', 'T5'] },
        { id: 'phishing_awareness', title: 'Phishing & Drainer Awareness', description: 'Recognize and avoid phishing attacks', estimatedTime: '25 min', requiredFor: ['T2', 'T3', 'T4', 'T5'] },
        { id: 'hardware_wallet', title: 'Hardware Wallet Setup', description: 'Set up and use a hardware wallet', estimatedTime: '30 min', requiredFor: ['T3', 'T4', 'T5'] },
        { id: 'recovery_planning', title: 'Recovery Planning', description: 'Plan for key recovery and inheritance', estimatedTime: '25 min', requiredFor: ['T3', 'T4', 'T5'] },
        { id: 'scope_review', title: 'Policy Scope Review', description: 'Understand what is and is not covered', estimatedTime: '20 min', requiredFor: ['T2', 'T3', 'T4', 'T5'] },
        { id: 'gaming_asset_safety', title: 'Gaming Asset Safety', description: 'Protect gaming assets from loss', estimatedTime: '15 min', requiredFor: ['T2', 'T3', 'T4', 'T5'] },
      ];
    },
  };
}
