import Link from 'next/link';
import {
  Calculator,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Layers,
  Coins,
  PackageCheck,
  Sliders,
  Receipt,
  Store,
} from 'lucide-react';

const niches = [
  { icon: '🕯️', title: 'Candle Makers', desc: 'Soy, beeswax, aroma jars & wax melts' },
  { icon: '🧼', title: 'Soaps & Skincare', desc: 'Cold-process, melt & pour, body butters' },
  { icon: '🎨', title: 'Resin & Jesmonite', desc: 'Coasters, trays, art pieces, casting' },
  { icon: '🧁', title: 'Bakery & Food', desc: 'Cakes, pastries, granolas, artisanal snacks' },
  { icon: '🧴', title: 'Cosmetics Brands', desc: 'Organic serums, perfumes, balms' },
  { icon: '🧵', title: 'Textile & Apparel', desc: 'Embroidered wear, scrunchies, tote bags' },
  { icon: '🪵', title: 'Home Decor & Pottery', desc: 'Ceramic mugs, plaster pots, wooden art' },
  { icon: '🍫', title: 'Small Manufacturers', desc: 'Any batch-produced consumer product' },
];

const painPoints = [
  {
    title: 'The "Material-Only" Illusion',
    desc: 'You calculate ₹120 for wax and fragrance, sell for ₹300, and believe you made 60% margin.',
    isLoss: true,
  },
  {
    title: 'Omitted Failed Batches & Yield',
    desc: 'Pouring 10 units with 2 defective ones means 8 saleable units must absorb 100% of the cost.',
    isLoss: true,
  },
  {
    title: 'Uncounted Platform & Gateway Fees',
    desc: 'Amazon, Meesho, or Shopify take 8% to 18% + fixed closing fees + 18% GST on their fee.',
    isLoss: true,
  },
  {
    title: 'Unpaid Labour & Packaging Realities',
    desc: 'Bubble wrap, custom boxes, labels, and 30 mins of your time often exceed raw material costs.',
    isLoss: true,
  },
];

export default function HomePage() {
  return (
    <div className="bg-slate-50 text-slate-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-32 border-b border-slate-200 bg-white">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-200/80 rounded-full px-4 py-1.5 text-xs font-bold text-indigo-700 mb-8 shadow-xs">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>The Batch Costing Engine for Small Business Founders</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-900 tracking-tight leading-[1.1] max-w-5xl mx-auto">
            Stop Guessing Your Cost.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
              Price for Real Profit.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            MakerMargin calculates the true cost per saleable unit for batch products — accounting for raw materials,
            production waste, failed batches, direct labour, packaging, and marketplace fees.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/calculator"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base px-8 py-4 rounded-xl shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all"
            >
              <Calculator className="w-5 h-5" />
              <span>Launch Free Batch Calculator</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/features"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-base px-8 py-4 rounded-xl border border-slate-300 hover:border-slate-400 shadow-xs transition-colors"
            >
              <span>Explore All Features</span>
            </Link>
          </div>

          {/* Trust points */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-semibold text-slate-500">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Works for grams, ml, pcs & metres</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Includes GST & Marketplace fees</span>
            </div>
          </div>
        </div>
      </section>

      {/* Target Categories Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-2">Designed For All Small-Batch Products</div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            If you make products in batches, MakerMargin was built for you
          </h2>
          <p className="mt-3 text-slate-600">
            Whether you blend, pour, bake, cast, sew, or assemble — recipe-to-batch costing gives you the clarity generic spreadsheets never can.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {niches.map((n) => (
            <div
              key={n.title}
              className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs hover:border-indigo-400 hover:shadow-md transition-all group"
            >
              <div className="text-3xl mb-3.5 group-hover:scale-110 transition-transform">{n.icon}</div>
              <h3 className="font-bold text-slate-900 text-lg mb-1">{n.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{n.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison: Mental Math vs MakerMargin Reality */}
      <section className="py-20 bg-slate-100/70 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-rose-600 mb-2">
              <AlertTriangle className="w-3.5 h-3.5" />
              The Underpricing Trap
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Why 80% of small product makers make far less than they think
            </h2>
            <p className="mt-3 text-slate-600">
              Comparing a standard mental estimate against verified batch-level unit economics:
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Without MakerMargin */}
            <div className="bg-white border-2 border-rose-200 rounded-3xl p-8 shadow-sm">
              <div className="inline-flex items-center gap-1.5 bg-rose-50 text-rose-700 text-xs font-bold px-3 py-1 rounded-full mb-6">
                <span>❌ The Naive Calculator Trap</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">What most makers do:</h3>
              <ul className="space-y-3 text-sm text-slate-600 mb-6">
                <li className="flex justify-between py-1.5 border-b border-slate-100">
                  <span>Raw Materials (Wax + Fragrance)</span>
                  <span className="font-semibold text-slate-800">₹140</span>
                </li>
                <li className="flex justify-between py-1.5 border-b border-slate-100 text-slate-400 line-through">
                  <span>Failed batch allowance</span>
                  <span>₹0 (ignored)</span>
                </li>
                <li className="flex justify-between py-1.5 border-b border-slate-100 text-slate-400 line-through">
                  <span>Your direct craft labour</span>
                  <span>₹0 (working free)</span>
                </li>
                <li className="flex justify-between py-1.5 border-b border-slate-100 text-slate-400 line-through">
                  <span>Marketplace commission & logistics</span>
                  <span>₹0 (ignored)</span>
                </li>
                <li className="flex justify-between py-2 font-bold text-slate-900 pt-3">
                  <span>Assumed Cost</span>
                  <span className="text-rose-600">₹140</span>
                </li>
                <li className="flex justify-between py-2 font-bold text-slate-900">
                  <span>Selling Price</span>
                  <span>₹399</span>
                </li>
                <li className="flex justify-between py-3 bg-rose-50 rounded-xl px-3 font-black text-rose-800">
                  <span>Expected Profit (Illusion)</span>
                  <span>+₹259 (65% margin)</span>
                </li>
              </ul>
              <p className="text-xs text-rose-600 font-medium">
                ⚠️ Reality check: By Month 3, bank account is empty despite continuous order volume.
              </p>
            </div>

            {/* With MakerMargin */}
            <div className="bg-white border-2 border-indigo-500 rounded-3xl p-8 shadow-lg shadow-indigo-500/10 relative">
              <div className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full mb-6">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                <span>✅ MakerMargin True Economics</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">The verified truth:</h3>
              <ul className="space-y-3 text-sm text-slate-600 mb-6">
                <li className="flex justify-between py-1.5 border-b border-slate-100">
                  <span>Raw Materials per saleable unit</span>
                  <span className="font-semibold text-slate-800">₹155 (with 10% scrap)</span>
                </li>
                <li className="flex justify-between py-1.5 border-b border-slate-100">
                  <span>Direct Labour (20 min @ ₹150/hr)</span>
                  <span className="font-semibold text-slate-800">₹50</span>
                </li>
                <li className="flex justify-between py-1.5 border-b border-slate-100">
                  <span>Packaging, label & box insert</span>
                  <span className="font-semibold text-slate-800">₹28</span>
                </li>
                <li className="flex justify-between py-1.5 border-b border-slate-100">
                  <span>Marketplace fee (12%) + fixed fees</span>
                  <span className="font-semibold text-slate-800">₹58</span>
                </li>
                <li className="flex justify-between py-1.5 border-b border-slate-100">
                  <span>Seller-paid shipping allocation</span>
                  <span className="font-semibold text-slate-800">₹60</span>
                </li>
                <li className="flex justify-between py-2 font-bold text-slate-900 pt-3">
                  <span>True Total Cost</span>
                  <span className="text-indigo-600">₹351</span>
                </li>
                <li className="flex justify-between py-3 bg-emerald-50 rounded-xl px-3 font-black text-emerald-800">
                  <span>Real Net Profit at ₹499 (Suggested)</span>
                  <span>+₹148 (30% margin)</span>
                </li>
              </ul>
              <p className="text-xs text-indigo-700 font-semibold">
                🎯 Correct price established. Founder paid for labour. Healthy bank cash flow.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Steps How It Works */}
      <section id="how-it-works" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-2">Simplicity & Speed</div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            How MakerMargin works in 4 simple steps
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              step: '01',
              icon: <Layers className="w-6 h-6 text-indigo-600" />,
              title: 'Add Ingredients & Packs',
              desc: 'Enter what you paid for your wholesale pack (e.g. ₹900 per 1kg) and how much goes into the batch.',
            },
            {
              step: '02',
              icon: <Sliders className="w-6 h-6 text-indigo-600" />,
              title: 'Set Batch & Yield',
              desc: 'Input units produced and failed units. The engine allocates costs only across saleable yield.',
            },
            {
              step: '03',
              icon: <Coins className="w-6 h-6 text-indigo-600" />,
              title: 'Add Labour, Fees & Shipping',
              desc: 'Include packaging, direct craft hours, and sales channel fees (Amazon, Meesho, Etsy, or web).',
            },
            {
              step: '04',
              icon: <TrendingUp className="w-6 h-6 text-indigo-600" />,
              title: 'Price with Precision',
              desc: 'Get recommended retail and wholesale price points, net margins, and an automated shopping list.',
            },
          ].map((s) => (
            <div key={s.step} className="bg-white border border-slate-200 rounded-2xl p-7 shadow-xs relative">
              <div className="text-3xl font-black text-slate-200 mb-4">{s.step}</div>
              <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mb-4">
                {s.icon}
              </div>
              <h3 className="font-bold text-slate-900 text-lg mb-2">{s.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive CTA Banner */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-gradient-to-tr from-indigo-700 via-indigo-600 to-violet-700 rounded-3xl p-10 sm:p-16 text-center text-white shadow-xl shadow-indigo-600/20 relative overflow-hidden">
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight mb-6">
              Start Costing Your Products Correctly Today
            </h2>
            <p className="text-indigo-100 text-lg sm:text-xl mb-10 leading-relaxed">
              No spreadsheets to break. No complicated accounting jargon. Just clean, deterministic numbers to protect your business margins.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/calculator"
                className="w-full sm:w-auto bg-white hover:bg-slate-100 text-indigo-700 font-black text-base px-9 py-4 rounded-xl shadow-md transition-all"
              >
                Open Free Calculator →
              </Link>
              <Link
                href="/auth/signup"
                className="w-full sm:w-auto bg-indigo-800/60 hover:bg-indigo-800 text-white font-semibold text-base px-8 py-4 rounded-xl border border-indigo-400/40 transition-colors"
              >
                Create Account (Free)
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
