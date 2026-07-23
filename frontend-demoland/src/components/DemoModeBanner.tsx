import { Shield, AlertTriangle } from 'lucide-react';
import { useMode } from '../providers/context';

export function DemoModeBanner() {
  const mode = useMode();
  const isDemoLand = mode === 'demoland';

  return (
    <div
      className={`demo-banner sticky top-0 z-50 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium shadow-md ${
        isDemoLand
          ? 'bg-amber-500/95 text-amber-950'
          : 'bg-emerald-500/95 text-emerald-950'
      }`}
      data-cryptosure-mode={mode}
      role="status"
    >
      <AlertTriangle className="h-4 w-4" />
      <span>
        {isDemoLand
          ? 'DEMOLAND: Placeholders, mocks, and simulated evidence only. No external effects and no insurance.'
          : 'REALDEAL TEST ENVIRONMENT: Approved test services and real infrastructure. No production insurance or live money.'}
      </span>
      <Shield className="h-4 w-4" />
    </div>
  );
}
