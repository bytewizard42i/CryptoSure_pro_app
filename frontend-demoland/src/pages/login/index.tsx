import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Key, Wallet, Fingerprint, Chrome, Shield, Loader2 } from 'lucide-react';
import { useAuth } from '@/providers/context';
import { DemoModeBanner } from '@/components/DemoModeBanner';
import type { SignUpMethod } from '@/providers/types';

const AUTH_METHODS: { id: SignUpMethod; label: string; icon: typeof Mail; badge?: string }[] = [
  { id: 'email', label: 'Email + Password', icon: Mail, badge: 'Quick' },
  { id: 'pgp-key', label: 'PGP Key', icon: Key, badge: 'Self-Sovereign' },
  { id: 'did-wallet', label: 'DID Wallet', icon: Wallet, badge: 'Web3' },
  { id: 'trezor', label: 'Trezor', icon: Shield, badge: 'Hardware' },
  { id: 'biometric', label: 'Biometric', icon: Fingerprint, badge: 'FIDO2' },
  { id: 'chrome-oauth', label: 'Google OAuth', icon: Chrome, badge: 'Convenient' },
  { id: 'brave-oauth', label: 'Brave OAuth', icon: Shield, badge: 'Privacy' },
];

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState<SignUpMethod>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      await login(selectedMethod, email || undefined, password || undefined);
      navigate('/');
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <DemoModeBanner />
      <div className="flex items-center justify-center min-h-[calc(100vh-40px)] p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Shield className="h-12 w-12 text-violet-600 mx-auto mb-3" />
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">CryptoSure</h1>
            <p className="text-sm text-slate-500 mt-1">Insurance you can prove</p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg p-6 cs-card">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Sign In</h2>

            {/* Auth method grid */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              {AUTH_METHODS.map((method) => {
                const Icon = method.icon;
                return (
                  <button
                    key={method.id}
                    onClick={() => setSelectedMethod(method.id)}
                    className={`flex flex-col items-center gap-1 rounded-lg border p-3 text-xs font-medium transition-colors ${
                      selectedMethod === method.id
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

            {selectedMethod === 'email' && (
              <div className="space-y-3 mb-4">
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>
            )}

            {error && (
              <p className="text-sm text-red-500 mb-3">{error}</p>
            )}

            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-50 transition-colors"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? 'Authenticating...' : `Sign in with ${AUTH_METHODS.find(m => m.id === selectedMethod)?.label}`}
            </button>

            <p className="text-center text-sm text-slate-500 mt-4">
              New here?{' '}
              <Link to="/signup" className="text-violet-600 font-medium hover:underline">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
