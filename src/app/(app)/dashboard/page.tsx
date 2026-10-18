'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Calculator,
  Package,
  Sparkles,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  Settings,
  PlusCircle,
  Layers,
  Lightbulb,
} from 'lucide-react';
import {
  BUSINESS_CATEGORIES,
  getBusinessCategory,
  getCategoryDisplayName,
  type BusinessCategory,
} from '@/lib/business-categories';

export default function DashboardPage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch('/api/user/profile');
        if (res.ok) {
          const data = await res.json();
          setProfile(data.profile);
        }
      } catch (err) {
        console.warn('Could not load profile in dashboard:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  const activeCategory: BusinessCategory = getBusinessCategory(profile?.business_category_id);
  const categoryDisplayName = getCategoryDisplayName(
    profile?.business_category_id,
    profile?.custom_category_name,
    profile?.is_custom_category
  );

  // Category-specific production & pricing guidance
  const categoryTips: Record<string, string> = {
    'candles-fragrance':
      'Candle Maker Tip: Wax melting shrinkage and fragrance oil flash-point losses require factoring in at least 5-10% scrap allowance to protect your profit.',
    'handmade-crafts':
      'Artisan Tip: Never work for free. Direct craft labour is a real expense — price your hourly bench wage into every batch recipe.',
    'home-decor-lifestyle':
      'Home Decor Tip: Heavy Jesmonite, ceramics, and cement require corrugated packaging and bubble wrap that often cost more than raw mineral powder.',
    'food-bakery':
      'Bakery Tip: Remember that baking evaporation causes 10-15% moisture weight reduction. Cost your ingredients against baked saleable yield.',
    'beauty-personal-care':
      'Formulator Tip: High-grade active botanical extracts and amber dropper bottles make up 70% of BOM cost. Scale batch sizes carefully to preserve freshness.',
    'clothing-accessories':
      'Apparel Tip: Fabric pattern cutting waste and tailoring assembly minutes are the two biggest leaks in fashion margins.',
    'jewellery':
      'Jewellery Tip: Findings, hypoallergenic gold ear posts, and branded gift boxes frequently add up to more than raw polymer clay or wire.',
    'digital-products':
      'Digital Creator Tip: With zero freight and zero scrap, your margin depends on keeping platform transaction fees low and claiming 18% GST on creator tools.',
    custom:
      'Custom Business Tip: CheckMargin lets you cost any recipe — define custom units, labour hourly rates, packaging, and channel commissions freely.',
  };

  const activeTip = categoryTips[activeCategory.id] || categoryTips.custom;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-violet-700 rounded-3xl p-8 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-semibold mb-3">
            <span className="text-base">{activeCategory.icon}</span>
            <span>{categoryDisplayName} Studio</span>
            <Link
              href="/settings"
              className="ml-2 text-indigo-200 hover:text-white underline text-[11px] font-normal"
            >
              Change
            </Link>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight mb-2">
            {profile?.business_name ? `${profile.business_name} Workspace` : 'Welcome to CheckMargin Studio'}
          </h1>
          <p className="text-indigo-100 text-sm leading-relaxed mb-6">
            Calculate true cost per saleable unit for {categoryDisplayName.toLowerCase()}, eliminate pricing guesswork, and generate scaled shopping lists for upcoming production runs.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href={`/calculator?category=${activeCategory.id}`}
              className="inline-flex items-center gap-2 bg-white text-indigo-700 font-bold text-sm px-5 py-2.5 rounded-xl shadow-xs hover:bg-slate-50 transition-colors"
            >
              <Calculator className="w-4 h-4" />
              <span>Open {activeCategory.shortName} Calculator</span>
            </Link>
            <Link
              href="/calculator?category=blank"
              className="inline-flex items-center gap-2 bg-indigo-800/80 hover:bg-indigo-800 text-white font-semibold text-sm px-4 py-2.5 rounded-xl border border-indigo-400/40 transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Start Blank Product</span>
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-indigo-200 hover:text-white text-sm font-medium px-3 py-2.5 transition-colors"
            >
              <span>Saved Catalog →</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Category Guidance / Tip Callout */}
      <div className="p-4 bg-indigo-50/70 border border-indigo-200 rounded-2xl flex items-start gap-3 text-xs text-indigo-950">
        <Lightbulb className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
        <div className="flex-1">
          <span className="font-bold mr-1">Industry Guidance:</span>
          <span>{activeTip}</span>
        </div>
        <Link
          href="/settings"
          className="shrink-0 text-indigo-600 font-bold hover:underline flex items-center gap-1"
        >
          <span>Category Settings</span>
          <Settings className="w-3 h-3" />
        </Link>
      </div>

      {/* Quick Launch Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Link
          href={`/calculator?category=${activeCategory.id}`}
          className="bg-white border-2 border-slate-200 hover:border-indigo-500 rounded-2xl p-6 shadow-xs hover:shadow-md transition-all group"
        >
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform text-2xl">
            {activeCategory.icon}
          </div>
          <h3 className="font-bold text-slate-900 text-base mb-1">{activeCategory.name} Batch</h3>
          <p className="text-xs text-slate-500 mb-4 leading-relaxed">
            Pre-loaded with recipe structure calibrated for {activeCategory.name.toLowerCase()}.
          </p>
          <span className="text-xs font-bold text-indigo-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            <span>Launch Batch Studio</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </Link>

        <Link
          href="/calculator?category=blank"
          className="bg-white border-2 border-slate-200 hover:border-indigo-500 rounded-2xl p-6 shadow-xs hover:shadow-md transition-all group"
        >
          <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
            <PlusCircle className="w-6 h-6 text-slate-700" />
          </div>
          <h3 className="font-bold text-slate-900 text-base mb-1">Blank Product Calculator</h3>
          <p className="text-xs text-slate-500 mb-4 leading-relaxed">
            Start completely from scratch without pre-filled recipe ingredients or assumptions.
          </p>
          <span className="text-xs font-bold text-slate-700 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            <span>Start Fresh</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </Link>

        <Link
          href="/products"
          className="bg-white border-2 border-slate-200 hover:border-indigo-500 rounded-2xl p-6 shadow-xs hover:shadow-md transition-all group"
        >
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
            <Package className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900 text-base mb-1">Saved Recipes Library</h3>
          <p className="text-xs text-slate-500 mb-4 leading-relaxed">
            Review your saved products, update supplier pack costs, and maintain calculation histories.
          </p>
          <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            <span>View Library</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </Link>
      </div>

      {/* Category Specific Recommended Starters */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 mb-6 gap-2">
          <div>
            <h2 className="font-bold text-slate-900 text-lg">
              Starter Templates for {categoryDisplayName}
            </h2>
            <p className="text-xs text-slate-500">
              Popular product formats in your category ready to cost:
            </p>
          </div>
          <Link
            href="/settings"
            className="text-xs font-semibold text-indigo-600 hover:underline flex items-center gap-1"
          >
            <span>Switch Business Category</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {activeCategory.exampleProducts.map((prodName) => (
            <Link
              key={prodName}
              href={`/calculator?category=${activeCategory.id}&product=${encodeURIComponent(prodName)}`}
              className="flex flex-col justify-between p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-300 transition-all cursor-pointer group"
            >
              <div>
                <span className="text-2xl mb-2 block">{activeCategory.icon}</span>
                <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                  {prodName}
                </h4>
                <p className="text-[11px] text-slate-500 mt-1">
                  Calibrated for {activeCategory.name}
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] font-semibold text-indigo-600">
                <span>Load Recipe</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>

        {/* Universal Category Explorer */}
        <div className="pt-6 border-t border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Explore All 9 Business Categories (Universal Calculator Access)
            </span>
            <span className="text-[11px] text-slate-400">
              You are never restricted to one product type
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {BUSINESS_CATEGORIES.map((cat) => {
              const isCurrent = cat.id === activeCategory.id;
              return (
                <Link
                  key={cat.id}
                  href={`/calculator?category=${cat.id}`}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    isCurrent
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.shortName}</span>
                  {cat.badge && (
                    <span className={`text-[9px] px-1 py-0.2 rounded font-black ${isCurrent ? 'bg-indigo-500 text-white' : 'bg-indigo-100 text-indigo-700'}`}>
                      {cat.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
