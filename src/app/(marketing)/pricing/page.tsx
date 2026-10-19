import Link from 'next/link';
import { Check, Sparkles, ArrowRight } from 'lucide-react';

const plans = [
  {
    name: 'Starter Free',
    price: '₹0',
    period: 'forever',
    description: 'Perfect for new makers evaluating their first product batches.',
    features: [
      'Up to 3 saved product recipes',
      'Batch-by-batch cost calculator',
      'Raw material pack pricing engine',
      'Yield & wastage loss adjustment',
      'Suggested markup & margin prices',
      'Material shopping list generator',
      'Export calculation summary (CSV)',
    ],
    notIncluded: [
      'Unlimited saved products',
      'Historical price snapshot tracking',
      'Marketplace fee presets library',
      'Priority email & WhatsApp support',
    ],
    cta: 'Start Free Today',
    href: '/auth/signup',
    highlight: false,
  },
  {
    name: 'Pro Maker',
    price: '₹299',
    period: '/month',
    description: 'For active makers & businesses who cost every production batch.',
    features: [
      'Unlimited saved product recipes',
      'Full batch cost calculation engine',
      'Yield & failed batch absorption',
      'Direct labour & overhead allocation',
      'Configurable channel & marketplace fees',
      'GST handling (HSN & inclusive/exclusive)',
      'Dynamic shopping list for bulk runs',
      'Calculation snapshot version history',
      'PDF & CSV export with professional layout',
      'Priority support',
    ],
    notIncluded: [],
    cta: 'Start 14-Day Free Trial',
    href: '/auth/signup?plan=pro',
    highlight: true,
  },
  {
    name: 'Annual Pro',
    price: '₹2,499',
    period: '/year',
    description: 'Save over 30% — pay once, cost your batches all year.',
    features: [
      'Everything included in Pro Maker',
      'Save ₹1,089 every year',
      'Lock in current rate permanently',
      'One-on-one recipe costing review session',
      'First access to supplier catalog tools',
    ],
    notIncluded: [],
    cta: 'Get Annual Pro',
    href: '/auth/signup?plan=annual',
    highlight: false,
  },
];

export default function PricingPage() {
  return (
    <div className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Transparent & Founder-Friendly</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Simple, Fair Pricing for Every Stage
        </h1>
        <p className="mt-4 text-base sm:text-lg text-slate-600">
          Try the batch calculator completely free. Upgrade only when you want unlimited recipe storage and version snapshots.
        </p>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
        {plans.map((p) => (
          <div
            key={p.name}
            className={`rounded-3xl p-8 flex flex-col justify-between transition-all ${
              p.highlight
                ? 'bg-white border-2 border-indigo-600 shadow-xl shadow-indigo-500/10 ring-4 ring-indigo-50 relative'
                : 'bg-white border border-slate-200 shadow-xs hover:border-slate-300'
            }`}
          >
            {p.highlight && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[11px] font-black uppercase tracking-wider px-3.5 py-1 rounded-full shadow-sm">
                Most Popular
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-black text-slate-900">{p.name}</h3>
              </div>
              <div className="flex items-baseline gap-1 my-3">
                <span className="text-4xl sm:text-5xl font-black text-slate-900">{p.price}</span>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{p.period}</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed mb-6">{p.description}</p>

              <div className="pt-6 border-t border-slate-100 space-y-3">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Included Capabilities:
                </span>
                {p.features.map((f) => (
                  <div key={f} className="flex items-start gap-2.5 text-xs text-slate-700 font-medium">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </div>
                ))}
                {p.notIncluded.map((f) => (
                  <div key={f} className="flex items-start gap-2.5 text-xs text-slate-400">
                    <span className="w-4 h-4 text-center shrink-0 text-slate-300">—</span>
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-8">
              <Link
                href={p.cta === 'Start Free Today' ? '/calculator' : p.href}
                className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                  p.highlight
                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/25'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-900'
                }`}
              >
                <span>{p.cta}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* FAQ Section */}
      <div className="mt-24 max-w-4xl mx-auto bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 shadow-xs">
        <h2 className="text-2xl font-black text-slate-900 text-center mb-10">Frequently Asked Questions</h2>
        <div className="grid sm:grid-cols-2 gap-8 text-sm">
          <div>
            <h4 className="font-bold text-slate-900 mb-2">Can I use the calculator without paying?</h4>
            <p className="text-slate-600 text-xs leading-relaxed">
              Yes! The core calculator is 100% free to use. You can calculate batch costs, price scenarios, and shopping lists anytime without entering a credit card.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 mb-2">How does recipe-to-batch costing work?</h4>
            <p className="text-slate-600 text-xs leading-relaxed">
              Unlike generic calculators, you enter wholesale pack sizes (e.g. ₹850 for 1kg wax) and batch quantities (150g). CheckMargin calculates the true proportional cost per unit based on saleable yield.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 mb-2">What if I sell on multiple channels?</h4>
            <p className="text-slate-600 text-xs leading-relaxed">
              You can configure distinct fees for Amazon, Meesho, Etsy, your own website, or offline flea markets to see how your profit changes per channel.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 mb-2">Is GST advice included?</h4>
            <p className="text-slate-600 text-xs leading-relaxed">
              CheckMargin provides mathematical GST separation (taxable value vs GST collected), but is an operational tool and not tax or accounting advice. Always consult your CA.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
