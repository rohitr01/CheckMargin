'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Calculator, ArrowRight, TrendingUp, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';
import { calculateBatchCost, CHANNEL_PRESETS, type BatchInput } from '@/lib/calculator';

const PRESETS = [
  {
    id: 'candle',
    name: 'Soy Jar Candle',
    icon: '🕯️',
    price: 599,
    channel: 'amazon',
    input: {
      productName: 'Soy Fragrance Candle 200g',
      hsnCode: '3406',
      materials: [
        { name: 'Soy Wax', packPrice: 850, packSize: 1000, packUnit: 'g', qtyUsed: 1800, gstRatePercent: 18, isPackPriceGSTInclusive: true },
        { name: 'Fragrance Oil', packPrice: 1400, packSize: 100, packUnit: 'ml', qtyUsed: 120, gstRatePercent: 18, isPackPriceGSTInclusive: true },
        { name: 'Glass Jar', packPrice: 700, packSize: 20, packUnit: 'piece', qtyUsed: 10, gstRatePercent: 18, isPackPriceGSTInclusive: true },
        { name: 'Wick & Label', packPrice: 350, packSize: 50, packUnit: 'piece', qtyUsed: 10, gstRatePercent: 18, isPackPriceGSTInclusive: true },
      ],
      batchSize: 10,
      failedUnits: 1,
      labourMinutes: 90,
      labourHourlyRate: 150,
      packagingPerUnit: 25,
      overheadPerBatch: 50,
      sellingPrice: 599,
      platformFeePercent: 12,
      platformFeeFixed: 15,
      gstOnPlatformFeePercent: 18,
      shippingPerOrder: 65,
      adSpendPerUnit: 40,
      rtoRatePercent: 8,
      rtoLossPerReturn: 90,
      isGSTRegistered: true,
      claimITC: true,
      supplyType: 'intra-state' as const,
      outputGSTRatePercent: 5,
      isPriceGSTInclusive: true,
      monthlyFixedCost: 15000,
    },
  },
  {
    id: 'soap',
    name: 'Cold Process Soap',
    icon: '🧼',
    price: 299,
    channel: 'shopify',
    input: {
      productName: 'Honey & Oat Cold Process Soap',
      hsnCode: '3401',
      materials: [
        { name: 'Olive & Coconut Oil', packPrice: 650, packSize: 1000, packUnit: 'ml', qtyUsed: 800, gstRatePercent: 5, isPackPriceGSTInclusive: true },
        { name: 'Lye (NaOH)', packPrice: 180, packSize: 500, packUnit: 'g', qtyUsed: 120, gstRatePercent: 18, isPackPriceGSTInclusive: true },
        { name: 'Raw Honey & Oats', packPrice: 250, packSize: 250, packUnit: 'g', qtyUsed: 60, gstRatePercent: 5, isPackPriceGSTInclusive: true },
        { name: 'Essential Oil', packPrice: 900, packSize: 100, packUnit: 'ml', qtyUsed: 30, gstRatePercent: 18, isPackPriceGSTInclusive: true },
      ],
      batchSize: 12,
      failedUnits: 1,
      labourMinutes: 120,
      labourHourlyRate: 150,
      packagingPerUnit: 18,
      overheadPerBatch: 40,
      sellingPrice: 299,
      platformFeePercent: 2,
      platformFeeFixed: 3,
      gstOnPlatformFeePercent: 18,
      shippingPerOrder: 55,
      adSpendPerUnit: 25,
      rtoRatePercent: 4,
      rtoLossPerReturn: 70,
      isGSTRegistered: true,
      claimITC: true,
      supplyType: 'intra-state' as const,
      outputGSTRatePercent: 5,
      isPriceGSTInclusive: true,
      monthlyFixedCost: 15000,
    },
  },
  {
    id: 'jesmonite',
    name: 'Jesmonite Oval Tray',
    icon: '🎨',
    price: 649,
    channel: 'amazon',
    input: {
      productName: 'Jesmonite AC100 Terrazzo Tray',
      hsnCode: '6815',
      materials: [
        { name: 'Jesmonite AC100 Base & Liquid', packPrice: 2200, packSize: 3500, packUnit: 'g', qtyUsed: 1800, gstRatePercent: 18, isPackPriceGSTInclusive: true },
        { name: 'Pigment Paste & Chips', packPrice: 450, packSize: 100, packUnit: 'g', qtyUsed: 40, gstRatePercent: 18, isPackPriceGSTInclusive: true },
        { name: 'Acrylic Food-Safe Sealer', packPrice: 600, packSize: 500, packUnit: 'ml', qtyUsed: 100, gstRatePercent: 18, isPackPriceGSTInclusive: true },
        { name: 'Cork Backing Footers', packPrice: 120, packSize: 20, packUnit: 'piece', qtyUsed: 6, gstRatePercent: 18, isPackPriceGSTInclusive: true },
      ],
      batchSize: 6,
      failedUnits: 1,
      labourMinutes: 100,
      labourHourlyRate: 150,
      packagingPerUnit: 35,
      overheadPerBatch: 60,
      sellingPrice: 649,
      platformFeePercent: 12,
      platformFeeFixed: 15,
      gstOnPlatformFeePercent: 18,
      shippingPerOrder: 70,
      adSpendPerUnit: 50,
      rtoRatePercent: 6,
      rtoLossPerReturn: 95,
      isGSTRegistered: true,
      claimITC: true,
      supplyType: 'intra-state' as const,
      outputGSTRatePercent: 18,
      isPriceGSTInclusive: true,
      monthlyFixedCost: 15000,
    },
  },
  {
    id: 'bakery',
    name: 'Artisan Babka Loaf',
    icon: '🧁',
    price: 499,
    channel: 'shopify',
    input: {
      productName: 'Valrhona Chocolate Babka',
      hsnCode: '1905',
      materials: [
        { name: 'Organic Flour & Yeast', packPrice: 320, packSize: 2000, packUnit: 'g', qtyUsed: 1200, gstRatePercent: 5, isPackPriceGSTInclusive: true },
        { name: 'French Butter 82%', packPrice: 650, packSize: 500, packUnit: 'g', qtyUsed: 350, gstRatePercent: 12, isPackPriceGSTInclusive: true },
        { name: 'Dark Chocolate Callets', packPrice: 950, packSize: 1000, packUnit: 'g', qtyUsed: 400, gstRatePercent: 18, isPackPriceGSTInclusive: true },
        { name: 'Farm Eggs & Sugar', packPrice: 200, packSize: 10, packUnit: 'piece', qtyUsed: 6, gstRatePercent: 0, isPackPriceGSTInclusive: true },
      ],
      batchSize: 6,
      failedUnits: 0,
      labourMinutes: 90,
      labourHourlyRate: 150,
      packagingPerUnit: 25,
      overheadPerBatch: 50,
      sellingPrice: 499,
      platformFeePercent: 2,
      platformFeeFixed: 3,
      gstOnPlatformFeePercent: 18,
      shippingPerOrder: 50,
      adSpendPerUnit: 30,
      rtoRatePercent: 2,
      rtoLossPerReturn: 60,
      isGSTRegistered: false,
      claimITC: false,
      supplyType: 'intra-state' as const,
      outputGSTRatePercent: 5,
      isPriceGSTInclusive: true,
      monthlyFixedCost: 15000,
    },
  },
];

export default function HeroMiniCalculator() {
  const [activePreset, setActivePreset] = useState(PRESETS[0]);
  const [sellingPrice, setSellingPrice] = useState(PRESETS[0].price);
  const [selectedChannel, setSelectedChannel] = useState(PRESETS[0].channel);

  const channelPreset = CHANNEL_PRESETS.find((c) => c.id === selectedChannel) || CHANNEL_PRESETS[0];

  const currentInput: BatchInput = {
    ...activePreset.input,
    sellingPrice: sellingPrice,
    channelId: channelPreset.id,
    platformFeePercent: channelPreset.feePercent,
    platformFeeFixed: channelPreset.fixedFee,
    gstOnPlatformFeePercent: channelPreset.gstOnFeesPercent,
    shippingPerOrder: channelPreset.shipping,
  };

  const result = calculateBatchCost(currentInput);

  function handlePresetChange(p: typeof PRESETS[0]) {
    setActivePreset(p);
    setSellingPrice(p.price);
    setSelectedChannel(p.channel);
  }

  const isProfitable = result.grossProfitPerUnit > 0;

  return (
    <div className="bg-white border-2 border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/50 text-left max-w-4xl mx-auto">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md mb-2">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Interactive Live Simulator</span>
          </div>
          <h3 className="text-xl font-black text-slate-900 tracking-tight">
            See CheckMargin in Action
          </h3>
          <p className="text-xs text-slate-500">
            Pick a craft product and test how scrap yield, labour, and marketplace fees shape true unit profit.
          </p>
        </div>

        {/* Preset Pills */}
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.id}
              onClick={() => handlePresetChange(p)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activePreset.id === p.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <span>{p.icon}</span>
              <span>{p.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Simulator Controls & Output Grid */}
      <div className="grid md:grid-cols-12 gap-6 pt-6">
        {/* Left Controls (5 cols) */}
        <div className="md:col-span-5 space-y-5">
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-2">
              <label>Customer Selling Price</label>
              <span className="text-base font-black text-indigo-600">₹{sellingPrice}</span>
            </div>
            <input
              type="range"
              min={Math.round(result.totalDirectCostPerUnit * 0.8)}
              max={Math.round(result.totalDirectCostPerUnit * 3.5)}
              step={10}
              value={sellingPrice}
              onChange={(e) => setSellingPrice(Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400 mt-1">
              <span>Low (₹{Math.round(result.totalDirectCostPerUnit * 0.8)})</span>
              <span>Target (₹{sellingPrice})</span>
              <span>High (₹{Math.round(result.totalDirectCostPerUnit * 3.5)})</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Sales Channel Preset
            </label>
            <select
              value={selectedChannel}
              onChange={(e) => setSelectedChannel(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {CHANNEL_PRESETS.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">
              {channelPreset.notes}
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1.5 text-slate-600">
            <div className="flex justify-between">
              <span>Batch Run Size:</span>
              <strong className="text-slate-900">{activePreset.input.batchSize} units</strong>
            </div>
            <div className="flex justify-between">
              <span>Quality Rejections (Defects):</span>
              <span className="text-rose-600 font-semibold">{activePreset.input.failedUnits} unit ({result.yieldEfficiencyPercent.toFixed(0)}% yield)</span>
            </div>
            <div className="flex justify-between">
              <span>Direct Craft Labour:</span>
              <strong className="text-slate-900">{activePreset.input.labourMinutes} mins (@ ₹{activePreset.input.labourHourlyRate}/hr)</strong>
            </div>
            <div className="flex justify-between">
              <span>GST Status:</span>
              <strong className="text-slate-900">{activePreset.input.isGSTRegistered ? `HSN ${activePreset.input.hsnCode} (${activePreset.input.outputGSTRatePercent}%)` : 'Unregistered'}</strong>
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
            href="/calculator"
            className="w-full inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm py-3 px-4 rounded-xl shadow-md shadow-indigo-500/20 transition-all hover:gap-3"
          >
            <span>Open This Recipe in Full Batch Studio</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
