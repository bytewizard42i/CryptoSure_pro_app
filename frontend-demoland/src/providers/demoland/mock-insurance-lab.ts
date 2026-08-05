import syntheticDatasetJson from '../../fixtures/cryptosure-insurance-lab.v1.json';
import type {
  IInsuranceLabProvider,
  InsuranceLabDataset,
  InsuranceLabScenarioId,
  InsuranceLabSummary,
  InsuranceMarketAdapterStatus,
} from '../types';

const EXPECTED_DATASET_ID = 'cryptosure-synthetic-insurance-lab-v1';

const SCENARIO_ASSUMPTIONS: Record<
  InsuranceLabScenarioId,
  {
    label: string;
    description: string;
    additionalIncurredLosses: number;
    additionalOpenReserve: number;
    capitalImpact: number;
  }
> = {
  baseline: {
    label: 'Observed synthetic baseline',
    description: 'Uses only the fictional policies, claims, and reserve snapshot in this dataset.',
    additionalIncurredLosses: 0,
    additionalOpenReserve: 0,
    capitalImpact: 0,
  },
  'wallet-theft-surge': {
    label: 'Coordinated wallet theft surge',
    description: 'Adds a fictional cluster of wallet theft losses to test concentration and reserve pressure.',
    additionalIncurredLosses: 145_000,
    additionalOpenReserve: 110_000,
    capitalImpact: 35_000,
  },
  'custodian-outage': {
    label: 'Custodian outage concentration',
    description: 'Adds a fictional correlated custodian event to expose aggregation risk across policyholders.',
    additionalIncurredLosses: 420_000,
    additionalOpenReserve: 325_000,
    capitalImpact: 150_000,
  },
};

function delay(milliseconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

function cloneDataset(dataset: InsuranceLabDataset): InsuranceLabDataset {
  return JSON.parse(JSON.stringify(dataset)) as InsuranceLabDataset;
}

function roundRatio(value: number): number {
  return Math.round(value * 10_000) / 10_000;
}

function validateSyntheticDataset(dataset: InsuranceLabDataset): void {
  if (dataset.metadata.datasetId !== EXPECTED_DATASET_ID) {
    throw new Error('DemoLand insurance laboratory rejected an unexpected dataset.');
  }

  if (
    dataset.metadata.containsRealPeople ||
    dataset.metadata.containsRealPolicies ||
    dataset.metadata.containsRealClaims ||
    dataset.metadata.externalAffiliations.length > 0
  ) {
    throw new Error('DemoLand insurance laboratory accepts synthetic, unaffiliated data only.');
  }

  const riskIds = new Set(dataset.riskSubmissions.map((risk) => risk.id));
  const policyIds = new Set(dataset.policies.map((policy) => policy.id));

  if (dataset.policies.some((policy) => !riskIds.has(policy.riskSubmissionId))) {
    throw new Error('Synthetic policy references an unknown risk submission.');
  }

  if (dataset.claims.some((claim) => !policyIds.has(claim.policyId))) {
    throw new Error('Synthetic claim references an unknown policy.');
  }
}

const SYNTHETIC_DATASET = syntheticDatasetJson as InsuranceLabDataset;
validateSyntheticDataset(SYNTHETIC_DATASET);

function calculateScenarioSummary(
  dataset: InsuranceLabDataset,
  scenarioId: InsuranceLabScenarioId,
): InsuranceLabSummary {
  const scenario = SCENARIO_ASSUMPTIONS[scenarioId];
  const latestReserveSnapshot = dataset.reserveSnapshots.at(-1);

  if (!latestReserveSnapshot) {
    throw new Error('Synthetic insurance laboratory requires at least one reserve snapshot.');
  }

  const totalWrittenPremium = dataset.policies.reduce(
    (total, policy) => total + policy.writtenPremium,
    0,
  );
  const totalEarnedPremium = dataset.policies.reduce(
    (total, policy) => total + policy.earnedPremium,
    0,
  );
  const baselineIncurredLosses = dataset.claims.reduce(
    (total, claim) => total + claim.incurredAmount,
    0,
  );
  const totalIncurredLosses = baselineIncurredLosses + scenario.additionalIncurredLosses;
  const openClaimReserve = latestReserveSnapshot.openClaimReserve + scenario.additionalOpenReserve;
  const availableCapital = Math.max(
    latestReserveSnapshot.availableCapital - scenario.capitalImpact,
    0,
  );
  const averageEvidenceCompleteness = dataset.riskSubmissions.reduce(
    (total, risk) => total + risk.evidenceCompleteness,
    0,
  ) / dataset.riskSubmissions.length;

  return {
    scenarioId,
    scenarioLabel: scenario.label,
    scenarioDescription: scenario.description,
    totalWrittenPremium,
    totalEarnedPremium,
    totalActiveExposure: latestReserveSnapshot.activeExposure,
    totalIncurredLosses,
    openClaimReserve,
    availableCapital,
    illustrativeLossRatio: roundRatio(totalIncurredLosses / totalEarnedPremium),
    capitalToActiveExposureRatio: roundRatio(
      availableCapital / latestReserveSnapshot.activeExposure,
    ),
    averageEvidenceCompleteness: roundRatio(averageEvidenceCompleteness),
    acceptedRiskCount: dataset.riskSubmissions.filter(
      (risk) => risk.decision !== 'illustrative-refer',
    ).length,
    referredRiskCount: dataset.riskSubmissions.filter(
      (risk) => risk.decision === 'illustrative-refer',
    ).length,
  };
}

const ADAPTER_STATUSES: InsuranceMarketAdapterStatus[] = [
  {
    adapterId: 'cryptosure-synthetic-v1',
    displayName: 'CryptoSure Synthetic Laboratory',
    connectionState: 'connected-synthetic',
    dataClassification: 'Entirely fictional and safe for DemoLand experimentation',
    capabilities: [
      'risk submissions',
      'policy bordereau',
      'claim bordereau',
      'reserve snapshots',
      'deterministic stress scenarios',
    ],
    requiredConfiguration: [],
    disclaimer: 'This adapter never contacts an insurer, broker, wallet, chain, or external service.',
  },
  {
    adapterId: 'lloyds-market-api-boundary',
    displayName: "Lloyd's Market API boundary",
    connectionState: 'not-configured',
    dataClassification: 'External controlled-access data, product-specific terms required',
    capabilities: ['API product discovery', 'reference-data mapping', 'future approved sandbox ingestion'],
    requiredConfiguration: [
      "approved Lloyd's API Platform account",
      'active product subscription and subscription key',
      'confirmed product terms, field mappings, and permitted evidence class',
    ],
    disclaimer: "No Lloyd's API, data, credential, endorsement, or commercial relationship is connected.",
  },
];

export class MockInsuranceLabProvider implements IInsuranceLabProvider {
  async getDataset(): Promise<InsuranceLabDataset> {
    await delay(250);
    return cloneDataset(SYNTHETIC_DATASET);
  }

  async runScenario(scenarioId: InsuranceLabScenarioId): Promise<InsuranceLabSummary> {
    await delay(180);
    return calculateScenarioSummary(SYNTHETIC_DATASET, scenarioId);
  }

  async getAdapterStatuses(): Promise<InsuranceMarketAdapterStatus[]> {
    await delay(120);
    return ADAPTER_STATUSES.map((adapter) => ({
      ...adapter,
      capabilities: [...adapter.capabilities],
      requiredConfiguration: [...adapter.requiredConfiguration],
    }));
  }
}
