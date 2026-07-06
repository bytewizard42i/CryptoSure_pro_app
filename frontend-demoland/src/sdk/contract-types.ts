// =============================================================================
// CryptoSure — Midnight SDK Contract Types
// =============================================================================
// These types mirror the Compact contract structs and enums exactly.
// They are the bridge between the TypeScript frontend and the on-chain
// circuits. The Midnight SDK generates similar types from compiled contracts,
// but we define them here for clarity and for use before the contracts are
// compiled with full ZK keys.
//
// COMPILER: compactc v0.31.x, language 0.23
// PRAGMA: >= 0.16 && <= 0.23
// =============================================================================

// --- PremiumPool Enums ---

export const SCORE_BAND = {
  A: 0,
  B: 1,
  C: 2,
  D: 3,
  UNRATED: 4,
} as const;

export type ScoreBandCode = typeof SCORE_BAND[keyof typeof SCORE_BAND];

// --- PolicyRegistry Enums ---

export const POLICY_WORLD = {
  WALLET: 0,
  EVERYDAY: 1,
  GAMING: 2,
} as const;

export type PolicyWorldCode = typeof POLICY_WORLD[keyof typeof POLICY_WORLD];

export const TIER_CODE = {
  T0: 0,
  T1: 1,
  T2: 2,
  T3: 3,
  T4: 4,
  T5: 5,
} as const;

export type TierCodeNum = typeof TIER_CODE[keyof typeof TIER_CODE];

export const POLICY_STATUS = {
  PENDING: 0,
  ACTIVE: 1,
  LAPSED: 2,
  EXPIRED: 3,
  CLAIMED: 4,
} as const;

export type PolicyStatusCode = typeof POLICY_STATUS[keyof typeof POLICY_STATUS];

// --- ClaimEngine Enums ---

export const CLAIM_STATUS = {
  SUBMITTED: 0,
  UNDER_REVIEW: 1,
  APPROVED: 2,
  DENIED: 3,
  PAID: 4,
  DISPUTED: 5,
} as const;

export type ClaimStatusCode = typeof CLAIM_STATUS[keyof typeof CLAIM_STATUS];

export const CLAIM_EVENT = {
  THEFT: 0,
  DEVICE_LOSS: 1,
  PHISHING: 2,
  HARDWARE_FAILURE: 3,
  GAMING_LOSS: 4,
  SMART_CONTRACT: 5,
} as const;

export type ClaimEventCode = typeof CLAIM_EVENT[keyof typeof CLAIM_EVENT];

// --- EduCertifier Enums ---

export const EDU_MODULE = {
  WALLET_HYGIENE: 0,
  SEED_CUSTODY: 1,
  PHISHING_AWARENESS: 2,
  HARDWARE_WALLET: 3,
  RECOVERY_PLANNING: 4,
  SCOPE_REVIEW: 5,
  GAMING_ASSET_SAFETY: 6,
} as const;

export type EduModuleCode = typeof EDU_MODULE[keyof typeof EDU_MODULE];

// EDU module bitfield helpers
export const EDU_MODULE_BITS = {
  WALLET_HYGIENE: 1 << EDU_MODULE.WALLET_HYGIENE,
  SEED_CUSTODY: 1 << EDU_MODULE.SEED_CUSTODY,
  PHISHING_AWARENESS: 1 << EDU_MODULE.PHISHING_AWARENESS,
  HARDWARE_WALLET: 1 << EDU_MODULE.HARDWARE_WALLET,
  RECOVERY_PLANNING: 1 << EDU_MODULE.RECOVERY_PLANNING,
  SCOPE_REVIEW: 1 << EDU_MODULE.SCOPE_REVIEW,
  GAMING_ASSET_SAFETY: 1 << EDU_MODULE.GAMING_ASSET_SAFETY,
} as const;

// Required module bitfields per tier
export const REQUIRED_MODULES: Record<number, number> = {
  [TIER_CODE.T0]: 0,
  [TIER_CODE.T1]: 0,
  [TIER_CODE.T2]:
    EDU_MODULE_BITS.WALLET_HYGIENE |
    EDU_MODULE_BITS.SEED_CUSTODY |
    EDU_MODULE_BITS.PHISHING_AWARENESS |
    EDU_MODULE_BITS.SCOPE_REVIEW,
  [TIER_CODE.T3]:
    EDU_MODULE_BITS.WALLET_HYGIENE |
    EDU_MODULE_BITS.SEED_CUSTODY |
    EDU_MODULE_BITS.PHISHING_AWARENESS |
    EDU_MODULE_BITS.HARDWARE_WALLET |
    EDU_MODULE_BITS.RECOVERY_PLANNING |
    EDU_MODULE_BITS.SCOPE_REVIEW,
  [TIER_CODE.T4]:
    EDU_MODULE_BITS.WALLET_HYGIENE |
    EDU_MODULE_BITS.SEED_CUSTODY |
    EDU_MODULE_BITS.PHISHING_AWARENESS |
    EDU_MODULE_BITS.HARDWARE_WALLET |
    EDU_MODULE_BITS.RECOVERY_PLANNING |
    EDU_MODULE_BITS.SCOPE_REVIEW,
  [TIER_CODE.T5]:
    EDU_MODULE_BITS.WALLET_HYGIENE |
    EDU_MODULE_BITS.SEED_CUSTODY |
    EDU_MODULE_BITS.PHISHING_AWARENESS |
    EDU_MODULE_BITS.HARDWARE_WALLET |
    EDU_MODULE_BITS.RECOVERY_PLANNING |
    EDU_MODULE_BITS.SCOPE_REVIEW,
};

// --- Tier Gate Logic ---

export const MAX_TIER_FOR_BAND: Record<number, number> = {
  [SCORE_BAND.A]: TIER_CODE.T5,       // Band A → max T5 ($50,000)
  [SCORE_BAND.B]: TIER_CODE.T4,       // Band B → max T4 ($25,000)
  [SCORE_BAND.C]: TIER_CODE.T2,       // Band C → max T2 ($5,000)
  [SCORE_BAND.D]: TIER_CODE.T1,       // Band D → max T1 ($1,000)
  [SCORE_BAND.UNRATED]: TIER_CODE.T0, // Unrated → max T0 ($500)
};

// Agent max tier by principal band (more restrictive)
export const AGENT_MAX_TIER_FOR_BAND: Record<number, number> = {
  [SCORE_BAND.A]: TIER_CODE.T5,       // Band A → agent max T5
  [SCORE_BAND.B]: TIER_CODE.T3,       // Band B → agent max T3 (not T4)
  [SCORE_BAND.C]: TIER_CODE.T2,       // Band C → agent max T2
  [SCORE_BAND.D]: TIER_CODE.T1,       // Band D → agent max T1
  [SCORE_BAND.UNRATED]: TIER_CODE.T0, // Unrated → agent max T0
};

// --- Premium Multiplier Table ---

export const PREMIUM_MULTIPLIER: Record<number, number> = {
  [SCORE_BAND.A]: 0.6,       // Band A: 0.6×
  [SCORE_BAND.B]: 0.8,       // Band B: 0.8×
  [SCORE_BAND.C]: 1.0,       // Band C: 1.0×
  [SCORE_BAND.D]: 1.5,       // Band D: 1.5×
  [SCORE_BAND.UNRATED]: 2.0, // Unrated: 2.0×
};

// Base premiums by tier (monthly, in USD)
export const BASE_PREMIUM: Record<number, number> = {
  [TIER_CODE.T0]: 10,
  [TIER_CODE.T1]: 20,
  [TIER_CODE.T2]: 50,
  [TIER_CODE.T3]: 80,
  [TIER_CODE.T4]: 150,
  [TIER_CODE.T5]: 300,
};

// Coverage limits by tier (in USD)
export const COVERAGE_LIMIT: Record<number, number> = {
  [TIER_CODE.T0]: 500,
  [TIER_CODE.T1]: 1000,
  [TIER_CODE.T2]: 5000,
  [TIER_CODE.T3]: 10000,
  [TIER_CODE.T4]: 25000,
  [TIER_CODE.T5]: 50000,
};

// --- Compact Struct Mirrors (for SDK deserialization) ---

export interface PolicyRecord {
  holderCommitment: string;      // hex Bytes<32>
  world: number;                 // PolicyWorldCode
  tier: number;                  // TierCodeNum
  coverageLimit: bigint;         // Uint<128>
  premium: bigint;               // Uint<128>
  status: number;                // PolicyStatusCode
  scopeHash: string;             // hex Bytes<32>
  scopeVersion: bigint;          // Uint<64>
  eduRequired: boolean;
  eduSatisfied: boolean;
  eduCommitment: string;         // hex Bytes<32> (zero if N/A)
  rwaCommitment: string;         // hex Bytes<32> (zero if N/A)
  agentGrantCommitment: string;  // hex Bytes<32> (zero if N/A)
  createdAt: bigint;             // Uint<64>
  activatedAt: bigint;           // Uint<64>
  expiresAt: bigint;             // Uint<64>
}

export interface CertRecord {
  holderCommitment: string;
  issuerCommitment: string;
  moduleBits: number;            // Uint<32> bitfield
  scopeHash: string;
  scopeVersion: bigint;
  holderSignature: string;       // hex Bytes<64>
  issuedAt: bigint;
  expiresAt: bigint;             // 0 = never
  revoked: boolean;
}

export interface ClaimRecord {
  policyId: string;
  holderCommitment: string;
  status: number;                // ClaimStatusCode
  eventType: number;             // ClaimEventCode
  descriptionHash: string;
  amount: bigint;                // Uint<128>
  submittedAt: bigint;
  resolvedAt: bigint;            // 0 if pending
  denyReasonHash: string;        // zero if approved
  forensicReportHash: string;    // zero if N/A
  adjusterCommitment: string;    // zero if unassigned
  nullifier: string;             // anti-double-claim
}

// --- Contract Addresses (populated after deployment) ---

export interface ContractAddresses {
  premiumPool: string;
  policyRegistry: string;
  eduCertifier: string;
  claimEngine: string;
}

// Default: empty — set after local/pre-prod deployment
export const DEFAULT_ADDRESSES: ContractAddresses = {
  premiumPool: '',
  policyRegistry: '',
  eduCertifier: '',
  claimEngine: '',
};

// --- Network Configuration ---

export interface NetworkConfig {
  networkId: string;
  nodeUrl: string;
  indexerUrl: string;
  proofServerUrl: string;
}

// Local dev (midnight-local-dev)
export const LOCAL_CONFIG: NetworkConfig = {
  networkId: 'Undeployed',
  nodeUrl: 'http://localhost:6875',
  indexerUrl: 'http://localhost:6877',
  proofServerUrl: 'http://localhost:6879',
};

// Pre-prod testnet (skip preview per house convention)
export const PRE_PROD_CONFIG: NetworkConfig = {
  networkId: 'Pre-prod',
  nodeUrl: 'https://preprod.midnight.network',
  indexerUrl: 'https://preprod-indexer.midnight.network',
  proofServerUrl: 'https://preprod-proof.midnight.network',
};
