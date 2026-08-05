import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const projectRoot = fileURLToPath(new URL('../', import.meta.url));
const datasetPath = path.join(
  projectRoot,
  'src',
  'fixtures',
  'cryptosure-insurance-lab.v1.json',
);

async function readDataset() {
  return JSON.parse(await readFile(datasetPath, 'utf8'));
}

function assertUniqueIds(records, recordType) {
  const ids = records.map((record) => record.id);
  assert.equal(
    new Set(ids).size,
    ids.length,
    `${recordType} identifiers must be unique`,
  );
}

test('the laboratory dataset is explicitly synthetic and unaffiliated', async () => {
  const dataset = await readDataset();

  assert.equal(dataset.metadata.datasetId, 'cryptosure-synthetic-insurance-lab-v1');
  assert.equal(dataset.metadata.containsRealPeople, false);
  assert.equal(dataset.metadata.containsRealPolicies, false);
  assert.equal(dataset.metadata.containsRealClaims, false);
  assert.deepEqual(dataset.metadata.externalAffiliations, []);
  assert.match(dataset.metadata.disclaimer, /entirely fictional/i);
  assert.match(dataset.metadata.disclaimer, /not supplied, reviewed, or endorsed by Lloyd's/i);
  assert.match(dataset.metadata.disclaimer, /not actuarial advice/i);
});

test('synthetic identifiers are unique and references are complete', async () => {
  const dataset = await readDataset();
  assertUniqueIds(dataset.riskSubmissions, 'risk submission');
  assertUniqueIds(dataset.policies, 'policy');
  assertUniqueIds(dataset.claims, 'claim');

  const riskIds = new Set(dataset.riskSubmissions.map((risk) => risk.id));
  const policyIds = new Set(dataset.policies.map((policy) => policy.id));

  for (const policy of dataset.policies) {
    assert.ok(riskIds.has(policy.riskSubmissionId), `${policy.id} has an unknown risk reference`);
  }

  for (const claim of dataset.claims) {
    assert.ok(policyIds.has(claim.policyId), `${claim.id} has an unknown policy reference`);
  }
});

test('financial fixture values are finite, non-negative, and internally bounded', async () => {
  const dataset = await readDataset();
  const policyById = new Map(dataset.policies.map((policy) => [policy.id, policy]));

  for (const policy of dataset.policies) {
    for (const field of ['coverageLimit', 'writtenPremium', 'earnedPremium']) {
      assert.ok(Number.isFinite(policy[field]) && policy[field] >= 0, `${policy.id}.${field} is invalid`);
    }
    assert.ok(policy.earnedPremium <= policy.writtenPremium, `${policy.id} earned premium exceeds written premium`);
  }

  for (const claim of dataset.claims) {
    const policy = policyById.get(claim.policyId);
    assert.ok(policy, `${claim.id} policy is unavailable`);
    assert.ok(claim.amountClaimed <= policy.coverageLimit, `${claim.id} exceeds the fictional coverage limit`);
    assert.ok(claim.paidAmount <= claim.incurredAmount, `${claim.id} paid amount exceeds incurred amount`);
    assert.ok(claim.reserveAmount <= claim.incurredAmount, `${claim.id} reserve exceeds incurred amount`);
  }
});

test('risk fixtures contain aliases and evidence, not contact or wallet identifiers', async () => {
  const dataset = await readDataset();

  for (const risk of dataset.riskSubmissions) {
    assert.doesNotMatch(risk.applicantAlias, /@|0x[a-f0-9]{20,}/i);
    assert.ok(risk.riskSignals.length >= 2, `${risk.id} needs multiple synthetic risk signals`);
    assert.ok(
      risk.evidenceCompleteness >= 0 && risk.evidenceCompleteness <= 1,
      `${risk.id} evidence completeness must be a ratio`,
    );
  }
});

test('DemoLand exposes the laboratory while RealDeal remains fail closed', async () => {
  const demoProviderSource = await readFile(
    path.join(projectRoot, 'src', 'providers', 'demoland', 'mock-insurance-lab.ts'),
    'utf8',
  );
  const realProviderSource = await readFile(
    path.join(projectRoot, 'src', 'providers', 'realdeal', 'insurance-lab.ts'),
    'utf8',
  );

  assert.match(demoProviderSource, /cryptosure-insurance-lab\.v1\.json/);
  assert.match(demoProviderSource, /wallet-theft-surge/);
  assert.match(demoProviderSource, /custodian-outage/);
  assert.match(realProviderSource, /not configured/i);
  assert.match(realProviderSource, /approved product access/i);
  assert.doesNotMatch(realProviderSource, /syntheticDatasetJson|MockInsuranceLabProvider/);
});

test('the shared laboratory page uses only the provider contract', async () => {
  const pageSource = await readFile(
    path.join(projectRoot, 'src', 'pages', 'lab', 'index.tsx'),
    'utf8',
  );

  assert.match(pageSource, /providers\.insuranceLab/);
  assert.match(pageSource, /No real insurance data/);
  assert.match(pageSource, /not a catastrophe model or an actuarial forecast/i);
  assert.doesNotMatch(pageSource, /providers\/(?:demoland|realdeal)/);
});
