import { useEffect, useState } from 'react';
import { GraduationCap, CheckCircle2, Circle, ShieldCheck } from 'lucide-react';
import { useProviders } from '../providers/context';
import { formatDate } from '../lib/utils';
import type { EduCert, EduModuleInfo } from '../providers/types';

export function EduPage() {
  const providers = useProviders();
  const [certs, setCerts] = useState<EduCert[]>([]);
  const [modules, setModules] = useState<EduModuleInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [c, m] = await Promise.all([
          providers.edu.getCertifications(),
          providers.edu.listModules(),
        ]);
        setCerts(c);
        setModules(m);
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
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">EDU Certification</h1>
        <p className="text-sm text-slate-500 mt-1">
          Complete educational modules to unlock higher coverage tiers and premium discounts
        </p>
      </div>

      {/* Info banner */}
      <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 p-4 flex items-start gap-3">
        <ShieldCheck className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
        <div className="text-sm text-blue-700 dark:text-blue-300">
          <p className="font-medium">Non-delegable requirement</p>
          <p className="mt-1">
            EDU scope acceptance must be personally signed by the policy holder. Even if an AgenticDID
            agent manages your policy, this signature remains non-delegable.
          </p>
        </div>
      </div>

      {/* Certifications */}
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm p-5">
        <h2 className="font-semibold text-slate-900 dark:text-white mb-4">Your Certifications</h2>
        {certs.length === 0 ? (
          <p className="text-sm text-slate-400 py-6 text-center">No certifications yet</p>
        ) : (
          <div className="space-y-3">
            {certs.map((c) => (
              <div key={c.id} className="flex items-center justify-between rounded-lg border border-slate-100 dark:border-slate-800 p-3">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{c.modules.join(', ')}</p>
                    <p className="text-xs text-slate-500">Issued {formatDate(c.issuedAt)}</p>
                  </div>
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                  c.holderSignature
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                }`}>
                  {c.holderSignature ? 'Verified' : 'Pending'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Available Modules */}
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm p-5">
        <h2 className="font-semibold text-slate-900 dark:text-white mb-4">Available Modules</h2>
        <div className="space-y-3">
          {modules.map((m) => {
            const completed = certs.some((c) => c.modules.includes(m.id));
            return (
              <div key={m.id} className="flex items-center justify-between rounded-lg border border-slate-100 dark:border-slate-800 p-4">
                <div className="flex items-center gap-3">
                  {completed ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : (
                    <Circle className="h-5 w-5 text-slate-300" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{m.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{m.description}</p>
                    <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-400">
                      <span>{m.estimatedTime}</span>
                      <span>•</span>
                      <span>Unlocks: {m.requiredFor.join(', ')}</span>
                    </div>
                  </div>
                </div>
                {!completed && (
                  <button
                    onClick={async () => {
                      try {
                        await providers.edu.issueCertById(m.id);
                        const [c] = await Promise.all([providers.edu.getCertifications()]);
                        setCerts(c);
                      } catch (e) {
                        console.error(e);
                      }
                    }}
                    className="flex items-center gap-1.5 rounded-lg bg-violet-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-violet-700"
                  >
                    <GraduationCap className="h-3.5 w-3.5" />
                    Complete
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
