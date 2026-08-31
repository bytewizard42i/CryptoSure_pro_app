import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Shield, Loader2 } from 'lucide-react';
import { DemoModeBanner } from '@/components/DemoModeBanner';
import { useAuth } from '@/providers/context';

// Maps the "dest" query parameter from the landing page buttons to the
// actual DemoLand route each audience button should land on.
const DESTINATION_ROUTES: Record<string, string> = {
  dashboard: '/',
  onboarding: '/onboarding',
  policies: '/policies',
  claims: '/claims',
  pool: '/pool',
};

export function EnterPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const hasEntered = useRef(false);

  useEffect(() => {
    // React StrictMode double-invokes effects in development. The ref guard
    // ensures we only attempt the simulated login once per mount.
    if (hasEntered.current) return;
    hasEntered.current = true;

    const dest = searchParams.get('dest') ?? 'dashboard';
    const targetRoute = DESTINATION_ROUTES[dest] ?? DESTINATION_ROUTES.dashboard;

    login('email', 'demo@cryptosure.app')
      .then(() => navigate(targetRoute, { replace: true }))
      .catch((caughtError: unknown) => {
        setError(
          caughtError instanceof Error
            ? caughtError.message
            : 'Unable to enter DemoLand.',
        );
      });
  }, [login, navigate, searchParams]);

  return (
    <div className="cs-login-shell dark min-h-screen bg-slate-950">
      <DemoModeBanner />
      <div className="flex items-center justify-center min-h-[calc(100vh-40px)] p-4">
        <div className="text-center">
          {error ? (
            <>
              <p className="text-sm text-red-400" role="alert">
                {error}
              </p>
              <a
                href="/tour"
                className="mt-4 inline-flex text-sm font-semibold text-cyan-300 hover:text-cyan-200"
              >
                Start the guided tour instead →
              </a>
            </>
          ) : (
            <>
              <Shield className="h-12 w-12 text-violet-600 mx-auto mb-3" />
              <Loader2 className="h-6 w-6 animate-spin text-violet-400 mx-auto mb-3" />
              <p className="text-sm text-slate-400">Entering DemoLand…</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
