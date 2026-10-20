'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Megaphone,
  Target,
  ShoppingBag,
  Truck,
  Calendar,
  Sparkles,
  ArrowRight,
  Lightbulb,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  DollarSign,
  ShieldCheck,
  Zap,
  BarChart3,
  Package,
  Layers,
} from 'lucide-react';
import {
  CATEGORY_MARKETING_PLAYBOOKS,
  getCategoryMarketingPlaybook,
  type CategoryMarketingPlaybook,
} from '@/lib/category-marketing-guides';
import { BUSINESS_CATEGORIES } from '@/lib/business-categories';

export default function MarketingGuidePage() {
  const [selectedCategoryKey, setSelectedCategoryKey] = useState<string>('candles-fragrance');
  
  // Interactive CAC & ROAS Simulator State
  const [calcSellingPrice, setCalcSellingPrice] = useState<number>(699);
  const [calcMarginPercent, setCalcMarginPercent] = useState<number>(50); // 50% gross margin

  const activePlaybook: CategoryMarketingPlaybook = getCategoryMarketingPlaybook(selectedCategoryKey);

  // Dynamic calculations
  const grossProfitBeforeAds = Math.round(calcSellingPrice * (calcMarginPercent / 100));
  const suggestedAdSpend = Math.round(calcSellingPrice * (activePlaybook.adStrategy.recommendedAdSpendPercent / 100));
  const maxAllowableCac = Math.round(calcSellingPrice * (activePlaybook.adStrategy.maxHealthyCacPercent / 100));
  const netProfitAfterAds = grossProfitBeforeAds - suggestedAdSpend;
  const breakEvenRoas = (calcSellingPrice / grossProfitBeforeAds).toFixed(1);

  return (
    <div className="bg-slate-50 text-slate-900 pb-24">
      {/* Hero Header */}
      <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24 border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-200/80 rounded-full px-4 py-1.5 text-xs font-bold text-indigo-700 mb-6 shadow-xs">
            <Megaphone className="w-4 h-4 text-indigo-600" />
            <span>Category-Specific Ad Spend, CAC Limits & Channel Strategy</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15] max-w-4xl mx-auto">
            The Product Maker’s Guide to{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
              Profitable Ads & Channel Growth
            </span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Stop blowing ad budget on single low-ticket items. Learn how much Customer Acquisition Cost (CAC) your margins can afford, which channels convert, and how to stop COD return losses in India.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href="#cac-simulator"
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm px-6 py-3.5 rounded-xl shadow-md shadow-indigo-500/25 transition-all"
            >
              <Target className="w-4 h-4" />
              <span>Interactive CAC & ROAS Simulator</span>
            </a>

            <Link
              href="/calculator"
              className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm px-6 py-3.5 rounded-xl border border-slate-300 transition-colors shadow-xs"
            >
              <span>Open Batch Cost Calculator</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Interactive CAC & ROAS Simulator Section */}
      <section id="cac-simulator" className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="bg-white border-2 border-indigo-200/80 rounded-3xl p-6 sm:p-10 shadow-lg shadow-indigo-500/5">
          <div className="max-w-2xl mx-auto text-center mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-1 block">Live Unit Economics Tool</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Calculate Your Safe Ad Spend & Target ROAS
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Test what happens to your actual take-home profit after paying Meta/Google ads for acquiring a customer.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Left Controls */}
            <div className="md:col-span-6 space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  1. Select Category for Benchmark Rates
                </label>
                <select
                  value={selectedCategoryKey}
                  onChange={(e) => setSelectedCategoryKey(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {BUSINESS_CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.icon} {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex justify-between items-center text-xs font-bold text-slate-700 mb-2">
                  <span>2. Product Selling Price / AOV:</span>
                  <span className="text-base font-black text-indigo-600">₹{calcSellingPrice}</span>
                </div>
                <input
                  type="range"
                  min="299"
                  max="2999"
                  step="50"
                  value={calcSellingPrice}
                  onChange={(e) => setCalcSellingPrice(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>₹299</span>
                  <span>₹1,500</span>
                  <span>₹2,999</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center text-xs font-bold text-slate-700 mb-2">
                  <span>3. Expected Gross Margin Before Ads:</span>
                  <span className="text-base font-black text-emerald-600">{calcMarginPercent}%</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="80"
                  step="5"
                  value={calcMarginPercent}
                  onChange={(e) => setCalcMarginPercent(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>20% (Thin)</span>
                  <span>50% (Standard)</span>
                  <span>80% (Premium)</span>
                </div>
              </div>
            </div>

            {/* Right Live Results */}
            <div className="md:col-span-6 bg-slate-50 border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block pb-2 border-b border-slate-200">
                Marketing Intelligence Results ({activePlaybook.categoryName.split('(')[0].trim()})
              </span>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                    Recommended CAC
                  </span>
                  <span className="text-xl font-black text-indigo-700">₹{suggestedAdSpend}</span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">
                    ({activePlaybook.adStrategy.recommendedAdSpendPercent}% of price)
                  </span>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                    Target Blended ROAS
                  </span>
                  <span className="text-xl font-black text-slate-900">{activePlaybook.adStrategy.targetRoas}</span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">Meta / Google target</span>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                    Max Breakeven CAC
                  </span>
                  <span className="text-xl font-black text-rose-600">₹{grossProfitBeforeAds}</span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">Zero profit ceiling</span>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                    Take-Home Profit / Unit
                  </span>
                  <span className={`text-xl font-black ${netProfitAfterAds > 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                    ₹{netProfitAfterAds}
                  </span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">After all ad spend</span>
                </div>
              </div>

              <div className="p-3 bg-indigo-50/80 rounded-xl border border-indigo-100 text-xs text-indigo-950 font-medium">
                💡 <strong>Breakeven ROAS Rule:</strong> You must maintain at least <strong>{breakEvenRoas}x ROAS</strong> just to cover your materials, labour, and logistics without losing money.
              </div>

              <Link
                href={`/calculator?category=${selectedCategoryKey}`}
                className="w-full inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-3 px-4 rounded-xl shadow-sm transition-colors"
              >
                <span>Test Exact Batch Cost in Calculator</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* The 4 Golden Rules Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-1 block">Founder Knowledge</span>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            The 4 Golden Rules of Small Business Advertising
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            Most makers waste their first ₹20,000 on Meta ads by making these classic setup mistakes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3">
            <span className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 font-black text-sm flex items-center justify-center">
              1
            </span>
            <h3 className="font-bold text-slate-900 text-base">Never Run Ads to an AOV Below ₹750</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              If your average cost per purchase (CAC) is ₹180 on Meta, trying to sell a single ₹299 candle leaves literally ₹0 profit after materials, shipping, and 18% GST. Always bundle into duo gift sets or 3-packs to push order value to ₹800+.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3">
            <span className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 font-black text-sm flex items-center justify-center">
              2
            </span>
            <h3 className="font-bold text-slate-900 text-base">Stop Using the &ldquo;Boost Post&rdquo; Button</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Boosting a post optimizes for likes and video views, not sales. Always use Meta Ads Manager to create <strong>Advantage+ Sales / Purchase</strong> campaigns with the Meta Pixel properly recording real checkouts.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3">
            <span className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 font-black text-sm flex items-center justify-center">
              3
            </span>
            <h3 className="font-bold text-slate-900 text-base">The 3-Second Visual Hook Rule</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Static white-background catalogue images get scrolled past. Top-performing maker ads show satisfying ASMR demolding, wax pouring, slow-motion brownie chocolate pulls, or dramatic before-and-after skin texture changes in the first 3 seconds.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3">
            <span className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 font-black text-sm flex items-center justify-center">
              4
            </span>
            <h3 className="font-bold text-slate-900 text-base">The Anti-RTO Shield for India</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Unverified Cash-on-Delivery (COD) orders suffer 25%–40% Return-to-Origin rates, killing small makers on two-way shipping loss. Offer a ₹50 discount for UPI prepaid and use automated WhatsApp order confirmation before dispatching.
            </p>
          </div>
        </div>
      </section>

      {/* Complete Category Playbook Explorer */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-1 block">Category Playbooks</span>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            Explore Growth Strategies by Product Category
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            Click on your category below to unlock its full marketing tactics, viral ad hooks, selling channels, and seasonal calendar.
          </p>
        </div>

        {/* Category Selector Pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {BUSINESS_CATEGORIES.map((cat) => {
            const isActive = selectedCategoryKey === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategoryKey(cat.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20 ring-2 ring-indigo-500/30'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-xs'
                }`}
              >
                <span className="text-base">{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Category Comprehensive Breakdown Card */}
        <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <span className="text-4xl p-3 bg-indigo-50 rounded-2xl border border-indigo-100">
                {activePlaybook.icon}
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                    Comprehensive Strategy Guide
                  </span>
                  {activePlaybook.badge && (
                    <span className="text-xs font-bold text-violet-700 bg-violet-50 px-2 py-0.5 rounded-full">
                      {activePlaybook.badge}
                    </span>
                  )}
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                  {activePlaybook.categoryName}
                </h3>
              </div>
            </div>

            <Link
              href={`/calculator?category=${selectedCategoryKey}`}
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-xs transition-colors self-start sm:self-auto"
            >
              <span>Launch {activePlaybook.categoryName.split('(')[0].trim()} in Calculator</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Grid of Strategy Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Pillar 1: Ad Strategy & Video Formats */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-black text-slate-900 uppercase tracking-wider">
                <Target className="w-4 h-4 text-indigo-600" />
                <span>1. Meta / Google Ad Creative Formats</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-700">
                {activePlaybook.adStrategy.bestAdFormats.map((format, idx) => (
                  <li key={idx} className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{format}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-2">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block mb-2">
                  🪝 Proven Reel & Ad Hook Scripts:
                </span>
                <div className="space-y-2">
                  {activePlaybook.adStrategy.testedHooks.map((hook, idx) => (
                    <div key={idx} className="p-2.5 bg-indigo-50/70 rounded-xl border border-indigo-100 text-xs font-semibold text-indigo-950">
                      {hook}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Pillar 2: Sales Channels & Bundling */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-black text-slate-900 uppercase tracking-wider">
                <ShoppingBag className="w-4 h-4 text-indigo-600" />
                <span>2. Selling Channels & Profitable Bundles</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider block mb-0.5">Primary Sales Engine</span>
                <span className="font-bold text-slate-900 text-sm block">{activePlaybook.channelFit.primaryChannel}</span>
                <p className="text-slate-500 mt-1">{activePlaybook.channelFit.channelNotes}</p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    High-AOV Bundling Playbook:
                  </span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    Target AOV: ₹{activePlaybook.channelFit.minViableAov}+
                  </span>
                </div>
                <div className="space-y-2">
                  {activePlaybook.channelFit.bundlingPlaybook.map((bundle, idx) => (
                    <div key={idx} className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-xs font-semibold text-slate-800 flex items-center justify-between">
                      <span>{bundle}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Anti-RTO Box */}
              <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-950 uppercase tracking-wider flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-amber-600" />
                    <span>RTO & Shipping Shield</span>
                  </span>
                  <span className="text-[11px] font-bold text-amber-800 bg-amber-100/70 px-2 py-0.5 rounded">
                    {activePlaybook.rtoAndLogistics.benchmarkRtoRate}
                  </span>
                </div>
                <ul className="space-y-1.5 text-xs text-amber-900">
                  {activePlaybook.rtoAndLogistics.codReductionTactics.slice(0, 2).map((tactic, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-amber-600 font-bold">•</span>
                      <span>{tactic}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom Row: Seasonality & Margin Rules */}
          <div className="pt-6 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Peak Demand Seasons
              </span>
              <div className="flex flex-wrap gap-1">
                {activePlaybook.seasonalCalendar.peakMonths.map((m, idx) => (
                  <span key={idx} className="px-2 py-0.5 bg-white border border-slate-200 rounded font-bold text-slate-800 text-[11px]">
                    {m}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Pricing & Markup Rules
              </span>
              <span className="font-bold text-slate-900 block text-sm">{activePlaybook.marginGuardrails.minMarkupMultiple}</span>
              <span className="text-slate-500 block text-[11px] mt-0.5">Wholesale: {activePlaybook.marginGuardrails.maxWholesaleDiscount}</span>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Free Shipping Threshold
              </span>
              <span className="font-bold text-indigo-700 block text-sm">₹{activePlaybook.marginGuardrails.freeShippingThreshold}+</span>
              <span className="text-slate-500 block text-[11px] mt-0.5">Lead Time: {activePlaybook.seasonalCalendar.leadTimeWeeks} weeks</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
