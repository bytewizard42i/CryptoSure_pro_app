import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Shield, FileText, AlertCircle, Coins, TrendingUp,
  CheckCircle2, Clock, XCircle,
} from 'lucide-react';
import { useProviders, useAuth } from '@/providers/context';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { Policy, Claim, PoolStats, CreditScoreInfo } from '@/providers/types';

export function Dashboard() {
  const providers = useProviders();
  const { session } = useAuth();
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [poolStats, setPoolStats] = useState<PoolStats | null>(null);
  const [scoreInfo, setScoreInfo] = useState<CreditScoreInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [p, c, ps, si] = await Promise.all([
          providers.policies.listPolicies(),
          providers.claims.listClaims(),
          providers.pool.getStats(),
          providers.creditScore.getScoreInfo(),
        ]);
        setPolicies(p);
        setClaims(c);
        setPoolStats(ps);
        setScoreInfo(si);
      } catch (e) {
        console.error('Dashboard load error:', e);
      } finally {
        setLoading(false);
      }
    })();
  }, [providers]);

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-slate-400">Loading...</div>;
  }

  const activePolicies = policies.filter((p) => p.status === 'active');
  const pendingClaims = claims.filter((c) => c.status === 'submitted' || c.status === 'under_review');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Welcome back, {session?.displayName?.split(' ')[0] || 'there'}
        </h1>
        <p className="text-sm text-slate-500 mt-1">Your CryptoSure overview</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={FileText}
          label="Active Policies"
          value={activePolicies.length.toString()}
          accent="violet"
        />
        <StatCard
          icon={AlertCircle}
          label="Pending Claims"
          value={pendingClaims.length.toString()}
          accent="amber"
        />
        <StatCard
          icon={TrendingUp}
          label="Credit Score Band"
          value={scoreInfo?.band || 'unrated'}
          sublabel={scoreInfo ? `Max tier: ${scoreInfo.maxTier}` : undefined}
          accent="blue"
        />
        <StatCard
          icon={Coins}
          label="Pool Balance"
          value={poolStats ? formatCurrency(poolStats.totalBalance) : '—'}
          accent="green"
        />
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Policies */}
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-slate-900 dark:text-white">Your Policies</h2>
            <Link to="/policies" className="text-sm text-violet-600 hover:underline">View all</Link>
          </div>
          {policies.length === 0 ? (
            <p className="text-sm text-slate-400 py-8 text-center">
              No policies yet.{' '}
              <Link to="/onboarding" className="text-violet-600">Get started</Link>
            </p>
          ) : (
            <div className="space-y-3">
              {policies.slice(0, 4).map((p) => (
                <div key={p.id} className="flex items-center justify-between rounded-lg border border-slate-100 dark:border-slate-800 p-3">
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                      {p.world === 'wallet' ? 'Wallet' : p.world === 'everyday' ? 'Everyday' : 'Gaming'} — {p.tier}
                    </p>
                    <p className="text-xs text-slate-500">{formatCurrency(p.coverageLimit)} coverage</p>
                  </div>
                  <StatusBadge status={p.status} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Claims */}
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-slate-900 dark:text-white">Recent Claims</h2>
            <Link to="/claims" className="text-sm text-violet-600 hover:underline">View all</Link>
          </div>
          {claims.length === 0 ? (
            <p className="text-sm text-slate-400 py-8 text-center">No claims filed</p>
          ) : (
            <div className="space-y-3">
              {claims.slice(0, 4).map((c) => (
                <div key={c.id} className="flex items-center justify-between rounded-lg border border-slate-100 dark:border-slate-800 p-3">
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                      {c.event.replace(/_/g, ' ')}
                    </p>
                    <p className="text-xs text-slate-500">{formatCurrency(c.amount)} — {formatDate(c.submittedAt)}</p>
                  </div>
                  <ClaimStatusBadge status={c.status} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* DIDz + AgenticDID placeholder section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm p-5">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="h-5 w-5 text-violet-600" />
            <h2 className="font-semibold text-slate-900 dark:text-white">DIDz Identity</h2>
            <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">PLACEHOLDER</span>
          </div>
          <p className="text-sm text-slate-500 mb-2">
            Commitment: <code className="text-xs bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
              {session?.didzCommitment || 'Not registered'}
            </code>
          </p>
          <p className="text-xs text-slate-400">
            In realDeal, this connects to DIDz.io's DIDzRegistry. Your identity is a non-transferable
            registry entry — never an NFT. Credit score attestation comes from the DIDz scoring oracle.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm p-5">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="h-5 w-5 text-blue-600" />
            <h2 className="font-semibold text-slate-900 dark:text-white">AgenticDID</h2>
            <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">PLACEHOLDER</span>
          </div>
          <p className="text-sm text-slate-500 mb-2">
            Delegate policy management to an agent with spend caps.
          </p>
          <p className="text-xs text-slate-400">
            In realDeal, this connects to AgenticDID's scoped grant system. Both per_action_cap and
            cumulative_cap are enforced on-chain. EDU signature remains non-delegable.
          </p>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, sublabel, accent }: {
  icon: typeof Shield; label: string; value: string; sublabel?: string;
  accent: 'violet' | 'amber' | 'blue' | 'green';
}) {
  const accentColors = {
    violet: 'text-violet-600 bg-violet-50 dark:bg-violet-900/20',
    amber: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20',
    blue: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20',
    green: 'text-green-600 bg-green-50 dark:bg-green-900/20',
  };
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm p-5 cs-card">
      <div className={`inline-flex h-10 w-10 items-center justify-center rounded-lg ${accentColors[accent]} mb-3`}>
        <Icon className="h-5 w-5" />
      </div>
      <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
      <p className="text-sm text-slate-500">{label}</p>
      {sublabel && <p className="text-xs text-slate-400 mt-1">{sublabel}</p>}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    active: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    lapsed: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    claimed: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    expired: 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400',
  };
  return (
    <span className={`text-xs font-medium px-2 py-1 rounded-full ${styles[status] || styles.expired}`}>
      {status}
    </span>
  );
}

function ClaimStatusBadge({ status }: { status: string }) {
  const icons: Record<string, typeof CheckCircle2> = {
    approved: CheckCircle2,
    denied: XCircle,
    submitted: Clock,
    under_review: Clock,
    paid: CheckCircle2,
  };
  const styles: Record<string, string> = {
    approved: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    denied: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    submitted: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    under_review: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    paid: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  };
  const Icon = icons[status] || Clock;
  return (
    <span className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${styles[status] || styles.submitted}`}>
      <Icon className="h-3 w-3" />
      {status.replace(/_/g, ' ')}
    </span>
  );
}
