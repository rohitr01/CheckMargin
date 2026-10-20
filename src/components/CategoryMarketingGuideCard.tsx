'use client';

import { useState } from 'react';
import {
  Sparkles,
  TrendingUp,
  Target,
  Megaphone,
  ShoppingBag,
  Truck,
  Calendar,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  CheckCircle2,
  AlertTriangle,
  Zap,
  ArrowRight,
} from 'lucide-react';
import {
  getCategoryMarketingPlaybook,
  type CategoryMarketingPlaybook,
} from '@/lib/category-marketing-guides';

interface CategoryMarketingGuideCardProps {
  categoryId: string;
  sellingPrice: number;
  netProfit?: number;
  onApplySuggestedCAC?: (cac: number) => void;
}

export default function CategoryMarketingGuideCard({
  categoryId,
  sellingPrice,
  netProfit = 0,
  onApplySuggestedCAC,
}: CategoryMarketingGuideCardProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'ads' | 'channels' | 'rto' | 'seasonality'>('ads');

  const playbook: CategoryMarketingPlaybook = getCategoryMarketingPlaybook(categoryId);

  // Live calculated marketing economics
  const effectivePrice = Math.max(sellingPrice, 100);
  const suggestedCac = Math.round(effectivePrice * (playbook.adStrategy.recommendedAdSpendPercent / 100));
  const maxCac = Math.round(effectivePrice * (playbook.adStrategy.maxHealthyCacPercent / 100));
  const remainingProfit = netProfit > 0 ? netProfit - suggestedCac : 0;

  return (
    <div className="bg-gradient-to-br from-indigo-50/70 via-white to-violet-50/40 border-2 border-indigo-200/80 rounded-3xl p-5 md:p-7 shadow-sm transition-all">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-indigo-100">
        <div className="flex items-start sm:items-center gap-3">
          <span className="text-3xl p-2.5 bg-white rounded-2xl border border-indigo-100 shadow-xs">
            {playbook.icon}
          </span>
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-wider text-indigo-700 bg-indigo-100/70 px-2 py-0.5 rounded-md">
                <Megaphone className="w-3 h-3 text-indigo-600" />
                Category Growth & Marketing Guide
              </span>
              {playbook.badge && (
                <span className="text-[10px] font-bold text-violet-700 bg-violet-100/70 px-2 py-0.5 rounded-full">
                  {playbook.badge}
                </span>
              )}
            </div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 mt-1">
              Marketing Playbook: {playbook.categoryName}
            </h3>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="self-end sm:self-center inline-flex items-center gap-1 text-xs font-bold text-indigo-700 hover:text-indigo-900 bg-white hover:bg-indigo-50 px-3 py-1.5 rounded-xl border border-indigo-200 transition-colors cursor-pointer"
        >
          <span>{isOpen ? 'Collapse Guide' : 'Expand Strategy Guide'}</span>
          {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {isOpen && (
        <div className="mt-5 space-y-6">
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            {playbook.summary}
          </p>

          {/* Live Dynamic CAC & Unit Economics Banner */}
          <div className="bg-white border-2 border-indigo-100 rounded-2xl p-4 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-indigo-600" />
                <span className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  Live Unit Ad Spend & CAC Guardrails (for ₹{sellingPrice} Selling Price)
                </span>
              </div>
              {onApplySuggestedCAC && (
                <button
                  type="button"
                  onClick={() => onApplySuggestedCAC(suggestedCac)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-1.5 rounded-xl shadow-xs transition-all cursor-pointer"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Set CAC to ₹{suggestedCac} in Calculator</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-0.5">
                  Suggested Ad Spend / Unit
                </span>
                <span className="text-base sm:text-lg font-black text-indigo-700">₹{suggestedCac}</span>
                <span className="text-[10px] text-slate-500 block mt-0.5">
                  ({playbook.adStrategy.recommendedAdSpendPercent}% of Selling Price)
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-0.5">
                  Target Blended ROAS
                </span>
                <span className="text-base sm:text-lg font-black text-slate-900">{playbook.adStrategy.targetRoas}</span>
                <span className="text-[10px] text-slate-500 block mt-0.5">Meta & Google Ads Target</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-0.5">
                  Hard CAC Ceiling
                </span>
                <span className="text-base sm:text-lg font-black text-rose-700">₹{maxCac} max</span>
                <span className="text-[10px] text-rose-500 block mt-0.5">Turn off ads above this limit</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-0.5">
                  Profit Post-Ad Spend
                </span>
                <span className={`text-base sm:text-lg font-black ${remainingProfit >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                  ₹{remainingProfit.toFixed(0)}
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5">Net profit after ad cost</span>
              </div>
            </div>
          </div>

          {/* Interactive Strategy Tabs */}
          <div>
            <div className="flex flex-wrap gap-1.5 mb-4 border-b border-indigo-100 pb-2">
              {[
                { id: 'ads', label: '🎯 Ad Strategy & Hooks', icon: Target },
                { id: 'channels', label: '🛍️ Best Channels & Bundling', icon: ShoppingBag },
                { id: 'rto', label: '📦 RTO & Shipping Rules', icon: Truck },
                { id: 'seasonality', label: '📅 Seasonality & Wholesale', icon: Calendar },
              ].map((tab) => {
                const isActive = activeTab === tab.id;
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-white hover:bg-indigo-50 text-slate-700 border border-slate-200'
                    }`}
                  >
                    <IconComponent className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab 1: Ad Strategy & Tested Hooks */}
            {activeTab === 'ads' && (
              <div className="space-y-4">
                <div className="bg-white rounded-2xl p-4 border border-slate-200 text-xs text-slate-700 space-y-2">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Lightbulb className="w-4 h-4 text-amber-500" />
                    <span>Recommended Budget Allocation:</span>
                  </div>
                  <p className="leading-relaxed text-slate-600">{playbook.adStrategy.budgetAllocationAdvice}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white rounded-2xl p-4 border border-slate-200">
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block mb-2">
                      🎬 Best-Performing Video Formats:
                    </span>
                    <ul className="space-y-1.5 text-xs text-slate-600">
                      {playbook.adStrategy.bestAdFormats.map((format, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{format}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-white rounded-2xl p-4 border border-slate-200">
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block mb-2">
                      🪝 Proven Reel & Ad Hook Scripts:
                    </span>
                    <ul className="space-y-2 text-xs text-indigo-950 font-medium">
                      {playbook.adStrategy.testedHooks.map((hook, idx) => (
                        <li key={idx} className="p-2 bg-indigo-50/60 rounded-xl border border-indigo-100">
                          {hook}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4">
                  <span className="text-xs font-bold text-rose-900 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                    Common Marketing Mistakes to Avoid:
                  </span>
                  <ul className="space-y-1 text-xs text-rose-800">
                    {playbook.adStrategy.adMistakesToAvoid.map((mistake, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-rose-500 font-bold">•</span>
                        <span>{mistake}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Tab 2: Channels & Bundling */}
            {activeTab === 'channels' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white rounded-2xl p-4 border border-slate-200 space-y-3">
                    <div>
                      <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider block">
                        Primary Recommended Sales Channel
                      </span>
                      <span className="text-sm font-black text-slate-900">{playbook.channelFit.primaryChannel}</span>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                        High-Converting Secondary Channels
                      </span>
                      <ul className="space-y-1 text-xs text-slate-700">
                        {playbook.channelFit.secondaryChannels.map((ch, idx) => (
                          <li key={idx} className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                            <span>{ch}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-2 border-t border-slate-100 text-xs text-slate-600">
                      {playbook.channelFit.channelNotes}
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl p-4 border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                        AOV & Profitable Bundling Ideas
                      </span>
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        Min Viable AOV: ₹{playbook.channelFit.minViableAov}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-500">
                      Selling single units via ads rarely leaves healthy profit. Bundle related items to reach at least ₹{playbook.channelFit.minViableAov} AOV:
                    </p>

                    <div className="space-y-2">
                      {playbook.channelFit.bundlingPlaybook.map((bundle, idx) => (
                        <div key={idx} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 flex items-center justify-between">
                          <span>{bundle}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: RTO & Shipping Rules */}
            {activeTab === 'rto' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white rounded-2xl p-4 border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                        Industry Benchmark RTO Rate
                      </span>
                      <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                        {playbook.rtoAndLogistics.benchmarkRtoRate}
                      </span>
                    </div>

                    <div className="space-y-2 pt-2">
                      <span className="text-xs font-bold text-slate-800 block">
                        Proven Tactics to Slash RTO in India:
                      </span>
                      <ul className="space-y-2 text-xs text-slate-600">
                        {playbook.rtoAndLogistics.codReductionTactics.map((tactic, idx) => (
                          <li key={idx} className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{tactic}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl p-4 border border-slate-200 space-y-2">
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block mb-2">
                      Fragility & Packaging Guardrails:
                    </span>
                    <ul className="space-y-2 text-xs text-slate-700">
                      {playbook.rtoAndLogistics.packagingRules.map((rule, idx) => (
                        <li key={idx} className="flex items-start gap-2 bg-indigo-50/50 p-2.5 rounded-xl border border-indigo-100">
                          <Truck className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                          <span>{rule}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 4: Seasonality & Margin Guardrails */}
            {activeTab === 'seasonality' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-2xl p-4 border border-slate-200 space-y-3">
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                    Festive Gifting & Peak Demand Months:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {playbook.seasonalCalendar.peakMonths.map((month, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-900 border border-amber-200 text-xs font-bold">
                        {month}
                      </span>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-slate-100 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Production Lead Time: {playbook.seasonalCalendar.leadTimeWeeks} Weeks
                    </span>
                    <p className="text-xs text-slate-700 font-medium">
                      💡 {playbook.seasonalCalendar.actionItem}
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-4 border border-slate-200 space-y-3">
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                    Healthy Margin Protection Rules:
                  </span>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="text-slate-500">Minimum Suggested Markup:</span>
                      <span className="font-bold text-slate-900">{playbook.marginGuardrails.minMarkupMultiple}</span>
                    </div>
                    <div className="flex justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="text-slate-500">Max B2B / Wholesale Discount:</span>
                      <span className="font-bold text-slate-900">{playbook.marginGuardrails.maxWholesaleDiscount}</span>
                    </div>
                    <div className="flex justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="text-slate-500">Free Shipping Threshold:</span>
                      <span className="font-bold text-indigo-700">Orders above ₹{playbook.marginGuardrails.freeShippingThreshold}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
