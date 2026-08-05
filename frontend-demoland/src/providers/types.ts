// =============================================================================
// CryptoSure Provider Interfaces
// =============================================================================
// These interfaces are the CONTRACT between the UI and the backend.
// demoLand implements them with mock data (localStorage).
// realDeal implements them with Midnight SDK + DIDz + AgenticDID + ZKSplunk.
// The UI never knows which world it's in.
// =============================================================================

// --- Auth Types (demoLand 7-auth-method standard) ---

export type SignUpMethod =
  | 'email'
  | 'pgp-key'
  | 'did-wallet'
  | 'trezor'
  | 'biometric'
  | 'chrome-oauth'
  | 'brave-oauth';

export interface AuthSession {
  userId: string;
  displayName: string;
  email: string;
  avatarUrl: string;
  isAuthenticated: boolean;
  authMethod: SignUpMethod | 'demo';
  didzCommitment: string | null;   // placeholder — real DIDz commitment in realDeal
  creditScoreBand: ScoreBand | null; // placeholder — real score band in realDeal
}

export interface SignUpData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  signupMethod: SignUpMethod;
  // CryptoSure-specific profile fields
  coverageType: 'wallet' | 'everyday' | 'gaming';
  walletAddress?: string;
  pgpFingerprint?: string;
  didUri?: string;
  oauthProvider?: string;
  trezorPublicKey?: string;
  biometricType?: string;
}

export interface IAuthProvider {
  login(method: SignUpMethod, email?: string, password?: string): Promise<AuthSession>;
  signup(data: SignUpData): Promise<AuthSession>;
  logout(): Promise<void>;
  getSession(): AuthSession | null;
  isAuthenticated(): boolean;
  listSignedUpUsers(): SignUpData[];
}

// --- Credit Score Types ---

export type ScoreBand = 'A' | 'B' | 'C' | 'D' | 'unrated';

export interface CreditScoreInfo {
  band: ScoreBand;
  scoreEstimate: number;       // 0-1000 (demo only; real score never revealed)
  maxTier: TierCode;
  premiumMultiplier: number;   // e.g. 0.6 for band A
  lastUpdated: string;
}

export interface ICreditScoreProvider {
  getScoreBand(): Promise<ScoreBand>;
  getScoreInfo(): Promise<CreditScoreInfo>;
  // TODO_REALDEAL: Wire to DIDz prove_score_at_least ZK circuit
  // The real provider calls the DIDz scoring oracle attestation
  // and proves the band in ZK — score value never leaves the prover.
}

// --- Policy Types ---

export type TierCode = 'T0' | 'T1' | 'T2' | 'T3' | 'T4' | 'T5';

export const TIER_COVERAGE: Record<TierCode, number> = {
  T0: 500,
  T1: 1000,
  T2: 5000,
  T3: 10000,
  T4: 25000,
  T5: 50000,
};

export const TIER_EDU_REQUIRED: Record<TierCode, boolean> = {
  T0: false,
  T1: false,
  T2: true,
  T3: true,
  T4: true,
  T5: true,
};

export type PolicyStatus = 'pending' | 'active' | 'lapsed' | 'claimed' | 'expired';

export type PolicyWorld = 'wallet' | 'everyday' | 'gaming';

export interface Policy {
  id: string;
  holderDidCommitment: string;
  world: PolicyWorld;
  tier: TierCode;
  coverageLimit: number;
  premium: number;
  status: PolicyStatus;
  scopeHash: string;
  scopeVersion: number;
  eduRequired: boolean;
  eduSatisfied: boolean;
  eduCommitment: string | null;
  createdAt: string;
  activatedAt: string | null;
  expiresAt: string;
}

export interface BuyPolicyParams {
  world: PolicyWorld;
  tier: TierCode;
  scopeHash: string;
  eduCommitment?: string;
}

export interface IPolicyProvider {
  listPolicies(): Promise<Policy[]>;
  getPolicy(policyId: string): Promise<Policy>;
  buyPolicy(params: BuyPolicyParams): Promise<Policy>;
  activatePolicy(policyId: string, eduProof: string): Promise<Policy>;
  lapsePolicy(policyId: string): Promise<Policy>;
  // TODO_REALDEAL: Wire to PolicyRegistry.compact on Midnight
  // TODO_DIDZ: buyPolicy accepts a ZK proof of DIDz credit-score band
  // TODO_AGENTICDID: If agent-initiated, accept scoped grant proof
}

// --- Claim Types ---

export type ClaimStatus = 'submitted' | 'under_review' | 'approved' | 'denied' | 'paid';

export type ClaimEvent =
  | 'theft_covered_vector'
  | 'custodial_failure'
  | 'device_loss'
  | 'recovery_failure'
  | 'gaming_asset_destruction'
  | 'gaming_asset_theft';

export interface Claim {
  id: string;
  policyId: string;
  status: ClaimStatus;
  event: ClaimEvent;
  description: string;
  amount: number;
  submittedAt: string;
  resolvedAt: string | null;
  denyReason: string | null;
  forensicReportHash: string | null;
  adjusterId: string | null;
}

export interface SubmitClaimParams {
  policyId: string;
  event: ClaimEvent;
  description: string;
  amount: number;
}

export interface IClaimProvider {
  listClaims(): Promise<Claim[]>;
  getClaim(claimId: string): Promise<Claim>;
  submitClaim(params: SubmitClaimParams): Promise<Claim>;
  resolveClaim(claimId: string, approve: boolean, reason?: string): Promise<Claim>;
  // TODO_REALDEAL: Wire to ClaimEngine.compact on Midnight
  // TODO_FORENSIC: Integrate Chainalysis/TRM/Elliptic for theft claims
  // TODO_ZKSPLUNK: Log claim events to ZKSplunk for attestation
}

// --- EDU Certification Types ---

export type EduModule =
  | 'wallet_hygiene'
  | 'seed_custody'
  | 'phishing_awareness'
  | 'hardware_wallet'
  | 'recovery_planning'
  | 'scope_review'
  | 'gaming_asset_safety';

export interface EduCert {
  id: string;
  holderDidCommitment: string;
  issuerId: string;
  issuerName: string;
  modules: EduModule[];
  scopeHash: string;
  scopeVersion: number;
  holderSignature: string | null;  // non-delegable holder signature
  issuedAt: string;
  expiresAt: string | null;
}

export interface EduModuleInfo {
  id: EduModule;
  title: string;
  description: string;
  estimatedTime: string;
  requiredFor: TierCode[];
}

export interface IEduProvider {
  getCert(): Promise<EduCert | null>;
  getCertifications(): Promise<EduCert[]>;
  issueCert(modules: EduModule[], scopeHash: string, holderSignature: string): Promise<EduCert>;
  issueCertById(moduleId: EduModule): Promise<EduCert>;
  verifyCertForScope(scopeHash: string): Promise<boolean>;
  listModules(): Promise<EduModuleInfo[]>;
  // TODO_REALDEAL: Wire to EduCertifier.compact on Midnight
  // TODO_DIDZ: Issuer approval via DIDz TrustedIssuerRegistry
}

// --- Premium Pool Types ---

export interface PoolStats {
  totalBalance: number;
  totalPolicies: number;
  activePolicies: number;
  totalPremiumsCollected: number;
  totalClaimsPaid: number;
  pendingClaims: number;
  lastPayoutAt: string | null;
  reserveRatio: number; // pool balance / total active coverage
}

export interface IPoolProvider {
  getStats(): Promise<PoolStats>;
  getHistory(): Promise<PoolEvent[]>;
  getEvents(): Promise<PoolEvent[]>; // alias for getHistory
  // TODO_REALDEAL: Wire to PremiumPool.compact on Midnight
  // TODO_ZKSPLUNK: Monitor pool health via SplunkForwarder
}

export type PoolEventType = 'premium_in' | 'claim_paid' | 'claim_denied' | 'reserve_adjustment';

export interface PoolEvent {
  id: string;
  type: PoolEventType;
  amount: number;
  policyId: string | null;
  claimId: string | null;
  timestamp: string;
  txHash: string; // simulated in demoLand, real on-chain in realDeal
}

// --- DIDz Placeholder Types ---

export interface DidzIdentity {
  commitment: string;
  registeredAt: string;
  // TODO_REALDEAL: Wire to DIDzRegistry.compact
  // Real identity stays as a commitment — never revealed on-chain
}

export interface IDidzProvider {
  getIdentity(): Promise<DidzIdentity | null>;
  registerIdentity(): Promise<DidzIdentity>;
  // PLACEHOLDER: In realDeal, this connects to DIDz.io's DIDzRegistry
  // The identity is a non-transferable registry entry (not an NFT)
  // Credit score attestation comes from the DIDz scoring oracle
}

// --- AgenticDID Placeholder Types ---

export interface AgentGrant {
  agentId: string;
  perActionCap: number;
  cumulativeCap: number;
  remaining: number;
  maxTierByBand: TierCode | null;
  // TODO_REALDEAL: Wire to AgenticDID scoped grants
  // per_action_cap AND cumulative_cap both enforced on-chain
  // Score-scaled caps: tier ceiling = f(principal score band)
}

export interface IAgenticDIDProvider {
  getGrant(): Promise<AgentGrant | null>;
  createGrant(agentId: string, perActionCap: number, cumulativeCap: number): Promise<AgentGrant>;
  // PLACEHOLDER: In realDeal, this connects to AgenticDID's grant system
  // Non-delegable EDU signature is enforced by EduCertifier, not here
}

// --- AI Assistant Types (future integration) ---

export interface AIAssistantMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface AIAssistantContext {
  currentPolicy: Policy | null;
  currentClaim: Claim | null;
  creditScoreBand: ScoreBand | null;
  poolStats: PoolStats | null;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface IAIAssistantProvider {
  chat(messages: ChatMessage[]): Promise<{ response: string }>;
  suggestCoverage(profile: { world: PolicyWorld; scoreBand: ScoreBand }): Promise<string>;
  preScreenClaim(description: string, event: ClaimEvent): Promise<{ likely: boolean; reason: string }>;
  // TODO_AI: Future AI integration — see docs/AI_INTEGRATION.md
  // Phase 1: Rule-based claim pre-screening
  // Phase 2: LLM-powered coverage recommendations
  // Phase 3: Full conversational assistant
}

// --- Synthetic Insurance Laboratory Types ---

export type InsuranceLabDecision =
  | 'illustrative-accept'
  | 'illustrative-accept-with-conditions'
  | 'illustrative-refer';

export type InsuranceLabScenarioId =
  | 'baseline'
  | 'wallet-theft-surge'
  | 'custodian-outage';

export interface InsuranceLabMetadata {
  datasetId: string;
  version: string;
  generatedAt: string;
  asOfDate: string;
  source: string;
  purpose: string;
  containsRealPeople: boolean;
  containsRealPolicies: boolean;
  containsRealClaims: boolean;
  externalAffiliations: string[];
  disclaimer: string;
}

export interface SyntheticRiskSubmission {
  id: string;
  applicantAlias: string;
  world: PolicyWorld;
  territory: string;
  requestedLimit: number;
  custodyModel: string;
  securityScoreBand: ScoreBand;
  evidenceCompleteness: number;
  zeroKnowledgeProofState: string;
  riskSignals: string[];
  decision: InsuranceLabDecision;
  annualPremiumIndication: number | null;
}

export interface SyntheticPolicyRecord {
  id: string;
  riskSubmissionId: string;
  world: PolicyWorld;
  territory: string;
  coverageLimit: number;
  writtenPremium: number;
  earnedPremium: number;
  status: 'active' | 'expired' | 'cancelled';
  inceptionDate: string;
  expiryDate: string;
}

export interface SyntheticClaimRecord {
  id: string;
  policyId: string;
  event: ClaimEvent;
  status: ClaimStatus;
  amountClaimed: number;
  incurredAmount: number;
  paidAmount: number;
  reserveAmount: number;
  submittedAt: string;
  lastUpdatedAt: string;
  evidenceStage: string;
}

export interface SyntheticReserveSnapshot {
  asOfDate: string;
  availableCapital: number;
  openClaimReserve: number;
  activeExposure: number;
  capitalToActiveExposureRatio: number;
}

export interface InsuranceLabDataset {
  metadata: InsuranceLabMetadata;
  riskSubmissions: SyntheticRiskSubmission[];
  policies: SyntheticPolicyRecord[];
  claims: SyntheticClaimRecord[];
  reserveSnapshots: SyntheticReserveSnapshot[];
}

export interface InsuranceLabSummary {
  scenarioId: InsuranceLabScenarioId;
  scenarioLabel: string;
  scenarioDescription: string;
  totalWrittenPremium: number;
  totalEarnedPremium: number;
  totalActiveExposure: number;
  totalIncurredLosses: number;
  openClaimReserve: number;
  availableCapital: number;
  illustrativeLossRatio: number;
  capitalToActiveExposureRatio: number;
  averageEvidenceCompleteness: number;
  acceptedRiskCount: number;
  referredRiskCount: number;
}

export interface InsuranceMarketAdapterStatus {
  adapterId: string;
  displayName: string;
  connectionState: 'connected-synthetic' | 'not-configured' | 'approved-sandbox' | 'production';
  dataClassification: string;
  capabilities: string[];
  requiredConfiguration: string[];
  disclaimer: string;
}

export interface IInsuranceLabProvider {
  getDataset(): Promise<InsuranceLabDataset>;
  runScenario(scenarioId: InsuranceLabScenarioId): Promise<InsuranceLabSummary>;
  getAdapterStatuses(): Promise<InsuranceMarketAdapterStatus[]>;
  // A future external adapter must remain product-specific, access-controlled,
  // and fail closed until its credentials, terms, and evidence class are known.
}

// --- Master Provider Bundle ---

export interface Providers {
  auth: IAuthProvider;
  creditScore: ICreditScoreProvider;
  policies: IPolicyProvider;
  claims: IClaimProvider;
  edu: IEduProvider;
  pool: IPoolProvider;
  didz: IDidzProvider;
  agenticDID: IAgenticDIDProvider;
  ai: IAIAssistantProvider;
  insuranceLab: IInsuranceLabProvider;
}

export type CSMode = 'demoland' | 'realdeal';
