import type {
  IPolicyProvider, Policy, BuyPolicyParams,
} from '../types';
import { TIER_COVERAGE, TIER_EDU_REQUIRED } from '../types';

const STORAGE_KEY = 'cryptosure_demo_policies';

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function readPolicies(): Policy[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writePolicies(policies: Policy[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(policies));
}

const DEMO_POLICIES: Policy[] = [
  {
    id: 'pol-demo-001',
    holderDidCommitment: '0xDEMO_didz_commitment_a1b2c3d4',
    world: 'wallet',
    tier: 'T1',
    coverageLimit: 1000,
    premium: 120,
    status: 'active',
    scopeHash: '0xscope_v1_hash',
    scopeVersion: 1,
    eduRequired: false,
    eduSatisfied: true,
    eduCommitment: '0xedu_commit_demo',
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
    activatedAt: new Date(Date.now() - 30 * 86400000).toISOString(),
    expiresAt: new Date(Date.now() + 335 * 86400000).toISOString(),
  },
];

export class MockPolicyProvider implements IPolicyProvider {
  private policies: Policy[] = typeof window !== 'undefined' ? readPolicies() : [...DEMO_POLICIES];

  async listPolicies(): Promise<Policy[]> {
    await delay(400);
    return [...this.policies];
  }

  async getPolicy(policyId: string): Promise<Policy> {
    await delay(300);
    const p = this.policies.find((p) => p.id === policyId);
    if (!p) throw new Error(`Policy ${policyId} not found`);
    return { ...p };
  }

  async buyPolicy(params: BuyPolicyParams): Promise<Policy> {
    await delay(1000);
    const coverage = TIER_COVERAGE[params.tier];
    const eduRequired = TIER_EDU_REQUIRED[params.tier];
    const premium = Math.round(coverage * 0.12);

    const policy: Policy = {
      id: `pol-${Date.now()}`,
      holderDidCommitment: '0xDEMO_didz_commitment_current',
      world: params.world,
      tier: params.tier,
      coverageLimit: coverage,
      premium,
      status: eduRequired ? 'pending' : 'active',
      scopeHash: params.scopeHash,
      scopeVersion: 1,
      eduRequired,
      eduSatisfied: !!params.eduCommitment,
      eduCommitment: params.eduCommitment || null,
      createdAt: new Date().toISOString(),
      activatedAt: eduRequired ? null : new Date().toISOString(),
      expiresAt: new Date(Date.now() + 365 * 86400000).toISOString(),
    };

    this.policies.push(policy);
    writePolicies(this.policies);
    console.log(`[demoLand] Policy purchased: ${policy.id} (${policy.tier} $${coverage})`);
    return policy;
  }

  async activatePolicy(policyId: string, eduProof: string): Promise<Policy> {
    await delay(800);
    const p = this.policies.find((p) => p.id === policyId);
    if (!p) throw new Error(`Policy ${policyId} not found`);
    if (p.status !== 'pending') throw new Error(`Policy ${policyId} is not pending`);
    p.status = 'active';
    p.activatedAt = new Date().toISOString();
    p.eduSatisfied = true;
    p.eduCommitment = eduProof;
    writePolicies(this.policies);
    console.log(`[demoLand] Policy activated: ${policyId}`);
    return { ...p };
  }

  async lapsePolicy(policyId: string): Promise<Policy> {
    await delay(300);
    const p = this.policies.find((p) => p.id === policyId);
    if (!p) throw new Error(`Policy ${policyId} not found`);
    p.status = 'lapsed';
    writePolicies(this.policies);
    return { ...p };
  }
}
