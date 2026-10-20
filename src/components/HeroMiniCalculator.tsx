'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Calculator, ArrowRight, TrendingUp, Sparkles, AlertCircle, CheckCircle2, Sliders, Layers } from 'lucide-react';
import { calculateBatchCost, CHANNEL_PRESETS, type BatchInput } from '@/lib/calculator';
import { BUSINESS_CATEGORIES, BusinessCategory, SubCategory } from '@/lib/business-categories';

export default function HeroMiniCalculator() {
  const [activeCategory, setActiveCategory] = useState<BusinessCategory>(BUSINESS_CATEGORIES[0]);
  const [activeSubCategory, setActiveSubCategory] = useState<SubCategory | null>(
    BUSINESS_CATEGORIES[0].subCategories?.[0] || null
  );
  const [sellingPrice, setSellingPrice] = useState(BUSINESS_CATEGORIES[0].starterInput.sellingPrice);
  const [selectedChannel, setSelectedChannel] = useState(BUSINESS_CATEGORIES[0].starterInput.channelId || 'amazon');
  
  // Custom category product name for the simulator
  const [customProductName, setCustomProductName] = useState('Custom Studio Batch');

  const channelPreset = CHANNEL_PRESETS.find((c) => c.id === selectedChannel) || CHANNEL_PRESETS[0];

  const currentInput: BatchInput = {
    ...activeCategory.starterInput,
    productName:
      activeCategory.id === 'custom'
        ? customProductName
        : activeSubCategory?.starterProductName || activeCategory.starterInput.productName,
    hsnCode: activeSubCategory?.hsnCode || activeCategory.starterInput.hsnCode,
    outputGSTRatePercent: activeSubCategory?.defaultRate ?? activeCategory.starterInput.outputGSTRatePercent,
    sellingPrice: sellingPrice,
    channelId: channelPreset.id,
    platformFeePercent: channelPreset.feePercent,
    platformFeeFixed: channelPreset.fixedFee,
    gstOnPlatformFeePercent: channelPreset.gstOnFeesPercent,
    shippingPerOrder: channelPreset.shipping,
  };

  const result = calculateBatchCost(currentInput);

  function handleCategoryChange(cat: BusinessCategory) {
    setActiveCategory(cat);
    setActiveSubCategory(cat.subCategories?.[0] || null);
    setSellingPrice(cat.starterInput.sellingPrice);
    setSelectedChannel(cat.starterInput.channelId || 'amazon');
  }

  function handleSubCategoryChange(sub: SubCategory) {
    setActiveSubCategory(sub);
  }

  const isProfitable = result.grossProfitPerUnit > 0;

  return (
    <div className="bg-white border-2 border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/50 text-left max-w-4xl mx-auto">
      {/* Header bar */}
      <div className="flex flex-col pb-6 border-b border-slate-100 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md mb-2">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Interactive Business Costing Simulator</span>
          </div>
          <h3 className="text-xl font-black text-slate-900 tracking-tight">
            See Unit Economics by Business Category
          </h3>
          <p className="text-xs text-slate-500">
            Select a broad category and sub-category to test how batch yield, labour, and marketplace fees shape true profit.
          </p>
        </div>

        {/* Category Pills (9 Main Categories) */}
        <div className="flex flex-wrap gap-1.5">
          {BUSINESS_CATEGORIES.map((cat) => {
            const isActive = activeCategory.id === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-xs ring-2 ring-indigo-600/20'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.shortName}</span>
                {cat.badge && (
                  <span className={`text-[9px] px-1 py-0.2 rounded font-black ${isActive ? 'bg-indigo-500 text-white' : 'bg-indigo-100 text-indigo-700'}`}>
                    {cat.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Sub-Category Pills for Active Category */}
        {activeCategory.subCategories && activeCategory.subCategories.length > 0 && (
          <div className="pt-2 flex flex-wrap items-center gap-1.5 border-t border-slate-100">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1 flex items-center gap-1">
              <Layers className="w-3 h-3 text-indigo-600" />
              Sub-Category:
            </span>
            {activeCategory.subCategories.map((sub) => {
              const isSubActive = activeSubCategory?.id === sub.id;
              return (
                <button
                  key={sub.id}
                  onClick={() => handleSubCategoryChange(sub)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer ${
                    isSubActive
                      ? 'bg-indigo-100 text-indigo-800 border border-indigo-300 font-bold'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200'
                  }`}
                >
                  <span>{sub.icon}</span>
                  <span>{sub.name}</span>
                  <span className="text-[9px] text-slate-400 font-bold">HSN {sub.hsnCode}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Simulator Controls & Output Grid */}
      <div className="grid md:grid-cols-12 gap-6 pt-6">
        {/* Left Controls (5 cols) */}
        <div className="md:col-span-5 space-y-5">
          {/* Active Product Name display or custom input */}
          {activeCategory.id === 'custom' ? (
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Your Custom Product Name
              </label>
              <input
                type="text"
                value={customProductName}
                onChange={(e) => setCustomProductName(e.target.value)}
                placeholder="e.g. 3D-Printed Dice Towers or Leather Wallets"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          ) : (
            <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider block">
                  {activeCategory.name} • HSN {activeSubCategory?.hsnCode || activeCategory.starterInput.hsnCode} ({activeSubCategory?.defaultRate ?? activeCategory.starterInput.outputGSTRatePercent}% GST)
                </span>
                <span className="text-sm font-black text-slate-900">
                  {activeSubCategory?.starterProductName || activeCategory.starterInput.productName}
                </span>
              </div>
              <span className="text-xl">{activeSubCategory?.icon || activeCategory.icon}</span>
            </div>
          )}

          <div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-2">
              <span>Customer Selling Price</span>
              <span className="text-indigo-600 text-sm font-black">₹{sellingPrice}</span>
            </div>
            <input
              type="range"
              min="100"
              max="2500"
              step="25"
              value={sellingPrice}
              onChange={(e) => setSellingPrice(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-semibold">
              <span>₹100 (Affordable)</span>
              <span>₹1,200 (Mid-tier)</span>
              <span>₹2,500 (Premium)</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Selling Channel / Logistics
            </label>
            <div className="grid grid-cols-2 gap-2">
              {CHANNEL_PRESETS.map((ch) => {
                const isChActive = selectedChannel === ch.id;
                return (
                  <button
                    key={ch.id}
                    onClick={() => setSelectedChannel(ch.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      isChActive
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-950 font-bold ring-1 ring-indigo-500'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <div className="text-xs font-bold">{ch.name}</div>
                    <div className="text-[10px] text-slate-500">
                      {ch.feePercent}% + ₹{ch.shipping} ship
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Cost & Profit Breakdown (7 cols) */}
        <div className="md:col-span-7 flex flex-col justify-between space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-[11px] font-semibold text-slate-500 block mb-0.5">Raw Material / Unit</span>
              <span className="text-lg font-black text-slate-900">₹{result.materialCostPerUnit.toFixed(1)}</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Scrap absorbed</span>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-[11px] font-semibold text-slate-500 block mb-0.5">Craft Labour / Unit</span>
              <span className="text-lg font-black text-slate-900">₹{result.labourCostPerUnit.toFixed(1)}</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Founder paid fairly</span>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-[11px] font-semibold text-slate-500 block mb-0.5">Channel Fees & Tax</span>
              <span className="text-lg font-black text-slate-900">₹{result.totalPlatformFeePerUnit.toFixed(1)}</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Includes 18% GST</span>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-[11px] font-semibold text-slate-500 block mb-0.5">True All-in Cost</span>
              <span className="text-lg font-black text-indigo-700">₹{result.totalCostPerUnit.toFixed(1)}</span>
              <span className="text-[10px] text-indigo-500 block mt-0.5">Nothing hidden</span>
            </div>
          </div>

          {/* Bottom Profit Card */}
          <div
            className={`p-4 rounded-2xl border-2 flex items-center justify-between ${
              isProfitable
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                : 'bg-rose-50 border-rose-300 text-rose-900'
            }`}
          >
            <div>
              <span className="text-xs font-bold uppercase tracking-wider block">
                {isProfitable ? 'Net Profit Per Unit' : 'Net Loss Per Unit'}
              </span>
              <span className="text-2xl font-black">
                {isProfitable ? `+₹${result.grossProfitPerUnit.toFixed(1)}` : `-₹${Math.abs(result.grossProfitPerUnit).toFixed(1)}`}
              </span>
              <span className="text-xs font-semibold ml-2">
                ({result.grossMarginPercent.toFixed(1)}% Net Margin)
              </span>
            </div>

            <div className="text-right">
              <span className="text-[11px] font-semibold block text-slate-500">Monthly Break-Even</span>
              <span className="text-base font-bold">
                {result.breakEvenUnitsPerMonth > 0 ? `${result.breakEvenUnitsPerMonth} units` : 'Unreachable'}
              </span>
            </div>
          </div>

          {/* Launch Link */}
          <Link
            href={`/calculator?category=${activeCategory.id}${activeSubCategory?.presetId ? `&preset=${activeSubCategory.presetId}` : activeSubCategory ? `&subCategory=${activeSubCategory.id}` : ''}`}
            className="w-full inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm py-3 px-4 rounded-xl shadow-md shadow-indigo-500/20 transition-all hover:gap-3 cursor-pointer"
          >
            <span>Open {activeSubCategory?.name || activeCategory.name} in Full Batch Studio</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
