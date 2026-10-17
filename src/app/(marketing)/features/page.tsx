import Link from 'next/link';
import {
  Calculator,
  Sliders,
  ShoppingBag,
  Layers,
  Receipt,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

const featureCategories = [
  {
    category: 'Deterministic Batch Costing Engine',
    icon: Calculator,
    desc: 'The mathematical backbone of your product business. Built to prevent common handmade maker omissions.',
    items: [
      {
        title: 'Wholesale Pack Proportions',
        desc: 'Enter what you paid per 1kg, 5L, or 100-pack. CheckMargin computes the exact fraction used in grams, ml, or pieces.',
      },
      {
        title: 'True Saleable Yield Accounting',
        desc: 'Failed batches and scrap are absorbed strictly across saleable units. Defect rate never silently eats your profit.',
      },
      {
        title: 'Direct Craft Labour Costing',
        desc: 'Log pouring, blending, baking, or assembling hours and apply an hourly rate. Your time has real monetary worth.',
      },
      {
        title: 'Packaging & Consumables Allocation',
        desc: 'Track boxes, tissue, thank-you cards, custom tape, and warning labels per unit with precise accounting.',
      },
      {
        title: 'Fixed Batch Overhead',
        desc: 'Allocate shared energy, heating, equipment depreciation, and studio rent proportionally across your batch.',
      },
    ],
  },
  {
    category: 'Strategic Pricing Scenarios & Wholesale (B2B)',
    icon: Sliders,
    desc: 'Never confuse markup with margin again. Set prices that withstand real marketplace deductions and wholesale buyer terms.',
    items: [
      {
        title: 'Markup vs Target Margin Clarity',
        desc: 'A 50% markup on a ₹100 cost gives a ₹150 price (33% margin). CheckMargin explains both models in plain language.',
      },
      {
        title: 'Wholesale vs Retail Tier Matrix',
        desc: 'Simulate B2B wholesale prices (2× cost) vs retail MSRP (4× cost) to ensure 50% margin for both you and your stockists.',
      },
      {
        title: 'MOQ Cash Flow & Gross Profit',
        desc: 'Calculate total order value and gross cash generated from Minimum Order Quantity runs.',
      },
      {
        title: 'Marketplace & Gateway Fee Deduction',
        desc: 'Simulate Amazon (referral + closing + GST), Meesho, Etsy, or Shopify fees before you set your listing prices.',
      },
      {
        title: 'Seller-Paid Shipping Impact',
        desc: 'Evaluate how "Free Shipping" promotions affect your bottom line on low-ticket vs high-ticket orders.',
      },
    ],
  },
  {
    category: 'Production Planning & 1-Click Batch Scaler',
    icon: ShoppingBag,
    desc: 'Translate orders into concrete, actionable wholesale procurement lists with economies of scale.',
    items: [
      {
        title: '1-Click Batch Multiplier (2x, 5x, 10x)',
        desc: 'Scale recipes up instantly with realistic labour efficiency curves — see cost per unit drop as production expands.',
      },
      {
        title: 'Target Run Shopping List',
        desc: 'Enter your upcoming target batch volume and get an exact breakdown of grams, litres, and units required.',
      },
      {
        title: 'Pack-Size Upward Rounding',
        desc: 'Suppliers don’t sell 340g of wax; they sell 1kg blocks. CheckMargin calculates the exact packs to buy and cash required.',
      },
    ],
  },
  {
    category: 'Recipe Library & Snapshots',
    icon: Layers,
    desc: 'Maintain an authoritative archive of all product recipes and historical calculations.',
    items: [
      {
        title: 'Permanent Recipe Preservation',
        desc: 'Update raw material costs when suppliers change prices without silently altering historical calculation records.',
      },
      {
        title: 'Clean Export Options',
        desc: 'Export clean CSV summaries for your accountant or team members with a single click.',
      },
    ],
  },
];

export default function FeaturesPage() {
  return (
    <div className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-20">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Product Capabilities</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Everything You Need to Cost & Price Right
        </h1>
        <p className="mt-4 text-base sm:text-lg text-slate-600">
          Built specifically for the workflow of small-batch product manufacturing. Clear, transparent, and deterministic.
        </p>
      </div>

      {/* Feature Blocks */}
      <div className="space-y-16">
        {featureCategories.map((cat) => {
          const Icon = cat.icon;
          return (
            <div key={cat.category} className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 shadow-xs">
              <div className="flex items-center gap-3.5 mb-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-black text-slate-900">{cat.category}</h2>
              </div>
              <p className="text-sm text-slate-500 max-w-2xl mb-8 leading-relaxed">{cat.desc}</p>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {cat.items.map((item) => (
                  <div key={item.title} className="bg-slate-50 border border-slate-200 rounded-2xl p-6 hover:border-slate-300 transition-colors">
                    <h3 className="font-bold text-slate-900 text-base mb-2">{item.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom CTA */}
      <div className="text-center pt-8">
        <Link
          href="/calculator"
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base px-9 py-4 rounded-xl shadow-lg shadow-indigo-500/25 transition-all"
        >
          <span>Try the Interactive Calculator Free</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
