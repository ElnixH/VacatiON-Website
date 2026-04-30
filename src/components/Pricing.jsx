import { Check } from 'lucide-react';
import { useState } from 'react';

const plans = [
  {
    name: 'Starter',
    monthly: 0,
    annual: 0,
    description: 'Everything you need to get started.',
    cta: 'Get started free',
    highlight: false,
    features: [
      '3 projects',
      'Up to 5 team members',
      '10 GB storage',
      'Community support',
      'Basic analytics',
    ],
  },
  {
    name: 'Pro',
    monthly: 49,
    annual: 39,
    description: 'For growing teams shipping serious products.',
    cta: 'Start free trial',
    highlight: true,
    features: [
      'Unlimited projects',
      'Up to 25 team members',
      '100 GB storage',
      'Priority email support',
      'Advanced analytics',
      'Custom domains',
      'SSO & SAML',
    ],
  },
  {
    name: 'Enterprise',
    monthly: 199,
    annual: 159,
    description: 'For organizations that need total control.',
    cta: 'Talk to sales',
    highlight: false,
    features: [
      'Unlimited everything',
      'Unlimited team members',
      'Unlimited storage',
      'Dedicated support',
      'SLA guarantees',
      'Custom contracts',
      'Audit logs',
      'On-premise option',
    ],
  },
];

export default function Pricing() {
  const [annual, setAnnual] = useState(true);

  return (
    <section id="pricing" className="py-28 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* section header */}
        <div className="text-center mb-12">
          <span className="inline-block px-3 py-1 rounded-full bg-sky-50 text-sky-600 text-xs font-semibold tracking-wide uppercase mb-4">
            Pricing
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight mb-4">
            Simple, honest pricing
          </h2>
          <p className="max-w-xl mx-auto text-slate-500 text-lg mb-8">
            No hidden fees. No surprises. Cancel any time.
          </p>

          {/* billing toggle */}
          <div className="inline-flex items-center gap-3 bg-slate-100 rounded-xl p-1">
            <button
              onClick={() => setAnnual(false)}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                !annual ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
                annual ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'
              }`}
            >
              Annual
              <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 text-xs font-bold">
                -20%
              </span>
            </button>
          </div>
        </div>

        {/* pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl p-8 border transition-all duration-300 ${
                plan.highlight
                  ? 'bg-slate-900 border-slate-700 shadow-2xl shadow-slate-900/20 scale-105'
                  : 'bg-white border-slate-100 hover:border-slate-200 hover:shadow-lg'
              }`}
            >
              {plan.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-sky-500 text-white text-xs font-bold tracking-wide uppercase">
                  Most popular
                </span>
              )}

              <p className={`text-sm font-semibold mb-1 ${plan.highlight ? 'text-sky-400' : 'text-sky-500'}`}>
                {plan.name}
              </p>
              <div className="flex items-end gap-1 mb-1">
                <span className={`text-4xl font-bold tracking-tight ${plan.highlight ? 'text-white' : 'text-slate-900'}`}>
                  ${annual ? plan.annual : plan.monthly}
                </span>
                {plan.monthly > 0 && (
                  <span className={`text-sm mb-1.5 ${plan.highlight ? 'text-slate-400' : 'text-slate-400'}`}>
                    /mo
                  </span>
                )}
              </div>
              <p className={`text-sm mb-6 ${plan.highlight ? 'text-slate-400' : 'text-slate-500'}`}>
                {plan.description}
              </p>

              <a
                href="#"
                className={`block w-full text-center px-5 py-3 rounded-xl font-semibold text-sm transition-all duration-200 active:scale-95 mb-8 ${
                  plan.highlight
                    ? 'bg-sky-500 hover:bg-sky-400 text-white hover:shadow-lg hover:shadow-sky-500/30'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-900 border border-slate-200'
                }`}
              >
                {plan.cta}
              </a>

              <ul className="space-y-3">
                {plan.features.map((feat) => (
                  <li key={feat} className="flex items-center gap-2.5">
                    <Check
                      size={15}
                      className={plan.highlight ? 'text-sky-400 shrink-0' : 'text-emerald-500 shrink-0'}
                    />
                    <span className={`text-sm ${plan.highlight ? 'text-slate-300' : 'text-slate-600'}`}>
                      {feat}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
      </div>
    </section>
  );
}