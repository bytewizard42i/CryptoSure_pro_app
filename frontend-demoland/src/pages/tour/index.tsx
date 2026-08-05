import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle2,
  FileSearch,
  Landmark,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { DemoModeBanner } from '@/components/DemoModeBanner';
import { useAuth, useMode } from '@/providers/context';

const proofPoints = [
  {
    icon: LockKeyhole,
    title: 'No wallet connection',
    copy: 'Explore the experience without sharing wallet, identity, or asset information.',
  },
  {
    icon: FileSearch,
    title: 'Boundaries first',
    copy: 'See simulated exclusions, requirements, and evidence before illustrative pricing.',
  },
  {
    icon: Landmark,
    title: 'Capacity made visible',
    copy: 'Explore how regulated partners and transparent reserves could coordinate.',
  },
];

export function TourPage() {
  const { login } = useAuth();
  const mode = useMode();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const enterGuidedEnvironment = async () => {
    setLoading(true);
    setError(null);

    try {
      await login('email', 'demo@cryptosure.app');
      navigate('/');
    } catch (caughtError: unknown) {
      setError(caughtError instanceof Error ? caughtError.message : 'The guided environment is unavailable.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cs-tour-shell dark">
      <DemoModeBanner />
      <div className="cs-tour-content">
        <nav className="cs-tour-nav" aria-label="DemoLand introduction">
          <Link to="/tour" className="flex items-center gap-3 text-white">
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-emerald-100/20 bg-emerald-100/10">
              <ShieldCheck className="h-5 w-5 text-emerald-200" aria-hidden="true" />
            </span>
            <span className="text-lg font-semibold tracking-tight">CryptoSure</span>
            <span className="font-mono text-xs text-emerald-200">DemoLand</span>
          </Link>
          <a
            href="https://cryptosure.pro"
            className="text-sm font-semibold text-slate-300 transition hover:text-white"
          >
            CryptoSure.pro ↗
          </a>
        </nav>

        <main>
          <section className="cs-tour-hero" aria-labelledby="tour-title">
            <div>
              <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.22em] text-emerald-200">
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                Privacy-first insurance concept
              </p>
              <h1 id="tour-title" className="cs-tour-title">
                Proof,
                <span>not exposure.</span>
              </h1>
              <p className="max-w-2xl text-base leading-7 text-slate-300 md:text-xl md:leading-8">
                Walk through a proposed insurance experience for crypto assets. Understand the risk, scope, evidence, and reserve model without connecting a wallet or buying coverage.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={enterGuidedEnvironment}
                  disabled={loading}
                  className="inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-gradient-to-r from-emerald-200 to-sky-300 px-6 text-sm font-bold text-slate-950 transition hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-white disabled:opacity-60"
                >
                  {loading ? 'Opening DemoLand…' : 'Enter guided DemoLand'}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
                <Link
                  to="/login"
                  className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/15 px-6 text-sm font-semibold text-white transition hover:border-white/35 hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-white"
                >
                  View sign-in methods
                </Link>
              </div>
              {error && <p className="mt-4 text-sm text-red-300" role="alert">{error}</p>}
            </div>

            <aside className="cs-tour-panel" aria-label="DemoLand boundaries">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs uppercase tracking-[0.18em] text-emerald-200">
                  {mode === 'demoland' ? 'Simulated environment' : 'Test environment'}
                </span>
                <span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_18px_rgba(110,255,218,0.8)]" />
              </div>
              <p className="mt-8 text-sm text-slate-400">Illustrative coverage range</p>
              <p className="mt-2 text-5xl font-semibold tracking-[-0.06em] text-white">$500</p>
              <p className="text-xl text-slate-400">to $10,000</p>
              <div className="mt-8 space-y-3 border-t border-white/10 pt-6 text-sm text-slate-300">
                {['No quote or policy', 'No payment or wallet', 'No submitted personal data'].map((boundary) => (
                  <p key={boundary} className="flex items-center gap-3">
                    <CheckCircle2 className="h-4 w-4 text-emerald-200" aria-hidden="true" />
                    {boundary}
                  </p>
                ))}
              </div>
            </aside>
          </section>

          <section className="cs-tour-proof-grid" aria-label="DemoLand safeguards">
            {proofPoints.map((proofPoint) => {
              const Icon = proofPoint.icon;
              return (
                <article key={proofPoint.title} className="cs-tour-proof">
                  <Icon className="h-5 w-5 text-emerald-200" aria-hidden="true" />
                  <h2 className="mt-7 text-lg font-semibold text-white">{proofPoint.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{proofPoint.copy}</p>
                </article>
              );
            })}
          </section>

          <footer className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs leading-5 text-slate-500 sm:flex-row sm:items-start sm:justify-between">
            <p className="max-w-3xl">
              DemoLand is a product simulation. CryptoSure does not currently offer, sell, quote, bind, or guarantee insurance coverage.
            </p>
            <p className="shrink-0">EnterpriseZK Labs · 2026</p>
          </footer>
        </main>
      </div>
    </div>
  );
}
