import { useEffect, useState } from 'react';
import { AlertCircle, Plus, Loader2, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { useProviders } from '@/providers/context';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { Claim, Policy, ClaimEvent } from '@/providers/types';

const EVENTS: ClaimEvent[] = [
  'theft_covered_vector',
  'custodial_failure',
  'device_loss',
  'recovery_failure',
  'gaming_asset_destruction',
  'gaming_asset_theft',
];

export function ClaimsPage() {
  const providers = useProviders();
  const [claims, setClaims] = useState<Claim[]>([]);
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFile, setShowFile] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [c, p] = await Promise.all([
          providers.claims.listClaims(),
          providers.policies.listPolicies(),
        ]);
        setClaims(c);
        setPolicies(p);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [providers]);

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-slate-400">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Claims</h1>
          <p className="text-sm text-slate-500 mt-1">File and track insurance claims</p>
        </div>
        <button
          onClick={() => setShowFile(true)}
          disabled={policies.filter((p) => p.status === 'active').length === 0}
          className="flex items-center gap-1.5 rounded-lg bg-violet-600 px-3 py-2 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-50"
        >
          <Plus className="h-4 w-4" />
          File Claim
        </button>
      </div>

      {claims.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm p-12 text-center">
          <AlertCircle className="h-12 w-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500">No claims filed</p>
        </div>
      ) : (
        <div className="space-y-3">
          {claims.map((c) => (
            <div key={c.id} className="bg-white dark:bg-slate-900 rounded-xl shadow-sm p-5 cs-card">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-slate-900 dark:text-white capitalize">
                      {c.event.replace(/_/g, ' ')}
                    </p>
                    <ClaimBadge status={c.status} />
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">Claim ID: {c.id}</p>
                  <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <div>
                      <p className="text-slate-500">Amount</p>
                      <p className="font-medium text-slate-900 dark:text-white">{formatCurrency(c.amount)}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Policy</p>
                      <p className="font-medium text-slate-900 dark:text-white text-xs">{c.policyId}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Filed</p>
                      <p className="text-slate-700 dark:text-slate-300">{formatDate(c.submittedAt)}</p>
                    </div>
                    {c.resolvedAt && (
                      <div>
                        <p className="text-slate-500">Resolved</p>
                        <p className="text-slate-700 dark:text-slate-300">{formatDate(c.resolvedAt)}</p>
                      </div>
                    )}
                  </div>
                  {c.description && (
                    <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">{c.description}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showFile && (
        <FileClaimModal
          policies={policies.filter((p) => p.status === 'active')}
          onClose={() => setShowFile(false)}
          onFiled={() => {
            setShowFile(false);
            providers.claims.listClaims().then(setClaims);
          }}
          providers={providers}
        />
      )}
    </div>
  );
}

function ClaimBadge({ status }: { status: string }) {
  const config: Record<string, { icon: typeof CheckCircle2; cls: string }> = {
    approved: { icon: CheckCircle2, cls: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
    paid: { icon: CheckCircle2, cls: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
    denied: { icon: XCircle, cls: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
    submitted: { icon: Clock, cls: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
    under_review: { icon: Clock, cls: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  };
  const { icon: Icon, cls } = config[status] || { icon: Clock, cls: 'bg-slate-100 text-slate-500' };
  return (
    <span className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${cls}`}>
      <Icon className="h-3 w-3" />
      {status.replace(/_/g, ' ')}
    </span>
  );
}

function FileClaimModal({ policies, onClose, onFiled, providers }: {
  policies: Policy[];
  onClose: () => void;
  onFiled: () => void;
  providers: ReturnType<typeof useProviders>;
}) {
  const [policyId, setPolicyId] = useState(policies[0]?.id || '');
  const [event, setEvent] = useState(EVENTS[0]);
  const [amount, setAmount] = useState(100);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await providers.claims.submitClaim({ policyId, event, amount, description });
      onFiled();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">File a Claim</h2>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Policy</label>
            <select value={policyId} onChange={(e) => setPolicyId(e.target.value)}
              className="w-full mt-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm">
              {policies.map((p) => (
                <option key={p.id} value={p.id}>{p.world} — {p.tier}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Event Type</label>
            <select value={event} onChange={(e) => setEvent(e.target.value as typeof EVENTS[0])}
              className="w-full mt-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm">
              {EVENTS.map((e) => (
                <option key={e} value={e}>{e.replace(/_/g, ' ')}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Amount (USD)</label>
            <input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full mt-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3}
              className="w-full mt-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm" />
          </div>
          <div className="flex gap-2">
            <button onClick={onClose} className="flex-1 rounded-lg border border-slate-200 dark:border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-600">Cancel</button>
            <button onClick={handleSubmit} disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-50">
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? 'Submitting...' : 'Submit Claim'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
