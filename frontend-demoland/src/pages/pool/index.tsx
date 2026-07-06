import { useEffect, useState } from 'react';
import { Coins, TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { useProviders } from '../providers/context';
import { formatCurrency, formatDate } from '../lib/utils';
import type { PoolStats, PoolEvent } from '../providers/types';

export function PoolPage() {
  const providers = useProviders();
  const [stats, setStats] = useState<PoolStats | null>(null);
  const [events, setEvents] = useState<PoolEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [s, e] = await Promise.all([
          providers.pool.getStats(),
          providers.pool.getEvents(),
        ]);
        setStats(s);
        setEvents(e);
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
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Premium Pool</h1>
        <p className="text-sm text-slate-500 mt-1">On-chain premium pool statistics and history</p>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm p-5 cs-card">
            <div className="flex items-center gap-2 mb-2">
              <Coins className="h-5 w-5 text-green-600" />
              <span className="text-sm text-slate-500">Total Balance</span>
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">
              {formatCurrency(stats.totalBalance)}
            </p>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm p-5 cs-card">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <span className="text-sm text-slate-500">Total Premiums</span>
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">
              {formatCurrency(stats.totalPremiumsCollected)}
            </p>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm p-5 cs-card">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="h-5 w-5 text-red-600" />
              <span className="text-sm text-slate-500">Total Claims Paid</span>
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">
              {formatCurrency(stats.totalClaimsPaid)}
            </p>
          </div>
        </div>
      )}

      {/* Pool ratio */}
      {stats && (
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm p-5">
          <h2 className="font-semibold text-slate-900 dark:text-white mb-4">Pool Health</h2>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-500">Claims ratio</span>
                <span className="font-medium text-slate-900 dark:text-white">
                  {stats.totalPremiumsCollected > 0
                    ? `${((stats.totalClaimsPaid / stats.totalPremiumsCollected) * 100).toFixed(1)}%`
                    : '0%'}
                </span>
              </div>
              <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-500 to-amber-500"
                  style={{
                    width: `${Math.min(100, (stats.totalClaimsPaid / Math.max(1, stats.totalPremiumsCollected)) * 100)}%`,
                  }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-500">Reserve ratio</span>
                <span className="font-medium text-slate-900 dark:text-white">
                  {stats.totalPremiumsCollected > 0
                    ? `${(((stats.totalBalance) / Math.max(1, stats.totalPremiumsCollected)) * 100).toFixed(1)}%`
                    : '100%'}
                </span>
              </div>
              <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-violet-500"
                  style={{
                    width: `${Math.min(100, (stats.totalBalance / Math.max(1, stats.totalPremiumsCollected)) * 100)}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Event history */}
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm p-5">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="h-5 w-5 text-violet-600" />
          <h2 className="font-semibold text-slate-900 dark:text-white">Pool Events</h2>
        </div>
        {events.length === 0 ? (
          <p className="text-sm text-slate-400 py-6 text-center">No events recorded</p>
        ) : (
          <div className="space-y-2">
            {events.map((e, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg border border-slate-100 dark:border-slate-800 p-3">
                <div className="flex items-center gap-3">
                  <div className={`h-2 w-2 rounded-full ${
                    e.type === 'premium_in' ? 'bg-green-500' :
                    e.type === 'claim_paid' ? 'bg-red-500' :
                    'bg-blue-500'
                  }`} />
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white capitalize">
                      {e.type.replace(/_/g, ' ')}
                    </p>
                    <p className="text-xs text-slate-500">{formatDate(e.timestamp)}</p>
                  </div>
                </div>
                <span className={`text-sm font-medium ${
                  e.type === 'claim_paid' ? 'text-red-600' : 'text-green-600'
                }`}>
                  {e.type === 'claim_paid' ? '-' : '+'}{formatCurrency(e.amount)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
