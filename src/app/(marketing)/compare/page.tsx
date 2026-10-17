'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Truck,
  Store,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Calculator,
  ShieldCheck,
  Package,
  Layers,
  TrendingUp,
  Percent,
  Scale,
} from 'lucide-react';
import {
  COURIER_SERVICES,
  MARKETPLACE_PLATFORMS,
  type CourierService,
  type MarketplacePlatform,
} from '@/lib/logistics-platforms';

export default function ComparePlatformsAndCouriersPage() {
  const [activeTab, setActiveTab] = useState<'couriers' | 'estimator' | 'platforms'>('couriers');

  // Live Shipping Estimator State
  const [parcelWeightKg, setParcelWeightKg] = useState<number>(0.5);
  const [selectedZone, setSelectedZone] = useState<'city' | 'regional' | 'national' | 'air'>('national');
  const [isCODOrder, setIsCODOrder] = useState<boolean>(false);
  const [orderValueForCOD, setOrderValueForCOD] = useState<number>(800);

  // Calculate estimated shipping for a courier
  function calculateCourierEstimate(c: CourierService) {
    if (c.type === 'hyperlocal' && selectedZone !== 'city') {
      return null; // Porter only intra-city
    }

    // Number of 500g slabs
    const slabs = Math.max(1, Math.ceil(parcelWeightKg / 0.5));

    let baseRate = c.baseRateNational500g;
    if (selectedZone === 'city') baseRate = c.baseRateCity500g;
    if (selectedZone === 'regional') baseRate = c.baseRateRegional500g;
    if (selectedZone === 'air') baseRate = c.airExpressRate500g;

    // Additional slabs usually cost 80% of base rate
    const totalFreight = baseRate + (slabs - 1) * (baseRate * 0.85);

    // COD calculation
    let codFee = 0;
    if (isCODOrder) {
      codFee = Math.max(c.codFeeFlat, (orderValueForCOD * c.codFeePercent) / 100);
    }

    // 18% GST on courier services
    const gstOnLogistics = (totalFreight + codFee) * 0.18;
    const totalCost = totalFreight + codFee + gstOnLogistics;

    return {
      freight: Math.round(totalFreight),
      codFee: Math.round(codFee),
      gst: Math.round(gstOnLogistics),
      total: Math.round(totalCost),
    };
  }

  return (
    <div className="bg-slate-50 min-h-screen text-slate-900 pb-24">
      {/* Hero Header */}
      <section className="bg-white border-b border-slate-200 pt-12 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-200/80 rounded-full px-4 py-1.5 text-xs font-bold text-indigo-700 mb-6">
            <Truck className="w-4 h-4 text-indigo-600" />
            <span>Independent Indian Logistics & E-Commerce Platform Benchmarks</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight max-w-4xl mx-auto">
            Compare Every{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
              Delivery Courier & Selling Platform
            </span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Unbiased rates, COD remittance payout cycles, RTO return penalties, marketplace commissions, and GST rules for Indian founders.
          </p>

          {/* Tab Navigation */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
            {[
              { id: 'couriers', label: 'Delivery Couriers Breakdown', icon: Truck },
              { id: 'estimator', label: 'Live Shipping Rate Estimator', icon: Calculator },
              { id: 'platforms', label: 'Marketplaces vs D2C vs Offline', icon: Store },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        {/* ==================== TAB 1: COURIER SERVICES BREAKDOWN ==================== */}
        {activeTab === 'couriers' && (
          <div className="space-y-8">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-2">
                Top Shipping Couriers for Craft & Small-Batch Brands
              </h2>
              <p className="text-xs text-slate-500 mb-8">
                Benchmarked by transit damage protection, COD settlement speed, remote area reach, and base rates.
              </p>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {COURIER_SERVICES.map((courier) => (
                  <div
                    key={courier.id}
                    className="border-2 border-slate-200/90 rounded-2xl p-6 hover:border-indigo-400 transition-all bg-white flex flex-col justify-between shadow-xs"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold bg-indigo-50 text-indigo-700 px-3 py-1 rounded-md border border-indigo-200">
                          {courier.type.replace('_', ' ').toUpperCase()}
                        </span>
                        <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                          <span>Fragile Care:</span>
                          <span>{'★'.repeat(Math.round(courier.fragileHandlingRating))}</span>
                        </div>
                      </div>

                      <h3 className="text-xl font-black text-slate-900">{courier.name}</h3>
                      <p className="text-xs text-slate-500 mb-4 mt-0.5">{courier.tagline}</p>

                      {/* Rate Grid */}
                      <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200 mb-4 text-center">
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase font-semibold block">Within City</span>
                          <span className="text-sm font-black text-slate-900">₹{courier.baseRateCity500g}</span>
                          <span className="text-[9px] text-slate-400 block">per 500g</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase font-semibold block">Regional</span>
                          <span className="text-sm font-black text-slate-900">₹{courier.baseRateRegional500g}</span>
                          <span className="text-[9px] text-slate-400 block">same state</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase font-semibold block">National</span>
                          <span className="text-sm font-black text-indigo-700">₹{courier.baseRateNational500g || 'N/A'}</span>
                          <span className="text-[9px] text-slate-400 block">across India</span>
                        </div>
                      </div>

                      {/* COD & RTO Terms */}
                      <div className="space-y-2 text-xs text-slate-600 mb-4 border-t border-slate-100 pt-3">
                        <div className="flex justify-between">
                          <span>COD Fee:</span>
                          <strong className="text-slate-900">
                            ₹{courier.codFeeFlat} or {courier.codFeePercent}%
                          </strong>
                        </div>
                        <div className="flex justify-between">
                          <span>COD Payout Cycle:</span>
                          <span className="font-semibold text-emerald-700">{courier.codRemittanceDays}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>RTO Reverse Charge:</span>
                          <span className="font-semibold text-rose-600">
                            {courier.rtoChargeMultiplier}× forward freight
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Tracking Quality:</span>
                          <span className="font-semibold text-slate-800">{courier.trackingQuality}</span>
                        </div>
                      </div>

                      {/* Ideal Products */}
                      <div className="mb-4">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                          Recommended For:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {courier.idealForProducts.map((p, i) => (
                            <span key={i} className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium">
                              {p}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Pros and Cons */}
                    <div className="pt-3 border-t border-slate-100 text-xs space-y-1.5">
                      <div className="text-emerald-700">
                        <strong>✓ Pro: </strong>{courier.pros[0]}
                      </div>
                      <div className="text-slate-500">
                        <strong>⚠️ Note: </strong>{courier.cons[0]}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Volumetric Weight Rules Callout */}
            <div className="bg-indigo-50 border-2 border-indigo-200 rounded-3xl p-6 sm:p-8">
              <div className="flex items-center gap-2 mb-2">
                <Scale className="w-5 h-5 text-indigo-700" />
                <h3 className="text-lg font-black text-indigo-950">
                  The Volumetric Weight Trap (Why Founders Get Hit by Shipping Bill Discrepancies)
                </h3>
              </div>
              <p className="text-xs text-indigo-900 leading-relaxed max-w-3xl">
                Couriers bill you on whichever is higher: <strong>Actual Dead Weight</strong> or <strong>Volumetric Weight</strong>.
                Formula: <code className="bg-white px-2 py-0.5 rounded font-bold text-indigo-700">Volumetric Weight (kg) = (Length × Width × Height in cm) / 5000</code>.
                If you pack a 200g lightweight macrame hanger in an oversized 30×20×15 cm box, couriers bill you for <strong>1.8 kg</strong> (₹150+) instead of 500g! Always trim box dimensions to fit snug with protective bubble wrap.
              </p>
            </div>
          </div>
        )}

        {/* ==================== TAB 2: LIVE SHIPPING ESTIMATOR ==================== */}
        {activeTab === 'estimator' && (
          <div className="space-y-8">
            <div className="bg-white border-2 border-indigo-100 rounded-3xl p-6 sm:p-10 shadow-sm">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-2">
                Live Courier Cost Estimator & Side-by-Side Comparison
              </h2>
              <p className="text-xs text-slate-500 mb-8">
                Enter your parcel details to calculate exact logistics freight, COD collection fee, and 18% GST across all courier partners.
              </p>

              {/* Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-8 border-b border-slate-100">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Parcel Weight
                    </label>
                    <span className="text-xs font-black text-indigo-600">{parcelWeightKg} kg</span>
                  </div>
                  <input
                    type="range"
                    min={0.25}
                    max={10}
                    step={0.25}
                    value={parcelWeightKg}
                    onChange={(e) => setParcelWeightKg(parseFloat(e.target.value) || 0.5)}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                    <span>0.25kg</span>
                    <span>1kg</span>
                    <span>5kg</span>
                    <span>10kg</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Destination Zone
                  </label>
                  <select
                    value={selectedZone}
                    onChange={(e) => setSelectedZone(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="city">Intra-City (Within Same City)</option>
                    <option value="regional">Regional (Within Same State)</option>
                    <option value="national">National Surface (Across India)</option>
                    <option value="air">National Air Express (Priority 24-48 hr)</option>
                  </select>
                </div>

                <div>
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-xs text-slate-800 p-3 bg-slate-50 rounded-xl border border-slate-200 mt-4">
                    <input
                      type="checkbox"
                      checked={isCODOrder}
                      onChange={(e) => setIsCODOrder(e.target.checked)}
                      className="w-4 h-4 text-indigo-600 rounded"
                    />
                    <span>Cash on Delivery (COD)</span>
                  </label>
                </div>

                {isCODOrder && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Order Value for COD (₹)
                    </label>
                    <input
                      type="number"
                      value={orderValueForCOD}
                      onChange={(e) => setOrderValueForCOD(parseFloat(e.target.value) || 0)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900"
                    />
                  </div>
                )}
              </div>

              {/* Side-by-Side Estimates Table */}
              <div className="mt-8 overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead>
                    <tr className="border-b border-slate-200 text-xs font-bold text-slate-400 uppercase tracking-wider">
                      <th className="pb-3">Courier Provider</th>
                      <th className="pb-3">Base Freight</th>
                      <th className="pb-3">COD Charge</th>
                      <th className="pb-3">18% GST</th>
                      <th className="pb-3">Total Cost / Parcel</th>
                      <th className="pb-3">COD Settlement</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {COURIER_SERVICES.map((courier) => {
                      const est = calculateCourierEstimate(courier);
                      if (!est) return null;
                      return (
                        <tr key={courier.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-4">
                            <div className="font-bold text-slate-900">{courier.name}</div>
                            <div className="text-[11px] text-slate-400">{courier.tagline}</div>
                          </td>
                          <td className="py-4 text-slate-700 font-semibold">₹{est.freight}</td>
                          <td className="py-4 text-slate-700 font-semibold">
                            {isCODOrder ? `₹${est.codFee}` : '₹0 (Prepaid)'}
                          </td>
                          <td className="py-4 text-slate-500 text-xs">₹{est.gst}</td>
                          <td className="py-4">
                            <span className="text-base font-black text-indigo-700">₹{est.total}</span>
                          </td>
                          <td className="py-4 text-xs font-semibold text-emerald-700">
                            {courier.codRemittanceDays}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB 3: MARKETPLACES VS D2C VS OFFLINE ==================== */}
        {activeTab === 'platforms' && (
          <div className="space-y-8">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-2">
                Where Should You Sell? Marketplace & Platform Matrix
              </h2>
              <p className="text-xs text-slate-500 mb-8">
                Compare fees, mandatory GST requirements, customer discovery dynamics, and return risks across all major channels.
              </p>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {MARKETPLACE_PLATFORMS.map((platform) => (
                  <div
                    key={platform.id}
                    className="border-2 border-slate-200/90 rounded-2xl p-6 hover:border-indigo-400 transition-all bg-white flex flex-col justify-between shadow-xs"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold bg-indigo-50 text-indigo-700 px-3 py-1 rounded-md border border-indigo-200">
                          {platform.category.replace('_', ' ').toUpperCase()}
                        </span>
                        <span
                          className={`text-xs font-bold px-2.5 py-1 rounded-md ${
                            platform.isGSTMandatoryToSell
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {platform.isGSTMandatoryToSell ? 'GST Mandatory' : 'GST Exempt Eligible'}
                        </span>
                      </div>

                      <h3 className="text-xl font-black text-slate-900">{platform.name}</h3>
                      <p className="text-xs text-slate-500 mb-4 mt-0.5">{platform.tagline}</p>

                      {/* Economics Snapshot */}
                      <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2 text-slate-600 mb-4">
                        <div className="flex justify-between">
                          <span>Platform Commission:</span>
                          <strong className="text-slate-900">{platform.commissionPercent}</strong>
                        </div>
                        <div className="flex justify-between">
                          <span>Fixed Order Fee:</span>
                          <strong className="text-slate-900">{platform.fixedFeePerOrder}</strong>
                        </div>
                        <div className="flex justify-between">
                          <span>Payment Gateway:</span>
                          <strong className="text-slate-900">{platform.paymentGatewayFee}</strong>
                        </div>
                        <div className="flex justify-between">
                          <span>Typical Order Value (AOV):</span>
                          <span className="font-semibold text-indigo-700">{platform.typicalAOV}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Return / RTO Risk:</span>
                          <span className="font-semibold text-rose-600">{platform.rtoCancellationRisk}</span>
                        </div>
                      </div>

                      <div className="text-xs text-slate-600 mb-4 space-y-1">
                        <p><strong>GST Condition:</strong> {platform.gstExemptionDetails}</p>
                        <p><strong>Digital Goods Supported:</strong> {platform.digitalGoodsSupported ? '✅ Yes' : '❌ No'}</p>
                      </div>
                    </div>

                    {/* Pros and Cons */}
                    <div className="pt-3 border-t border-slate-100 text-xs space-y-1.5">
                      <div className="text-emerald-700">
                        <strong>✓ Strength: </strong>{platform.pros[0]}
                      </div>
                      <div className="text-slate-500">
                        <strong>⚠️ Trade-off: </strong>{platform.cons[0]}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
