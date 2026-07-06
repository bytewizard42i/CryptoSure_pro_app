import { Shield, AlertTriangle } from 'lucide-react';
import { useMode } from '../providers/context';

export function DemoModeBanner() {
  const mode = useMode();
  if (mode !== 'demoland') return null;

  return (
    <div className="demo-banner sticky top-0 z-50 flex items-center justify-center gap-2 bg-amber-500/95 px-4 py-2 text-sm font-medium text-amber-950 shadow-md">
      <AlertTriangle className="h-4 w-4" />
      <span>DEMO MODE — All data is simulated. No real transactions, no real insurance.</span>
      <Shield className="h-4 w-4" />
    </div>
  );
}
