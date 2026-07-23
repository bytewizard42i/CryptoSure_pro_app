import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Key, Wallet, Fingerprint, Chrome, Shield, Loader2, Check } from 'lucide-react';
import { useAuth } from '@/providers/context';
import { DemoModeBanner } from '@/components/DemoModeBanner';
import type { SignUpMethod, SignUpData } from '@/providers/types';

const AUTH_METHODS: { id: SignUpMethod; label: string; icon: typeof Mail; badge?: string }[] = [
  { id: 'email', label: 'Email + Password', icon: Mail, badge: 'Quick' },
  { id: 'pgp-key', label: 'PGP Key', icon: Key, badge: 'Self-Sovereign' },
  { id: 'did-wallet', label: 'DID Wallet', icon: Wallet, badge: 'Web3' },
  { id: 'trezor', label: 'Trezor', icon: Shield, badge: 'Hardware' },
  { id: 'biometric', label: 'Biometric', icon: Fingerprint, badge: 'FIDO2' },
  { id: 'chrome-oauth', label: 'Google OAuth', icon: Chrome, badge: 'Convenient' },
  { id: 'brave-oauth', label: 'Brave OAuth', icon: Shield, badge: 'Privacy' },
];

const COVERAGE_TYPES = [
  { id: 'wallet' as const, label: 'Crypto Wallet', desc: 'Insure self-custodied wallet against covered loss events' },
  { id: 'everyday' as const, label: 'Everyday Items', desc: 'Insure real-world assets registered via RWAz' },
  { id: 'gaming' as const, label: 'Gaming Assets', desc: 'Insure in-game digital assets (pilot program)' },
];

export function SignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [data, setData] = useState<SignUpData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    signupMethod: 'email',
    coverageType: 'wallet',
    walletAddress: '',
  });

  const handleSignup = async () => {
    setLoading(true);
    setError(null);
    try {
      await signup(data);
      navigate('/');
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <DemoModeBanner />
      <div className="flex items-center justify-center min-h-[calc(100vh-40px)] p-4">
        <div className="w-full max-w-lg">
          <div className="text-center mb-6">
            <Shield className="h-10 w-10 text-violet-600 mx-auto mb-2" />
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Create Account</h1>
          </div>

          {/* Step indicator */}
          <div className="flex items-center justify-center gap-2 mb-6">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= s ? 'bg-violet-600 text-white' : 'bg-slate-200 text-slate-400'
                }`}>
                  {step > s ? <Check className="h-4 w-4" /> : s}
                </div>
                {s < 3 && <div className={`h-1 w-12 ${step > s ? 'bg-violet-600' : 'bg-slate-200'}`} />}
              </div>
            ))}
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg p-6 cs-card">
            {/* Step 1: Profile */}
            {step === 1 && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Your Profile</h2>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="First Name"
                    value={data.firstName}
                    onChange={(e) => setData({ ...data, firstName: e.target.value })}
                    className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                  <input
                    type="text"
                    placeholder="Last Name"
                    value={data.lastName}
                    onChange={(e) => setData({ ...data, lastName: e.target.value })}
                    className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                </div>
                <input
                  type="email"
                  placeholder="Email Address"
                  value={data.email}
                  onChange={(e) => setData({ ...data, email: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={data.password}
                  onChange={(e) => setData({ ...data, password: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
                <button
                  onClick={() => setStep(2)}
                  disabled={!data.firstName || !data.lastName || !data.email || !data.password}
                  className="w-full rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-50"
                >
                  Continue
                </button>
              </div>
            )}

            {/* Step 2: Coverage Type */}
            {step === 2 && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Coverage Type</h2>
                <p className="text-sm text-slate-500">What would you like to insure?</p>
                <div className="space-y-2">
                  {COVERAGE_TYPES.map((ct) => (
                    <button
                      key={ct.id}
                      onClick={() => setData({ ...data, coverageType: ct.id })}
                      className={`w-full text-left rounded-lg border p-4 transition-colors ${
                        data.coverageType === ct.id
                          ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20'
                          : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <p className="font-medium text-slate-900 dark:text-white">{ct.label}</p>
                      <p className="text-sm text-slate-500 mt-0.5">{ct.desc}</p>
                    </button>
                  ))}
                </div>
                {data.coverageType === 'wallet' && (
                  <input
                    type="text"
                    placeholder="Wallet Address (optional for demo)"
                    value={data.walletAddress || ''}
                    onChange={(e) => setData({ ...data, walletAddress: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                )}
                <div className="flex gap-2">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 rounded-lg border border-slate-200 dark:border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-400"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="flex-1 rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-700"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Auth Method */}
            {step === 3 && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Authentication Method</h2>
                <p className="text-sm text-slate-500">Choose how you want to sign in</p>
                <div className="grid grid-cols-2 gap-2">
                  {AUTH_METHODS.map((method) => {
                    const Icon = method.icon;
                    return (
                      <button
                        key={method.id}
                        onClick={() => setData({ ...data, signupMethod: method.id })}
                        className={`flex flex-col items-center gap-1 rounded-lg border p-3 text-xs font-medium transition-colors ${
                          data.signupMethod === method.id
                            ? 'border-violet-500 bg-violet-50 text-violet-900 dark:bg-violet-900/20 dark:text-violet-300'
                            : 'border-slate-200 text-slate-600 hover:border-slate-300 dark:border-slate-700 dark:text-slate-400'
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        {method.label}
                        {method.badge && (
                          <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded-full text-slate-500">
                            {method.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
                {error && <p className="text-sm text-red-500">{error}</p>}
                <div className="flex gap-2">
                  <button
                    onClick={() => setStep(2)}
                    className="flex-1 rounded-lg border border-slate-200 dark:border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-400"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleSignup}
                    disabled={loading}
                    className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-50"
                  >
                    {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                    {loading ? 'Creating...' : 'Create Account'}
                  </button>
                </div>
              </div>
            )}
          </div>

          <p className="text-center text-sm text-slate-500 mt-4">
            Already have an account?{' '}
            <Link to="/login" className="text-violet-600 font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
