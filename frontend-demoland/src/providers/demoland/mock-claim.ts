import type { IClaimProvider, Claim, SubmitClaimParams } from '../types';

const STORAGE_KEY = 'cryptosure_demo_claims';

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function readClaims(): Claim[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeClaims(claims: Claim[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(claims));
}

export class MockClaimProvider implements IClaimProvider {
  private claims: Claim[] = typeof window !== 'undefined' ? readClaims() : [];

  async listClaims(): Promise<Claim[]> {
    await delay(400);
    return [...this.claims];
  }

  async getClaim(claimId: string): Promise<Claim> {
    await delay(300);
    const c = this.claims.find((c) => c.id === claimId);
    if (!c) throw new Error(`Claim ${claimId} not found`);
    return { ...c };
  }

  async submitClaim(params: SubmitClaimParams): Promise<Claim> {
    await delay(1200);
    const claim: Claim = {
      id: `clm-${Date.now()}`,
      policyId: params.policyId,
      status: 'submitted',
      event: params.event,
      description: params.description,
      amount: params.amount,
      submittedAt: new Date().toISOString(),
      resolvedAt: null,
      denyReason: null,
      forensicReportHash: null,
      adjusterId: null,
    };
    this.claims.push(claim);
    writeClaims(this.claims);
    console.log(`[demoLand] Claim submitted: ${claim.id} for policy ${params.policyId}`);
    return claim;
  }

  async resolveClaim(claimId: string, approve: boolean, reason?: string): Promise<Claim> {
    await delay(800);
    const c = this.claims.find((c) => c.id === claimId);
    if (!c) throw new Error(`Claim ${claimId} not found`);
    c.status = approve ? 'approved' : 'denied';
    c.resolvedAt = new Date().toISOString();
    c.denyReason = approve ? null : (reason || 'Claim does not match covered event set');
    if (approve) {
      c.forensicReportHash = `0xforensic_${claimId}`;
      c.adjusterId = 'demo-adjuster-001';
    }
    writeClaims(this.claims);
    console.log(`[demoLand] Claim ${approve ? 'approved' : 'denied'}: ${claimId}`);
    return { ...c };
  }
}
