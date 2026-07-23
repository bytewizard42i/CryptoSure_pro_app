import { useEffect, useState } from 'react';
import { FileText, Plus, Loader2 } from 'lucide-react';
import { useProviders } from '@/providers/context';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { Policy } from '@/providers/types';

export function PoliciesPage() {
  const providers = useProviders();
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBuy, setShowBuy] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const p = await providers.policies.listPolicies();
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
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Policies</h1>
          <p className="text-sm text-slate-500 mt-1">Manage your insurance policies</p>
        </div>
        <button
          onClick={() => setShowBuy(true)}
          className="flex items-center gap-1.5 rounded-lg bg-violet-600 px-3 py-2 text-sm font-semibold text-white hover:bg-violet-700"
        >
          <Plus className="h-4 w-4" />
          New Policy
        </button>
      </div>

      {policies.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm p-12 text-center">
          <FileText className="h-12 w-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500">No policies yet</p>
          <button
            onClick={() => setShowBuy(true)}
            className="mt-3 text-sm text-violet-600 font-medium hover:underline"
          >
            Buy your first policy
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {policies.map((p) => (
            <div key={p.id} className="bg-white dark:bg-slate-900 rounded-xl shadow-sm p-5 cs-card">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white capitalize">
                    {p.world} — {p.tier}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">ID: {p.id}</p>
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                  p.status === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                  p.status === 'pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                  'bg-slate-100 text-slate-500 dark:bg-slate-800'
                }`}>{p.status}</span>
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Coverage</span>
                  <span className="font-medium text-slate-900 dark:text-white">{formatCurrency(p.coverageLimit)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Premium</span>
                  <span className="font-medium text-slate-900 dark:text-white">{formatCurrency(p.premium)}/mo</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Purchased</span>
                  <span className="text-slate-700 dark:text-slate-300">{formatDate(p.createdAt)}</span>
                </div>
                {p.expiresAt && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Expires</span>
                    <span className="text-slate-700 dark:text-slate-300">{formatDate(p.expiresAt)}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showBuy && <BuyPolicyModal providers={providers} onClose={() => setShowBuy(false)} onBought={() => {
        setShowBuy(false);
        providers.policies.listPolicies().then(setPolicies);
      }} />}
    </div>
  );
}

function BuyPolicyModal({ providers, onClose, onBought }: {
  providers: ReturnType<typeof useProviders>;
  onClose: () => void;
  onBought: () => void;
}) {
  const [world, setWorld] = useState<'wallet' | 'everyday' | 'gaming'>('wallet');
  const [tier, setTier] = useState<'T0' | 'T1' | 'T2' | 'T3'>('T1');
  const [loading, setLoading] = useState(false);

  const handleBuy = async () => {
    setLoading(true);
    try {
      await providers.policies.buyPolicy({ world, tier, scopeHash: '0xscope_demo_v1' });
      onBought();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Buy New Policy</h2>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Coverage World</label>
            <div className="grid grid-cols-3 gap-2 mt-1">
              {(['wallet', 'everyday', 'gaming'] as const).map((w) => (
                <button key={w} onClick={() => setWorld(w)}
                  className={`rounded-lg border p-2 text-sm font-medium capitalize ${world === w ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20' : 'border-slate-200 dark:border-slate-700'}`}>
                  {w}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Tier</label>
            <div className="grid grid-cols-4 gap-2 mt-1">
              {(['T0', 'T1', 'T2', 'T3'] as const).map((t) => (
                <button key={t} onClick={() => setTier(t)}
                  className={`rounded-lg border p-2 text-sm font-medium ${tier === t ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20' : 'border-slate-200 dark:border-slate-700'}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-3 text-sm">
            <p className="text-slate-500">Coverage: <span className="font-medium text-slate-900 dark:text-white">${{ T0: 500, T1: 1000, T2: 5000, T3: 10000 }[tier]}</span></p>
            <p className="text-slate-500">Premium: <span className="font-medium text-slate-900 dark:text-white">${{ T0: 5, T1: 10, T2: 25, T3: 50 }[tier]}/mo</span></p>
          </div>
          <div className="flex gap-2">
            <button onClick={onClose} className="flex-1 rounded-lg border border-slate-200 dark:border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-600">Cancel</button>
            <button onClick={handleBuy} disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-50">
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? 'Processing...' : 'Buy Policy'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
