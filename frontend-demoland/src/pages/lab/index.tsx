import { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  CircleDollarSign,
  Database,
  FlaskConical,
  LockKeyhole,
  Network,
  ShieldCheck,
  Waves,
} from 'lucide-react';
import { useProviders } from '@/providers/context';
import { formatCurrency } from '@/lib/utils';
import type {
  InsuranceLabDataset,
  InsuranceLabScenarioId,
  InsuranceLabSummary,
  InsuranceMarketAdapterStatus,
  PolicyWorld,
} from '@/providers/types';

const SCENARIOS: Array<{
  id: InsuranceLabScenarioId;
  label: string;
  shortLabel: string;
}> = [
  { id: 'baseline', label: 'Observed synthetic baseline', shortLabel: 'Baseline' },
  { id: 'wallet-theft-surge', label: 'Coordinated wallet theft surge', shortLabel: 'Theft surge' },
  { id: 'custodian-outage', label: 'Custodian outage concentration', shortLabel: 'Custodian outage' },
];

const WORLD_LABELS: Record<PolicyWorld, string> = {
  wallet: 'Wallet',
  everyday: 'Everyday',
  gaming: 'Gaming',
};

function formatPercent(ratio: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    maximumFractionDigits: 1,
  }).format(ratio);
}

function sentenceCase(value: string): string {
  return value.replace(/-/g, ' ').replace(/_/g, ' ');
}

export function InsuranceLabPage() {
  const providers = useProviders();
  const [dataset, setDataset] = useState<InsuranceLabDataset | null>(null);
  const [summary, setSummary] = useState<InsuranceLabSummary | null>(null);
  const [adapterStatuses, setAdapterStatuses] = useState<InsuranceMarketAdapterStatus[]>([]);
  const [selectedScenario, setSelectedScenario] = useState<InsuranceLabScenarioId>('baseline');
  const [isLoading, setIsLoading] = useState(true);
  const [isRunningScenario, setIsRunningScenario] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isCurrent = true;

    async function loadLaboratory(): Promise<void> {
      setIsLoading(true);
      setErrorMessage(null);

      // Adapter status is loaded independently so RealDeal can explain why it
      // failed closed without replacing missing external evidence with mocks.
      const statuses = await providers.insuranceLab.getAdapterStatuses();
      if (isCurrent) setAdapterStatuses(statuses);

      try {
        const [loadedDataset, baselineSummary] = await Promise.all([
          providers.insuranceLab.getDataset(),
          providers.insuranceLab.runScenario('baseline'),
        ]);

        if (isCurrent) {
          setDataset(loadedDataset);
          setSummary(baselineSummary);
        }
      } catch (error) {
        if (isCurrent) {
          setErrorMessage(error instanceof Error ? error.message : 'Insurance laboratory unavailable.');
        }
      } finally {
        if (isCurrent) setIsLoading(false);
      }
    }

    void loadLaboratory();
    return () => {
      isCurrent = false;
    };
  }, [providers]);

  async function selectScenario(scenarioId: InsuranceLabScenarioId): Promise<void> {
    setSelectedScenario(scenarioId);
    setIsRunningScenario(true);
    setErrorMessage(null);

    try {
      setSummary(await providers.insuranceLab.runScenario(scenarioId));
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Scenario could not be calculated.');
    } finally {
      setIsRunningScenario(false);
    }
  }

  const portfolioMix = useMemo(() => {
    if (!dataset) return [];

    const totalExposure = dataset.policies.reduce(
      (total, policy) => total + policy.coverageLimit,
      0,
    );

    return (Object.keys(WORLD_LABELS) as PolicyWorld[]).map((world) => {
      const exposure = dataset.policies
        .filter((policy) => policy.world === world)
        .reduce((total, policy) => total + policy.coverageLimit, 0);

      return {
        world,
        label: WORLD_LABELS[world],
        exposure,
        share: totalExposure > 0 ? exposure / totalExposure : 0,
      };
    });
  }, [dataset]);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-slate-400" role="status">
        Loading the synthetic insurance laboratory…
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      <section className="relative overflow-hidden rounded-[2rem] border border-violet-300/15 bg-slate-950 px-5 py-8 shadow-2xl shadow-violet-950/20 md:px-8 md:py-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(139,92,246,0.24),transparent_42%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.14),transparent_40%)]" aria-hidden="true" />
        <div className="relative grid gap-8 xl:grid-cols-[1.35fr_0.65fr] xl:items-end">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200/20 bg-emerald-300/10 px-3 py-1 font-mono text-xs uppercase tracking-[0.18em] text-emerald-200">
                <FlaskConical className="h-3.5 w-3.5" aria-hidden="true" />
                Synthetic risk laboratory
              </span>
              <span className="rounded-full border border-amber-200/20 bg-amber-300/10 px-3 py-1 text-xs font-semibold text-amber-100">
                No real insurance data
              </span>
            </div>

            <h1 className="mt-6 max-w-4xl text-4xl font-semibold tracking-[-0.04em] text-white md:text-6xl">
              Stress the promise before anyone trusts it.
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-7 text-slate-300 md:text-lg">
              Explore a deterministic portfolio of fictional risks, policies, claims, and reserves. Change the loss scenario and see where underwriting assumptions begin to bend.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.055] p-5 backdrop-blur">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-200" aria-hidden="true" />
              <div>
                <p className="font-semibold text-white">Truth-labelled by design</p>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  {dataset?.metadata.disclaimer ?? 'External insurance data is unavailable in this evidence environment.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {errorMessage && (
        <div className="rounded-2xl border border-amber-300/25 bg-amber-300/10 p-5 text-amber-100" role="alert">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
            <div>
              <p className="font-semibold">The data provider failed closed</p>
              <p className="mt-1 text-sm leading-6 text-amber-100/80">{errorMessage}</p>
            </div>
          </div>
        </div>
      )}

      {dataset && summary && (
        <>
          <section className="rounded-3xl border border-slate-800 bg-slate-900/85 p-5 md:p-7" aria-labelledby="stress-test-title">
            <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-violet-300">Portfolio stress test</p>
                <h2 id="stress-test-title" className="mt-2 text-2xl font-semibold text-white">Choose the event, inspect the pressure.</h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                  Scenario arithmetic is deterministic and illustrative. It is not a catastrophe model or an actuarial forecast.
                </p>
              </div>

              <div className="flex flex-wrap gap-2" aria-label="Synthetic loss scenarios">
                {SCENARIOS.map((scenario) => (
                  <button
                    key={scenario.id}
                    type="button"
                    aria-pressed={selectedScenario === scenario.id}
                    disabled={isRunningScenario}
                    onClick={() => void selectScenario(scenario.id)}
                    className={`rounded-full border px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-violet-300 disabled:cursor-wait disabled:opacity-60 ${
                      selectedScenario === scenario.id
                        ? 'border-violet-300 bg-violet-300 text-slate-950'
                        : 'border-slate-700 bg-slate-950/70 text-slate-300 hover:border-violet-300/60 hover:text-white'
                    }`}
                  >
                    {scenario.shortLabel}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-violet-300/15 bg-violet-300/[0.06] p-4">
              <p className="font-semibold text-violet-100">{summary.scenarioLabel}</p>
              <p className="mt-1 text-sm leading-6 text-slate-400">{summary.scenarioDescription}</p>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <MetricCard
                icon={CircleDollarSign}
                label="Written premium"
                value={formatCurrency(summary.totalWrittenPremium)}
                context="Fictional gross written premium"
              />
              <MetricCard
                icon={Waves}
                label="Illustrative loss ratio"
                value={formatPercent(summary.illustrativeLossRatio)}
                context={`${formatCurrency(summary.totalIncurredLosses)} incurred`}
                warning={summary.illustrativeLossRatio >= 1}
              />
              <MetricCard
                icon={ShieldCheck}
                label="Capital to exposure"
                value={formatPercent(summary.capitalToActiveExposureRatio)}
                context={`${formatCurrency(summary.availableCapital)} fictional capital`}
                warning={summary.capitalToActiveExposureRatio < 1}
              />
              <MetricCard
                icon={LockKeyhole}
                label="Evidence completeness"
                value={formatPercent(summary.averageEvidenceCompleteness)}
                context={`${summary.acceptedRiskCount} accepted, ${summary.referredRiskCount} referred`}
              />
            </div>
          </section>

          <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
            <section className="rounded-3xl border border-slate-800 bg-slate-900/85 p-5 md:p-7" aria-labelledby="portfolio-mix-title">
              <div className="flex items-center gap-3">
                <Database className="h-5 w-5 text-emerald-300" aria-hidden="true" />
                <h2 id="portfolio-mix-title" className="text-xl font-semibold text-white">Exposure mix</h2>
              </div>
              <p className="mt-2 text-sm text-slate-400">Five fictional policies, grouped by CryptoSure coverage world.</p>

              <div className="mt-7 space-y-5">
                {portfolioMix.map((item) => (
                  <div key={item.world}>
                    <div className="mb-2 flex items-end justify-between gap-4">
                      <div>
                        <p className="font-semibold text-white">{item.label}</p>
                        <p className="text-xs text-slate-500">{formatCurrency(item.exposure)} exposure</p>
                      </div>
                      <p className="font-mono text-sm text-emerald-200">{formatPercent(item.share)}</p>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-violet-500 to-emerald-300"
                        style={{ width: `${Math.max(item.share * 100, 2)}%` }}
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/85" aria-labelledby="risk-register-title">
              <div className="p-5 md:p-7">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-emerald-300">Synthetic submission register</p>
                <h2 id="risk-register-title" className="mt-2 text-xl font-semibold text-white">Evidence before identity</h2>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Applicant names are fictional aliases. The laboratory models risk evidence and decisions without personal data.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] text-left text-sm">
                  <thead className="border-y border-slate-800 bg-slate-950/70 text-xs uppercase tracking-[0.12em] text-slate-500">
                    <tr>
                      <th className="px-5 py-3 font-medium">Risk</th>
                      <th className="px-5 py-3 font-medium">World</th>
                      <th className="px-5 py-3 font-medium">Limit</th>
                      <th className="px-5 py-3 font-medium">Evidence</th>
                      <th className="px-5 py-3 font-medium">Decision</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {dataset.riskSubmissions.map((risk) => (
                      <tr key={risk.id} className="text-slate-300">
                        <td className="px-5 py-4">
                          <p className="font-semibold text-white">{risk.applicantAlias}</p>
                          <p className="mt-1 font-mono text-xs text-slate-500">{risk.id} · {risk.territory}</p>
                        </td>
                        <td className="px-5 py-4">{WORLD_LABELS[risk.world]}</td>
                        <td className="px-5 py-4 font-mono">{formatCurrency(risk.requestedLimit)}</td>
                        <td className="px-5 py-4">{formatPercent(risk.evidenceCompleteness)}</td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                            risk.decision === 'illustrative-refer'
                              ? 'bg-amber-300/10 text-amber-200'
                              : 'bg-emerald-300/10 text-emerald-200'
                          }`}>
                            {sentenceCase(risk.decision)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          <section className="rounded-3xl border border-slate-800 bg-slate-900/85 p-5 md:p-7" aria-labelledby="adapter-boundary-title">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-violet-300">Provider boundary</p>
                <h2 id="adapter-boundary-title" className="mt-2 text-2xl font-semibold text-white">Connect evidence, never impersonate it.</h2>
              </div>
              <p className="max-w-xl text-sm leading-6 text-slate-400">
                Each adapter declares its source, connection state, capabilities, prerequisites, and evidence class before the shared interface can use it.
              </p>
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              {adapterStatuses.map((adapter) => (
                <AdapterCard key={adapter.adapterId} adapter={adapter} />
              ))}
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-3">
            <DataPrinciple
              icon={LockKeyhole}
              title="No personal data"
              copy="Fictional aliases replace people, email addresses, wallet addresses, and customer records."
            />
            <DataPrinciple
              icon={Network}
              title="Referentially valid"
              copy="Every policy maps to a risk submission and every claim maps to a known fictional policy."
            />
            <DataPrinciple
              icon={FlaskConical}
              title="Reproducible"
              copy={`Dataset ${dataset.metadata.version}, fixed as of ${dataset.metadata.asOfDate}, produces the same scenarios every run.`}
            />
          </section>
        </>
      )}
    </div>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
  context,
  warning = false,
}: {
  icon: typeof CircleDollarSign;
  label: string;
  value: string;
  context: string;
  warning?: boolean;
}) {
  return (
    <div className={`rounded-2xl border p-4 ${warning ? 'border-rose-300/25 bg-rose-300/[0.07]' : 'border-slate-800 bg-slate-950/65'}`}>
      <div className={`inline-flex h-9 w-9 items-center justify-center rounded-xl ${warning ? 'bg-rose-300/10 text-rose-200' : 'bg-violet-300/10 text-violet-200'}`}>
        <Icon className="h-4.5 w-4.5" aria-hidden="true" />
      </div>
      <p className={`mt-4 text-2xl font-semibold ${warning ? 'text-rose-100' : 'text-white'}`}>{value}</p>
      <p className="mt-1 text-sm font-medium text-slate-300">{label}</p>
      <p className="mt-1 text-xs text-slate-500">{context}</p>
    </div>
  );
}

function AdapterCard({ adapter }: { adapter: InsuranceMarketAdapterStatus }) {
  const isConnected = adapter.connectionState === 'connected-synthetic';

  return (
    <article className="rounded-2xl border border-slate-800 bg-slate-950/65 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-lg font-semibold text-white">{adapter.displayName}</p>
          <p className="mt-1 font-mono text-xs text-slate-500">{adapter.adapterId}</p>
        </div>
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
          isConnected ? 'bg-emerald-300/10 text-emerald-200' : 'bg-amber-300/10 text-amber-200'
        }`}>
          {isConnected ? <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" /> : <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />}
          {sentenceCase(adapter.connectionState)}
        </span>
      </div>

      <p className="mt-4 text-sm leading-6 text-slate-400">{adapter.dataClassification}</p>

      <div className="mt-5 flex flex-wrap gap-2">
        {adapter.capabilities.map((capability) => (
          <span key={capability} className="rounded-full border border-slate-700 bg-slate-900 px-2.5 py-1 text-xs text-slate-300">
            {capability}
          </span>
        ))}
      </div>

      {adapter.requiredConfiguration.length > 0 && (
        <div className="mt-5 rounded-xl border border-amber-300/15 bg-amber-300/[0.05] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-amber-200">Required before connection</p>
          <ul className="mt-3 space-y-2 text-sm text-slate-400">
            {adapter.requiredConfiguration.map((requirement) => (
              <li key={requirement} className="flex gap-2">
                <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-amber-200" aria-hidden="true" />
                <span>{requirement}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="mt-4 text-xs leading-5 text-slate-500">{adapter.disclaimer}</p>
    </article>
  );
}

function DataPrinciple({
  icon: Icon,
  title,
  copy,
}: {
  icon: typeof LockKeyhole;
  title: string;
  copy: string;
}) {
  return (
    <article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
      <Icon className="h-5 w-5 text-emerald-300" aria-hidden="true" />
      <h2 className="mt-5 font-semibold text-white">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-400">{copy}</p>
    </article>
  );
}
