import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Wallet, GraduationCap, Bot, Loader2, Check } from 'lucide-react';
import { useProviders, useAuth } from '../providers/context';

const STEPS = ['Identity', 'Coverage', 'EDU', 'Agent', 'Review'] as const;

export function OnboardingPage() {
  const providers = useProviders();
  const { session } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [world, setWorld] = useState<'wallet' | 'everyday' | 'gaming'>('wallet');
  const [tier, setTier] = useState<'T0' | 'T1' | 'T2' | 'T3'>('T1');
  const [agentCap, setAgentCap] = useState(1000);
  const [didzReg, setDidzReg] = useState(false);

  const handleFinish = async () => {
    setLoading(true);
    try {
      if (!didzReg) await providers.didz.registerIdentity();
      await providers.policies.buyPolicy({ world, tier, scopeHash: '0xscope_demo_v1' });
      if (agentCap > 0) await providers.agenticDID.createGrant('demo-agent', agentCap, agentCap * 5);
      navigate('/');
    } catch (e) {
      console.error(e);
    } finally { setLoading(false); }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Client Onboarding</h1>
        <p className="text-sm text-slate-500 mt-1">New client template — get insured in 5 steps</p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-2">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-2 flex-1">
            <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-medium shrink-0 ${
              step >= i ? 'bg-violet-600 text-white' : 'bg-slate-200 text-slate-400'
            }`}>{step > i ? <Check className="h-4 w-4" /> : i + 1}</div>
            <span className={`text-xs hidden sm:block ${step >= i ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>{s}</span>
            {i < STEPS.length - 1 && <div className={`h-1 flex-1 ${step > i ? 'bg-violet-600' : 'bg-slate-200'}`} />}
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm p-6 cs-card">
        {/* Step 1: Identity */}
        {step === 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-violet-600" />
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">DIDz Identity</h2>
              <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">PLACEHOLDER</span>
            </div>
            <p className="text-sm text-slate-500">
              Your DIDz identity is a non-transferable registry entry on Midnight. It links your credit score attestation to your insurance profile — without revealing your identity on-chain.
            </p>
            <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-4 text-sm">
              <p className="text-slate-600 dark:text-slate-300">Name: {session?.displayName || '—'}</p>
              <p className="text-slate-600 dark:text-slate-300">Email: {session?.email || '—'}</p>
              <p className="text-slate-600 dark:text-slate-300">DIDz Commitment: <code className="text-xs">{session?.didzCommitment || 'Not registered'}</code></p>
            </div>
            <button onClick={() => setStep(1)} className="w-full rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-700">Continue</button>
          </div>
        )}

        {/* Step 2: Coverage */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-violet-600" />
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Select Coverage</h2>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {(['wallet', 'everyday', 'gaming'] as const).map((w) => (
                <button key={w} onClick={() => setWorld(w)}
                  className={`rounded-lg border p-3 text-sm font-medium capitalize ${world === w ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20' : 'border-slate-200 dark:border-slate-700'}`}>
                  {w}
                </button>
              ))}
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Coverage Tier</p>
              {(['T0', 'T1', 'T2', 'T3'] as const).map((t) => (
                <button key={t} onClick={() => setTier(t)}
                  className={`w-full text-left rounded-lg border p-3 ${tier === t ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20' : 'border-slate-200 dark:border-slate-700'}`}>
                  <span className="text-sm font-medium">{t}</span>
                  <span className="text-sm text-slate-500 ml-2">${{ T0: 500, T1: 1000, T2: 5000, T3: 10000 }[t]} coverage</span>
                  {(t === 'T2' || t === 'T3') && <span className="text-xs text-amber-600 ml-2">EDU required</span>}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <button onClick={() => setStep(0)} className="flex-1 rounded-lg border border-slate-200 dark:border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-600">Back</button>
              <button onClick={() => setStep(2)} className="flex-1 rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-700">Continue</button>
            </div>
          </div>
        )}

        {/* Step 3: EDU */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-violet-600" />
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">EDU Certification</h2>
            </div>
            <p className="text-sm text-slate-500">
              {(tier === 'T2' || tier === 'T3') ? 'EDU certification is required for this tier. Complete the modules before activation.' : 'EDU is optional for your tier but gives a premium discount.'}
            </p>
            <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 p-4 text-sm text-blue-700 dark:text-blue-300">
              You must personally sign the scope acceptance. This is non-delegable — even if an agent manages your policy.
            </div>
            <div className="flex gap-2">
              <button onClick={() => setStep(1)} className="flex-1 rounded-lg border border-slate-200 dark:border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-600">Back</button>
              <button onClick={() => setStep(3)} className="flex-1 rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-700">Continue</button>
            </div>
          </div>
        )}

        {/* Step 4: Agent */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-violet-600" />
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Agent Delegation (Optional)</h2>
              <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">PLACEHOLDER</span>
            </div>
            <p className="text-sm text-slate-500">
              Delegate policy management to an AgenticDID agent with spend caps. Both per-action and cumulative caps are enforced on-chain.
            </p>
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Per-action cap (USD)</label>
              <input type="number" value={agentCap} onChange={(e) => setAgentCap(Number(e.target.value))}
                className="w-full mt-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm" />
              <p className="text-xs text-slate-400 mt-1">Cumulative cap: ${agentCap * 5} (5x per-action)</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setStep(2)} className="flex-1 rounded-lg border border-slate-200 dark:border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-600">Back</button>
              <button onClick={() => setStep(4)} className="flex-1 rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-700">Continue</button>
            </div>
          </div>
        )}

        {/* Step 5: Review */}
        {step === 4 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Review & Confirm</h2>
            <div className="rounded-lg bg-slate-50 dark:bg-slate-800 p-4 space-y-2 text-sm">
              <p><span className="text-slate-500">Coverage:</span> <span className="font-medium capitalize">{world} — {tier}</span></p>
              <p><span className="text-slate-500">Coverage limit:</span> <span className="font-medium">${{ T0: 500, T1: 1000, T2: 5000, T3: 10000 }[tier]}</span></p>
              <p><span className="text-slate-500">EDU required:</span> <span className="font-medium">{tier === 'T2' || tier === 'T3' ? 'Yes' : 'No'}</span></p>
              <p><span className="text-slate-500">Agent cap:</span> <span className="font-medium">{agentCap > 0 ? `$${agentCap}/action` : 'None'}</span></p>
              <p><span className="text-slate-500">DIDz:</span> <span className="font-medium">{didzReg ? 'Registered' : 'Will register'}</span></p>
            </div>
            <button onClick={handleFinish} disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-50">
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? 'Processing...' : 'Complete Onboarding'}
            </button>
            <button onClick={() => setStep(3)} className="w-full text-sm text-slate-500">Back</button>
          </div>
        )}
      </div>
    </div>
  );
}
