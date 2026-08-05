import { Link } from 'react-router-dom';
import { ArrowRight, BookOpenCheck, FileSearch, ShieldCheck, SlidersHorizontal } from 'lucide-react';

const journeySteps = [
  {
    number: '01',
    title: 'Choose the risk',
    copy: 'Start with a defined event instead of an open-ended promise.',
    to: '/onboarding',
    icon: SlidersHorizontal,
  },
  {
    number: '02',
    title: 'Prove readiness',
    copy: 'Explore education and security requirements without connecting a wallet.',
    to: '/edu',
    icon: BookOpenCheck,
  },
  {
    number: '03',
    title: 'Review the scope',
    copy: 'See simulated limits, conditions, and exclusions before any decision.',
    to: '/policies',
    icon: ShieldCheck,
  },
  {
    number: '04',
    title: 'Walk a claim',
    copy: 'Follow evidence, review, and settlement as a transparent simulation.',
    to: '/claims',
    icon: FileSearch,
  },
];

export function GuidedJourney() {
  return (
    <section className="cs-journey" aria-labelledby="guided-journey-title">
      <div className="relative z-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-emerald-200">
            Guided DemoLand path
          </p>
          <h2 id="guided-journey-title" className="mt-3 max-w-2xl text-2xl font-semibold text-white md:text-4xl">
            Understand the promise before testing the product.
          </h2>
        </div>
        <p className="max-w-md text-sm leading-6 text-slate-400">
          Everything here is simulated. No wallet connection, payment, policy, or claim leaves this browser.
        </p>
      </div>

      <div className="relative z-10 mt-7 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {journeySteps.map((step) => {
          const Icon = step.icon;
          return (
            <Link
              key={step.number}
              to={step.to}
              className="group rounded-2xl border border-emerald-100/10 bg-slate-950/45 p-4 transition hover:border-emerald-200/30 hover:bg-slate-900/70 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            >
              <div className="flex items-center justify-between text-emerald-200">
                <span className="font-mono text-xs">{step.number}</span>
                <Icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <h3 className="mt-8 text-lg font-semibold text-white">{step.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">{step.copy}</p>
              <ArrowRight className="mt-5 h-4 w-4 text-emerald-200 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          );
        })}
      </div>
    </section>
  );
}
