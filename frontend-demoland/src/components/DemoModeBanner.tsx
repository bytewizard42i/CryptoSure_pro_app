import { Shield, AlertTriangle } from 'lucide-react';
import { useMode } from '../providers/context';

export function DemoModeBanner() {
  const mode = useMode();
  const isDemoLand = mode === 'demoland';

  return (
    <div
      className={`demo-banner fixed right-4 top-4 z-50 flex max-w-[min(28rem,calc(100vw-2rem))] items-start gap-3 rounded-xl border px-4 py-3 text-xs font-medium shadow-2xl backdrop-blur-md ${
        isDemoLand
          ? 'border-amber-200/80 bg-amber-500/95 text-amber-950'
          : 'border-emerald-200/80 bg-emerald-500/95 text-emerald-950'
      }`}
      data-cryptosure-mode={mode}
      role="status"
    >
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      <span className="leading-5">
        <strong className="block font-black uppercase tracking-[0.14em]">
          {isDemoLand ? 'DEMO MODE · DEMOLAND' : 'REALDEAL TEST ENVIRONMENT'}
        </strong>
        {isDemoLand
          ? 'Placeholders, mocks, and simulated evidence only. No external effects and no insurance.'
          : 'Approved test services and real infrastructure. No production insurance or live money.'}
      </span>
      <Shield className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
    </div>
  );
}
