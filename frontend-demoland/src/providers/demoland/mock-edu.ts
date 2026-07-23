import type { IEduProvider, EduCert, EduModule, EduModuleInfo } from '../types';

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const MODULES: EduModuleInfo[] = [
  { id: 'wallet_hygiene', title: 'Wallet Hygiene', description: 'Best practices for securing self-custodied wallets', estimatedTime: '15 min', requiredFor: ['T2', 'T3', 'T4', 'T5'] },
  { id: 'seed_custody', title: 'Seed Phrase Custody', description: 'How to safely store and back up your seed phrase', estimatedTime: '20 min', requiredFor: ['T2', 'T3', 'T4', 'T5'] },
  { id: 'phishing_awareness', title: 'Phishing & Approval Drainer Awareness', description: 'Recognizing and avoiding common crypto scams', estimatedTime: '25 min', requiredFor: ['T2', 'T3', 'T4', 'T5'] },
  { id: 'hardware_wallet', title: 'Hardware Wallet Setup', description: 'Setting up and using a hardware wallet for insured balances', estimatedTime: '30 min', requiredFor: ['T3', 'T4', 'T5'] },
  { id: 'recovery_planning', title: 'Recovery Planning', description: 'Creating a robust recovery plan (m-of-n, social recovery)', estimatedTime: '20 min', requiredFor: ['T3', 'T4', 'T5'] },
  { id: 'scope_review', title: 'Policy Scope Review', description: 'Understanding what is and is not covered by your policy', estimatedTime: '10 min', requiredFor: ['T2', 'T3', 'T4', 'T5'] },
  { id: 'gaming_asset_safety', title: 'Gaming Asset Safety', description: 'Protecting in-game digital assets from accidental loss', estimatedTime: '15 min', requiredFor: ['T2', 'T3'] },
];

export class MockEduProvider implements IEduProvider {
  private cert: EduCert | null = null;

  async getCert(): Promise<EduCert | null> {
    await delay(300);
    return this.cert;
  }

  async getCertifications(): Promise<EduCert[]> {
    await delay(300);
    return this.cert ? [{ ...this.cert }] : [];
  }

  async issueCert(modules: EduModule[], scopeHash: string, holderSignature: string): Promise<EduCert> {
    await delay(1500);
    this.cert = {
      id: `edu-${Date.now()}`,
      holderDidCommitment: '0xDEMO_didz_commitment_current',
      issuerId: 'demo-issuer-001',
      issuerName: 'CryptoSure Demo EDU',
      modules,
      scopeHash,
      scopeVersion: 1,
      holderSignature,
      issuedAt: new Date().toISOString(),
      expiresAt: null,
    };
    console.log(`[demoLand] EDU cert issued: ${this.cert.id} (${modules.length} modules)`);
    return { ...this.cert };
  }

  async issueCertById(moduleId: EduModule): Promise<EduCert> {
    await delay(1500);
    return this.issueCert([moduleId], '0xscope_demo_v1', '0xdemo_holder_sig');
  }

  async verifyCertForScope(scopeHash: string): Promise<boolean> {
    await delay(400);
    if (!this.cert) return false;
    return this.cert.scopeHash === scopeHash && !!this.cert.holderSignature;
  }

  async listModules(): Promise<EduModuleInfo[]> {
    await delay(200);
    return [...MODULES];
  }
}
