// =============================================================================
// CryptoSure — Midnight SDK Interaction Helpers
// =============================================================================
// These helpers wrap the Midnight SDK calls to each contract's circuits.
// They handle coin construction, ZK proof marshaling, and multi-contract
// transaction orchestration (since Compact lacks cross-contract calls).
//
// PATTERN: The SDK orchestrates multi-contract transactions by building
// a single transaction that calls circuits on multiple contracts. For
// example, buying a policy calls both PolicyRegistry.buy_policy AND
// PremiumPool.deposit_premium in the same transaction.
//
// DEPENDENCY: @midnight-ntwrk/sdk (installed when realDeal mode is activated)
// For now, these helpers are typed but throw if called without the SDK.
// =============================================================================

import {
  type ContractAddresses,
  type NetworkConfig,
  type ScoreBandCode,
  type PolicyWorldCode,
  type TierCodeNum,
  type ClaimEventCode,
  type PolicyRecord,
  type CertRecord,
  type ClaimRecord,
  SCORE_BAND,
  POLICY_WORLD,
  TIER_CODE,
  POLICY_STATUS,
  CLAIM_STATUS,
  CLAIM_EVENT,
  EDU_MODULE_BITS,
  REQUIRED_MODULES,
  MAX_TIER_FOR_BAND,
  AGENT_MAX_TIER_FOR_BAND,
  PREMIUM_MULTIPLIER,
  BASE_PREMIUM,
  COVERAGE_LIMIT,
  LOCAL_CONFIG,
  PRE_PROD_CONFIG,
  DEFAULT_ADDRESSES,
} from './contract-types';

// =============================================================================
// Utility Functions
// =============================================================================

/** Convert a hex string to Uint8Array (for Midnight SDK bytes params). */
export function hexToBytes(hex: string): Uint8Array {
  const clean = hex.startsWith('0x') ? hex.slice(2) : hex;
  const bytes = new Uint8Array(clean.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(clean.substr(i * 2, 2), 16);
  }
  return bytes;
}

/** Convert Uint8Array to hex string. */
export function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/** Generate a random 32-byte commitment (hex string). */
export function randomCommitment(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return bytesToHex(bytes);
}

/** Generate a random 64-byte signature (hex string). */
export function randomSignature(): string {
  const bytes = new Uint8Array(64);
  crypto.getRandomValues(bytes);
  return bytesToHex(bytes);
}

/** Check if a commitment is zero (empty/unset). */
export function isZeroCommitment(hex: string): boolean {
  return hex === '' || hex === '0'.repeat(64);
}

/** Compute premium for a tier and score band. */
export function computePremium(tier: number, band: number): number {
  const base = BASE_PREMIUM[tier] ?? 0;
  const multiplier = PREMIUM_MULTIPLIER[band] ?? 1.0;
  return Math.round(base * multiplier * 100) / 100;
}

/** Get coverage limit for a tier. */
export function getCoverageLimit(tier: number): number {
  return COVERAGE_LIMIT[tier] ?? 0;
}

/** Check if a tier is allowed for a score band (holder). */
export function isTierAllowedForBand(tier: number, band: number): boolean {
  const maxTier = MAX_TIER_FOR_BAND[band] ?? TIER_CODE.T0;
  return tier <= maxTier;
}

/** Check if a tier is allowed for an agent given principal's band. */
export function isTierAllowedForAgent(tier: number, principalBand: number): boolean {
  const maxTier = AGENT_MAX_TIER_FOR_BAND[principalBand] ?? TIER_CODE.T0;
  return tier <= maxTier;
}

/** Check if EDU is required for a tier. */
export function isEduRequired(tier: number): boolean {
  return tier >= TIER_CODE.T2;
}

/** Get required module bitfield for a tier. */
export function getRequiredModules(tier: number): number {
  return REQUIRED_MODULES[tier] ?? 0;
}

/** Check if a module is in a bitfield. */
export function hasModule(moduleBits: number, moduleBit: number): boolean {
  return (moduleBits & moduleBit) !== 0;
}

/** Convert array of module names to bitfield. */
export function modulesToBits(modules: number[]): number {
  return modules.reduce((acc, m) => acc | (1 << m), 0);
}

/** Convert bitfield to array of module codes. */
export function bitsToModules(bits: number): number[] {
  const result: number[] = [];
  for (let i = 0; i < 7; i++) {
    if ((bits & (1 << i)) !== 0) {
      result.push(i);
    }
  }
  return result;
}

// =============================================================================
// Contract Client Factory
// =============================================================================

export interface SdkContext {
  network: NetworkConfig;
  addresses: ContractAddresses;
  wallet: unknown; // WalletProvider — typed when SDK is installed
}

export function createSdkContext(
  mode: 'local' | 'pre-prod',
  addresses?: Partial<ContractAddresses>
): SdkContext {
  const network = mode === 'local' ? LOCAL_CONFIG : PRE_PROD_CONFIG;
  return {
    network,
    addresses: { ...DEFAULT_ADDRESSES, ...addresses },
    wallet: null, // Set by wallet connection logic
  };
}

// =============================================================================
// PremiumPool Helpers
// =============================================================================

export class PremiumPoolClient {
  constructor(private ctx: SdkContext) {}

  async depositPremium(
    coin: unknown,
    scoreBand: number
  ): Promise<void> {
    // SDK call: PremiumPool.deposit_premium(coin, scoreBand)
    // The coin is constructed by the SDK from the holder's wallet.
    // The score band is proven off-chain via DIDz prove_score_at_least.
    throw new Error('PremiumPoolClient.depositPremium: SDK not connected — install @midnight-ntwrk/sdk');
  }

  async depositLpCapital(
    coin: unknown,
    lpCommitment: string
  ): Promise<void> {
    throw new Error('PremiumPoolClient.depositLpCapital: SDK not connected');
  }

  async authorizePayout(
    claimId: string,
    amount: bigint,
    claimantCommitment: string
  ): Promise<void> {
    // Called by adjuster after ClaimEngine.approve_claim
    throw new Error('PremiumPoolClient.authorizePayout: SDK not connected');
  }

  async releasePayout(claimId: string): Promise<unknown> {
    // Called by claimant after claim is approved
    throw new Error('PremiumPoolClient.releasePayout: SDK not connected');
  }

  async denyPayout(claimId: string, denyReasonHash: string): Promise<void> {
    throw new Error('PremiumPoolClient.denyPayout: SDK not connected');
  }

  async withdrawLpCapital(
    lpCommitment: string,
    amount: bigint
  ): Promise<unknown> {
    throw new Error('PremiumPoolClient.withdrawLpCapital: SDK not connected');
  }

  async recordLapse(): Promise<void> {
    throw new Error('PremiumPoolClient.recordLapse: SDK not connected');
  }

  // Read-only queries
  async getPoolBalance(): Promise<bigint> {
    throw new Error('PremiumPoolClient.getPoolBalance: SDK not connected');
  }

  async getTotalPremiums(): Promise<bigint> {
    throw new Error('PremiumPoolClient.getTotalPremiums: SDK not connected');
  }

  async getTotalClaimsPaid(): Promise<bigint> {
    throw new Error('PremiumPoolClient.getTotalClaimsPaid: SDK not connected');
  }

  async getActivePolicyCount(): Promise<bigint> {
    throw new Error('PremiumPoolClient.getActivePolicyCount: SDK not connected');
  }

  async getLpDeposit(lpCommitment: string): Promise<bigint> {
    throw new Error('PremiumPoolClient.getLpDeposit: SDK not connected');
  }
}

// =============================================================================
// PolicyRegistry Helpers
// =============================================================================

export class PolicyRegistryClient {
  constructor(private ctx: SdkContext) {}

  async buyPolicy(params: {
    holderCommitment: string;
    world: number;
    tier: number;
    coverageLimit: bigint;
    premium: bigint;
    scopeHash: string;
    scopeVersion: bigint;
    eduCommitment?: string;
    eduSatisfied: boolean;
    rwaCommitment?: string;
    agentGrantCommitment?: string;
    createdAt: bigint;
    expiresAt: bigint;
  }): Promise<string> {
    // Derive policy ID
    const policyId = randomCommitment(); // SDK will compute derive_policy_id

    // SDK call: PolicyRegistry.buy_policy(...)
    // Then in the same tx: PremiumPool.deposit_premium(coin, scoreBand)
    throw new Error('PolicyRegistryClient.buyPolicy: SDK not connected');
  }

  async activatePolicy(
    policyId: string,
    eduCommitment: string,
    activatedAt: bigint
  ): Promise<void> {
    // Non-delegable: holder must personally call this
    throw new Error('PolicyRegistryClient.activatePolicy: SDK not connected');
  }

  async lapsePolicy(policyId: string): Promise<void> {
    throw new Error('PolicyRegistryClient.lapsePolicy: SDK not connected');
  }

  async expirePolicy(policyId: string): Promise<void> {
    throw new Error('PolicyRegistryClient.expirePolicy: SDK not connected');
  }

  async markClaimed(policyId: string): Promise<void> {
    // Called in same tx as ClaimEngine.submit_claim
    throw new Error('PolicyRegistryClient.markClaimed: SDK not connected');
  }

  // Read-only queries
  async getPolicyStatus(policyId: string): Promise<number> {
    throw new Error('PolicyRegistryClient.getPolicyStatus: SDK not connected');
  }

  async verifyPolicyForClaim(policyId: string): Promise<number> {
    throw new Error('PolicyRegistryClient.verifyPolicyForClaim: SDK not connected');
  }

  async getCoverageLimit(policyId: string): Promise<bigint> {
    throw new Error('PolicyRegistryClient.getCoverageLimit: SDK not connected');
  }

  async getPolicyCount(): Promise<bigint> {
    throw new Error('PolicyRegistryClient.getPolicyCount: SDK not connected');
  }

  async getActiveCount(): Promise<bigint> {
    throw new Error('PolicyRegistryClient.getActiveCount: SDK not connected');
  }
}

// =============================================================================
// EduCertifier Helpers
// =============================================================================

export class EduCertifierClient {
  constructor(private ctx: SdkContext) {}

  async issueCert(params: {
    holderCommitment: string;
    issuerCommitment: string;
    moduleBits: number;
    scopeHash: string;
    scopeVersion: bigint;
    holderSignature: string;
    issuedAt: bigint;
    expiresAt: bigint;
  }): Promise<string> {
    // Non-delegable: holderSignature must be from the holder's key
    // The issuer verifies the signature off-chain before calling this
    throw new Error('EduCertifierClient.issueCert: SDK not connected');
  }

  async verifyCert(
    certId: string,
    requiredScopeHash: string,
    currentTime: bigint
  ): Promise<boolean> {
    throw new Error('EduCertifierClient.verifyCert: SDK not connected');
  }

  async verifyCertForScope(
    certId: string,
    requiredScopeHash: string,
    requiredScopeVersion: bigint,
    currentTime: bigint
  ): Promise<boolean> {
    throw new Error('EduCertifierClient.verifyCertForScope: SDK not connected');
  }

  async revokeCert(certId: string): Promise<void> {
    throw new Error('EduCertifierClient.revokeCert: SDK not connected');
  }

  async checkModules(certId: string, requiredBits: number): Promise<boolean> {
    throw new Error('EduCertifierClient.checkModules: SDK not connected');
  }

  async getCertCount(): Promise<bigint> {
    throw new Error('EduCertifierClient.getCertCount: SDK not connected');
  }

  async isCertRevoked(certId: string): Promise<boolean> {
    throw new Error('EduCertifierClient.isCertRevoked: SDK not connected');
  }
}

// =============================================================================
// ClaimEngine Helpers
// =============================================================================

export class ClaimEngineClient {
  constructor(private ctx: SdkContext) {}

  async submitClaim(params: {
    policyId: string;
    holderCommitment: string;
    eventType: number;
    descriptionHash: string;
    amount: bigint;
    lossIdentifier: string;
    submittedAt: bigint;
  }): Promise<string> {
    // SDK call: ClaimEngine.submit_claim(...)
    // Then in same tx: PolicyRegistry.mark_claimed(policyId)
    // The nullifier is computed on-chain from holder + policy + event + loss
    throw new Error('ClaimEngineClient.submitClaim: SDK not connected');
  }

  async assignAdjuster(
    claimId: string,
    adjusterCommitment: string
  ): Promise<void> {
    throw new Error('ClaimEngineClient.assignAdjuster: SDK not connected');
  }

  async submitForensicReport(
    claimId: string,
    reportHash: string
  ): Promise<void> {
    throw new Error('ClaimEngineClient.submitForensicReport: SDK not connected');
  }

  async approveClaim(
    claimId: string,
    approvedAmount: bigint,
    resolvedAt: bigint
  ): Promise<void> {
    // After approval, SDK calls PremiumPool.authorize_payout in same tx
    throw new Error('ClaimEngineClient.approveClaim: SDK not connected');
  }

  async denyClaim(
    claimId: string,
    reasonHash: string,
    resolvedAt: bigint
  ): Promise<void> {
    // After denial, SDK calls PremiumPool.deny_payout in same tx
    throw new Error('ClaimEngineClient.denyClaim: SDK not connected');
  }

  async confirmPayout(claimId: string): Promise<void> {
    // Called by holder after PremiumPool.release_payout completes
    throw new Error('ClaimEngineClient.confirmPayout: SDK not connected');
  }

  async disputeClaim(
    claimId: string,
    disputeReasonHash: string,
    currentTime: bigint
  ): Promise<void> {
    throw new Error('ClaimEngineClient.disputeClaim: SDK not connected');
  }

  async reassignDisputedClaim(
    claimId: string,
    newAdjusterCommitment: string
  ): Promise<void> {
    throw new Error('ClaimEngineClient.reassignDisputedClaim: SDK not connected');
  }

  // Read-only queries
  async getClaimStatus(claimId: string): Promise<number> {
    throw new Error('ClaimEngineClient.getClaimStatus: SDK not connected');
  }

  async getClaimCount(): Promise<bigint> {
    throw new Error('ClaimEngineClient.getClaimCount: SDK not connected');
  }

  async getPendingCount(): Promise<bigint> {
    throw new Error('ClaimEngineClient.getPendingCount: SDK not connected');
  }

  async getDisputeWindow(): Promise<bigint> {
    throw new Error('ClaimEngineClient.getDisputeWindow: SDK not connected');
  }
}

// =============================================================================
// Multi-Contract Transaction Orchestration
// =============================================================================

// These helpers show the intended SDK transaction composition for the
// key multi-contract flows. The actual implementation requires the
// @midnight-ntwrk/sdk TransactionBuilder.

export async function orchestrateBuyPolicy(
  ctx: SdkContext,
  params: {
    holderCommitment: string;
    world: number;
    tier: number;
    scopeHash: string;
    scopeVersion: bigint;
    eduCommitment?: string;
    eduSatisfied: boolean;
    rwaCommitment?: string;
    agentGrantCommitment?: string;
    scoreBand: number;
    expiresAt: bigint;
  }
): Promise<{ policyId: string; premium: number }> {
  const tier = params.tier;
  const band = params.scoreBand;

  // 1. Check tier gate
  if (!isTierAllowedForBand(tier, band)) {
    throw new Error(
      `Tier T${tier} not allowed for band ${band}. Max: T${MAX_TIER_FOR_BAND[band]}`
    );
  }

  // 2. Check EDU gate
  if (isEduRequired(tier) && !params.eduSatisfied) {
    throw new Error(`Tier T${tier} requires EDU certification (non-delegable holder signature)`);
  }

  // 3. Check everyday world requires RWAz
  if (params.world === POLICY_WORLD.EVERYDAY && !params.rwaCommitment) {
    throw new Error('Everyday world coverage requires RWAz entry commitment');
  }

  // 4. Compute premium
  const premium = computePremium(tier, band);
  const coverageLimit = getCoverageLimit(tier);

  // 5. Build transaction:
  //    a) PolicyRegistry.buy_policy(...)
  //    b) PremiumPool.deposit_premium(coin, scoreBand)
  // The SDK TransactionBuilder composes both circuit calls into one tx.
  //
  // TODO_SDK: Implement with @midnight-ntwrk/sdk TransactionBuilder
  throw new Error('orchestrateBuyPolicy: SDK not connected — install @midnight-ntwrk/sdk');
}

export async function orchestrateSubmitClaim(
  ctx: SdkContext,
  params: {
    policyId: string;
    holderCommitment: string;
    eventType: number;
    descriptionHash: string;
    amount: bigint;
    lossIdentifier: string;
    submittedAt: bigint;
  }
): Promise<{ claimId: string }> {
  // 1. Verify policy is active (off-chain via PolicyRegistry.verify_policy_for_claim)
  // 2. Build transaction:
  //    a) ClaimEngine.submit_claim(...)
  //    b) PolicyRegistry.mark_claimed(policyId)
  //
  // TODO_SDK: Implement with @midnight-ntwrk/sdk TransactionBuilder
  throw new Error('orchestrateSubmitClaim: SDK not connected');
}

export async function orchestrateApproveClaim(
  ctx: SdkContext,
  params: {
    claimId: string;
    approvedAmount: bigint;
    claimantCommitment: string;
    resolvedAt: bigint;
  }
): Promise<void> {
  // 1. Build transaction:
  //    a) ClaimEngine.approve_claim(...)
  //    b) PremiumPool.authorize_payout(claimId, amount, claimantCommitment)
  //
  // TODO_SDK: Implement with @midnight-ntwrk/sdk TransactionBuilder
  throw new Error('orchestrateApproveClaim: SDK not connected');
}

export async function orchestrateReleasePayout(
  ctx: SdkContext,
  claimId: string
): Promise<void> {
  // 1. Build transaction:
  //    a) PremiumPool.release_payout(claimId)
  //    b) ClaimEngine.confirm_payout(claimId)
  //
  // TODO_SDK: Implement with @midnight-ntwrk/sdk TransactionBuilder
  throw new Error('orchestrateReleasePayout: SDK not connected');
}
