import type {
  IInsuranceLabProvider,
  InsuranceLabDataset,
  InsuranceLabScenarioId,
  InsuranceLabSummary,
  InsuranceMarketAdapterStatus,
} from '../types';

const NOT_CONFIGURED_MESSAGE =
  "RealDeal insurance data adapter is not configured. Approved product access, terms, credentials, field mappings, and evidence classification are required before external data can be loaded.";

const EXTERNAL_ADAPTER_STATUS: InsuranceMarketAdapterStatus = {
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
};

// This is intentionally a narrow, fail-closed seam. It does not guess an API
// shape, ship a placeholder credential, or silently substitute synthetic data
// in RealDeal. A product-specific adapter can implement this provider only
// after access and permitted uses have been confirmed with the data owner.
export function createRealInsuranceLabProvider(): IInsuranceLabProvider {
  return {
    async getDataset(): Promise<InsuranceLabDataset> {
      throw new Error(NOT_CONFIGURED_MESSAGE);
    },

    async runScenario(_scenarioId: InsuranceLabScenarioId): Promise<InsuranceLabSummary> {
      throw new Error(NOT_CONFIGURED_MESSAGE);
    },

    async getAdapterStatuses(): Promise<InsuranceMarketAdapterStatus[]> {
      return [
        {
          ...EXTERNAL_ADAPTER_STATUS,
          capabilities: [...EXTERNAL_ADAPTER_STATUS.capabilities],
          requiredConfiguration: [...EXTERNAL_ADAPTER_STATUS.requiredConfiguration],
        },
      ];
    },
  };
}
