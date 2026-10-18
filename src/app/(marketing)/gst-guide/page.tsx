'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  FileText,
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  Scale,
  Receipt,
  Calendar,
  Search,
  ArrowRight,
  Sparkles,
  Building2,
  DollarSign,
  ShieldCheck,
  Download,
  Info,
} from 'lucide-react';
import {
  GST_CATALOG,
  GST_INDUSTRIES,
  type ProductType,
  type GSTCategoryItem,
} from '@/lib/gst-directory';
import {
  evaluateGSTNeed,
  GST_FILING_SCHEDULE,
  MANDATORY_INVOICE_FIELDS,
  EWAY_BILL_RULES,
  type GSTEvaluationQuery,
} from '@/lib/gst-compliance';

export default function GSTComplianceGuidePage() {
  const [activeTab, setActiveTab] = useState<'checker' | 'directory' | 'calendar' | 'invoicing'>('checker');

  // Interactive Checker State
  const [checkerQuery, setCheckerQuery] = useState<GSTEvaluationQuery>({
    productType: 'physical',
    annualTurnover: 1500000,
    supplyScope: 'intra-state',
    salesChannel: 'own_website',
    stateType: 'normal',
    isRegistered: false,
  });

  // Directory Search & Filters
  const [directorySearch, setDirectorySearch] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('All Industries');
  const [selectedProductType, setSelectedProductType] = useState<'all' | ProductType>('all');
  const [selectedRate, setSelectedRate] = useState<string>('all');

  // Late Fee Estimator State
  const [delayDays, setDelayDays] = useState(15);
  const [isNilReturn, setIsNilReturn] = useState(false);

  const verdict = evaluateGSTNeed(checkerQuery);

  const filteredDirectory = GST_CATALOG.filter((item) => {
    const q = directorySearch.toLowerCase();
    const matchesSearch =
      item.code.toLowerCase().includes(q) ||
      item.name.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.subcategory.toLowerCase().includes(q) ||
      item.keywords.some((k) => k.toLowerCase().includes(q));

    const matchesIndustry =
      selectedIndustry === 'All Industries' || item.industry === selectedIndustry;

    const matchesType =
      selectedProductType === 'all' || item.type === selectedProductType;

    const matchesRate =
      selectedRate === 'all' || item.ratePercent.toString() === selectedRate;

    return matchesSearch && matchesIndustry && matchesType && matchesRate;
  });

  // Calculate Late Fee
  const lateFeeDailyRate = isNilReturn ? 20 : 50; // ₹20 or ₹50 per day (split CGST + SGST)
  const estimatedLateFee = Math.min(delayDays * lateFeeDailyRate, isNilReturn ? 500 : 5000);

  return (
    <div className="bg-slate-50 min-h-screen text-slate-900 pb-24">
      {/* Hero Header */}
      <section className="bg-white border-b border-slate-200 pt-12 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-200/80 rounded-full px-4 py-1.5 text-xs font-bold text-indigo-700 mb-6">
            <Receipt className="w-4 h-4 text-indigo-600" />
            <span>2025–2026 Indian GST & Tax Compliance Handbook</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight max-w-4xl mx-auto">
            Everything Craft Founders Need to Know About{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
              GST, HSN Rates & Invoicing
            </span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Deterministic rules for physical craft goods, digital downloads, threshold exemptions, ITC recovery, and mandatory Rule 46 invoice standards.
          </p>

          {/* Tab Navigation */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
            {[
              { id: 'checker', label: 'Do I Need GST? (Decision Engine)', icon: HelpCircle },
              { id: 'directory', label: 'All Industries HSN & SAC Directory', icon: Building2 },
              { id: 'calendar', label: 'Filing Calendar & Penalties', icon: Calendar },
              { id: 'invoicing', label: 'Mandatory Invoice & E-Way Rules', icon: FileText },
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

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        {/* ==================== TAB 1: DO I NEED GST? ==================== */}
        {activeTab === 'checker' && (
          <div className="space-y-8">
            <div className="bg-white border-2 border-indigo-100 rounded-3xl p-6 sm:p-10 shadow-sm">
              <div className="max-w-3xl mb-8">
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider block mb-1">
                  Step-by-Step Statutory Evaluator
                </span>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                  Do You Legally Need a GST Registration?
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Adjust your product type, revenue, delivery destination, and channel below to get an instant statutory verdict based on Sections 22 and 24 of the CGST Act.
                </p>
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-8 border-b border-slate-100">
                {/* 1. Product Type */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    1. Product Format
                  </label>
                  <select
                    value={checkerQuery.productType}
                    onChange={(e) => setCheckerQuery({ ...checkerQuery, productType: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="physical">📦 Physical Good (Candles, Soaps, Apparel)</option>
                    <option value="digital">💻 Digital Download / Product (Notion, STL, Ebook)</option>
                    <option value="service">🛠️ Freelance Craft / Design Service</option>
                  </select>
                </div>

                {/* 2. Annual Sales Turnover */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      2. Annual Turnover
                    </label>
                    <span className="text-xs font-black text-indigo-600">
                      ₹{(checkerQuery.annualTurnover / 100000).toFixed(1)} Lakhs
                    </span>
                  </div>
                  <input
                    type="range"
                    min={100000}
                    max={10000000}
                    step={100000}
                    value={checkerQuery.annualTurnover}
                    onChange={(e) => setCheckerQuery({ ...checkerQuery, annualTurnover: Number(e.target.value) })}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                    <span>₹1L</span>
                    <span>₹40L (Threshold)</span>
                    <span>₹1 Cr</span>
                  </div>
                </div>

                {/* 3. Delivery Geography */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    3. Delivery Scope
                  </label>
                  <select
                    value={checkerQuery.supplyScope}
                    onChange={(e) => setCheckerQuery({ ...checkerQuery, supplyScope: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="intra-state">Intra-State Only (Within Same State)</option>
                    <option value="inter-state">Inter-State (Shipping to Other States)</option>
                    <option value="export">International Export (Outside India)</option>
                  </select>
                </div>

                {/* 4. Sales Channel */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    4. Primary Sales Channel
                  </label>
                  <select
                    value={checkerQuery.salesChannel}
                    onChange={(e) => setCheckerQuery({ ...checkerQuery, salesChannel: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="own_website">Own Storefront (Shopify / WooCommerce / Gumroad)</option>
                    <option value="marketplace">E-com Marketplace (Amazon / Flipkart / Etsy)</option>
                    <option value="offline_flea">Offline (Flea Market / Pop-ups / WhatsApp)</option>
                  </select>
                </div>
              </div>

              {/* Verdict Card */}
              <div className="mt-8">
                <div
                  className={`rounded-3xl p-6 sm:p-8 border-2 ${
                    verdict.isMandatory
                      ? 'bg-amber-50/60 border-amber-300'
                      : 'bg-emerald-50/60 border-emerald-300'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      {verdict.isMandatory ? (
                        <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold">
                          <AlertTriangle className="w-5 h-5" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                          <CheckCircle2 className="w-5 h-5" />
                        </div>
                      )}
                      <div>
                        <span
                          className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
                            verdict.isMandatory
                              ? 'bg-amber-200 text-amber-900'
                              : 'bg-emerald-200 text-emerald-900'
                          }`}
                        >
                          {verdict.verdictBadge.replace('_', ' ')}
                        </span>
                        <h3 className="text-xl font-black text-slate-900 mt-1">{verdict.verdictTitle}</h3>
                      </div>
                    </div>

                    <div className="text-left sm:text-right">
                      <span className="text-[11px] font-bold text-slate-500 block">Statutory Threshold:</span>
                      <span className="text-lg font-black text-slate-900">
                        {verdict.applicableThreshold > 0
                          ? `₹${(verdict.applicableThreshold / 100000).toFixed(0)} Lakhs`
                          : '₹0 (Mandatory from Day 1)'}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-slate-700 leading-relaxed mb-6 font-medium">
                    {verdict.summary}
                  </p>

                  <div className="bg-white rounded-2xl p-5 border border-slate-200/80 space-y-4">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                        Legal Authority & Section:
                      </h4>
                      <p className="text-xs font-mono text-indigo-700 font-semibold">{verdict.legalBasis}</p>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                        Recommended Action Plan:
                      </h4>
                      <ul className="space-y-1.5 text-xs text-slate-600">
                        {verdict.actionItems.map((item, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-indigo-600 font-bold mt-0.5">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                      <span><strong>Non-Compliance Risk:</strong> {verdict.penaltiesIfNonCompliant}</span>
                      <Link
                        href="/calculator"
                        className="font-bold text-indigo-600 hover:underline flex items-center gap-1 shrink-0 ml-4"
                      >
                        <span>Calculate with your recipe</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Reference Cards: Physical vs Digital Rules */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                    📦
                  </div>
                  <h3 className="font-bold text-slate-900 text-lg">Physical Craft Goods Rules</h3>
                </div>
                <ul className="space-y-3 text-xs text-slate-600 leading-relaxed">
                  <li className="flex gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>₹40 Lakhs Threshold:</strong> Available only if selling physical goods within your own home state.</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Inter-State Couriers:</strong> Shipping across state borders removes the ₹40L threshold and triggers mandatory GST under Section 24.</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Marketplaces:</strong> Amazon and Flipkart require GSTIN before your product listings go live.</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>E-Way Bill:</strong> Mandatory if invoice consignment value exceeds ₹50,000 for inter-state movement.</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                    💻
                  </div>
                  <h3 className="font-bold text-slate-900 text-lg">Digital Products & Downloads Rules</h3>
                </div>
                <ul className="space-y-3 text-xs text-slate-600 leading-relaxed">
                  <li className="flex gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                    <span><strong>Treated as Services (OIDAR):</strong> Downloads (Notion templates, STL 3D models, presets, ebooks) are categorized as services under SAC 9984.</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                    <span><strong>₹20 Lakhs Threshold:</strong> The statutory exemption limit for services is ₹20 Lakhs (not ₹40 Lakhs).</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                    <span><strong>Export with LUT (0% GST):</strong> Selling digital assets to buyers outside India on Gumroad or Etsy is 0% tax under Letter of Undertaking (LUT).</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                    <span><strong>Zero Physical E-Way Bill:</strong> Digital downloads are intangible files; E-Way bills are never required.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB 2: HSN & SAC DIRECTORY ==================== */}
        {activeTab === 'directory' && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                  Searchable Indian HSN & SAC Classification Catalog
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Verified official GST tariff rates, Input Tax Credit (ITC) eligibility, and statutory filing guidelines across major small-batch industries.
                </p>
              </div>

              {/* Filters & Search Toolbar */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    placeholder="Search candle, soap, resin, digital..."
                    value={directorySearch}
                    onChange={(e) => setDirectorySearch(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <select
                    value={selectedIndustry}
                    onChange={(e) => setSelectedIndustry(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {GST_INDUSTRIES.map((ind) => (
                      <option key={ind} value={ind}>
                        {ind}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <select
                    value={selectedProductType}
                    onChange={(e) => setSelectedProductType(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="all">All Formats (Physical & Digital)</option>
                    <option value="physical">Physical Goods Only (HSN)</option>
                    <option value="digital">Digital Products Only (SAC)</option>
                    <option value="service">Services Only (SAC)</option>
                  </select>
                </div>

                <div>
                  <select
                    value={selectedRate}
                    onChange={(e) => setSelectedRate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="all">All GST Rates (0%, 1.5%, 3%, 5%, 12%, 18%)</option>
                    <option value="0">0% Exempt (Fresh Bread, Live Plants, Printed Books)</option>
                    <option value="1.5">1.5% Special (Cut & Polished Gemstones)</option>
                    <option value="3">3% Concessional (Jewellery, Gold, Silverware)</option>
                    <option value="5">5% Concessional (Candles, Soaps, Spices, Honey, Tea)</option>
                    <option value="12">12% Standard (Ceramics, Wood, Cookware, Toys)</option>
                    <option value="18">18% Standard (Resin, Cosmetics, Digital, Software)</option>
                  </select>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
                  <span>Showing {filteredDirectory.length} verified classifications</span>
                  <span>Rates current for FY 2025–26</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredDirectory.map((item) => (
                    <div
                      key={`${item.code}-${item.name}`}
                      className="border-2 border-slate-200/80 hover:border-indigo-400 rounded-2xl p-5 bg-white shadow-xs transition-all space-y-3 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="font-mono font-black text-xs bg-slate-100 text-slate-800 px-2.5 py-1 rounded-md border border-slate-200">
                            {item.type === 'physical' ? `HSN ${item.code}` : `SAC ${item.code}`}
                          </span>
                          <span
                            className={`text-xs font-black px-2.5 py-1 rounded-md ${
                              item.ratePercent <= 5
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-indigo-100 text-indigo-800'
                            }`}
                          >
                            {item.ratePercent}% GST Rate
                          </span>
                        </div>

                        <h3 className="font-black text-slate-900 text-base leading-snug">{item.name}</h3>
                        <p className="text-[11px] font-bold text-indigo-600 mt-0.5">{item.industry} › {item.category}</p>

                        <div className="mt-3 bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs space-y-1.5 text-slate-600">
                          <div>
                            <span className="font-bold text-slate-800">ITC Recovery: </span>
                            <span className="text-[11px]">{item.itcDescription}</span>
                          </div>
                          <div>
                            <span className="font-bold text-slate-800">When GST is Needed: </span>
                            <span className="text-[11px]">{item.isGSTMandatoryToSell}</span>
                          </div>
                          <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-200">
                            <strong>2025 Notes: </strong>{item.notes2025}
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 flex items-center justify-between">
                        <span className="text-[10px] text-slate-400 uppercase font-semibold">
                          Format: {item.type}
                        </span>
                        <Link
                          href="/calculator"
                          className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800"
                        >
                          <span>Cost this in Studio</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB 3: FILING CALENDAR & PENALTIES ==================== */}
        {activeTab === 'calendar' && (
          <div className="space-y-8">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-2">
                Mandatory GST Return Filing Schedule & Forms
              </h2>
              <p className="text-xs text-slate-500 mb-6">
                All registered GSTIN holders must file regular returns even during months with zero revenue (NIL return).
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead>
                    <tr className="border-b border-slate-200 text-xs font-bold text-slate-400 uppercase tracking-wider">
                      <th className="pb-3">Form Name</th>
                      <th className="pb-3">Statutory Purpose</th>
                      <th className="pb-3">Filing Frequency</th>
                      <th className="pb-3">Due Date</th>
                      <th className="pb-3">Late Fee / Day</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {GST_FILING_SCHEDULE.map((form) => (
                      <tr key={form.name} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3.5 font-black text-indigo-700 text-base">{form.name}</td>
                        <td className="py-3.5 text-xs text-slate-700 max-w-xs">{form.purpose}</td>
                        <td className="py-3.5 text-xs font-bold text-slate-800">{form.frequency}</td>
                        <td className="py-3.5 text-xs font-semibold text-rose-700">{form.dueDate}</td>
                        <td className="py-3.5 text-xs font-mono text-slate-600">
                          ₹{form.lateFeePerDay.normal}/day (₹{form.lateFeePerDay.nil}/day NIL)
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Late Fee & Penalty Interactive Simulator */}
            <div className="bg-white border-2 border-rose-200 rounded-3xl p-6 sm:p-8 shadow-xs">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
                <h3 className="text-xl font-black text-slate-900">
                  Late Filing Fee & Interest Penalty Calculator
                </h3>
              </div>
              <p className="text-xs text-slate-500 mb-6">
                Calculate your potential liability under Section 47 of the CGST Act if return filing is delayed past the statutory due date.
              </p>

              <div className="grid sm:grid-cols-3 gap-6 items-end pb-6 border-b border-slate-100">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Days of Delay
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={365}
                    value={delayDays}
                    onChange={(e) => setDelayDays(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 font-bold text-slate-900 text-sm"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-xs text-slate-800 p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <input
                      type="checkbox"
                      checked={isNilReturn}
                      onChange={(e) => setIsNilReturn(e.target.checked)}
                      className="w-4 h-4 text-indigo-600 rounded"
                    />
                    <span>NIL Return (Zero Sales in Period)</span>
                  </label>
                </div>

                <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 text-center">
                  <span className="text-[11px] font-bold text-rose-700 uppercase tracking-wider block">
                    Estimated Statutory Late Fee
                  </span>
                  <span className="text-2xl font-black text-rose-700">
                    ₹{estimatedLateFee.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] text-rose-500 block mt-0.5">
                    (₹{lateFeeDailyRate}/day, capped under amnesty rules)
                  </span>
                </div>
              </div>

              <div className="mt-4 text-xs text-slate-500 space-y-1">
                <p>⚠️ In addition to late fees, Section 50 mandates interest at <strong>18% per annum</strong> on net unpaid cash tax liability.</p>
                <p>💡 Tip: Even if you made 0 craft sales this month, always file your NIL GSTR-1 and GSTR-3B before the 11th and 20th to prevent accumulating daily late fees.</p>
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB 4: INVOICING & MANDATORY DOCUMENTS ==================== */}
        {activeTab === 'invoicing' && (
          <div className="space-y-8">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-2">
                Mandatory Rule 46 Tax Invoice Standard
              </h2>
              <p className="text-xs text-slate-500 mb-6">
                Under Rule 46 of the CGST Rules, every tax invoice issued by a registered maker must contain these 12 essential fields for legal validity and buyer ITC claims.
              </p>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {MANDATORY_INVOICE_FIELDS.map((item) => (
                  <div key={item.fieldNumber} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="w-5 h-5 rounded-md bg-indigo-600 text-white font-bold text-[10px] flex items-center justify-center">
                        {item.fieldNumber}
                      </span>
                      <h4 className="font-bold text-slate-900 text-xs">{item.fieldName}</h4>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed mb-2">{item.explanation}</p>
                    <div className="bg-white p-2 rounded-lg border border-slate-200 text-[10px] font-mono text-indigo-700">
                      <strong>Sample:</strong> {item.example}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* E-Way Bill Regulations Card */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                  🚚
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">Electronic Way Bill (E-Way Bill) Regulations</h3>
                  <p className="text-xs text-slate-500">Requirements for shipping parcels across state borders</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Inter-State Threshold</span>
                  <div className="text-xl font-black text-slate-900 mt-1">₹50,000</div>
                  <span className="text-[10px] text-slate-500">Mandatory for goods parcel value &gt; ₹50K</span>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Intra-State Exceptions</span>
                  <div className="text-xl font-black text-indigo-700 mt-1">₹1,00,000</div>
                  <span className="text-[10px] text-slate-500">In MH, Delhi, WB, TN for local delivery</span>
                </div>

                <div className="p-4 bg-purple-50 rounded-2xl border border-purple-200">
                  <span className="text-[10px] font-bold text-purple-700 uppercase">Digital Downloads Rule</span>
                  <div className="text-xl font-black text-purple-900 mt-1">Exempt (₹0)</div>
                  <span className="text-[10px] text-purple-600 font-semibold">Zero E-Way bill for digital assets</span>
                </div>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed">
                {EWAY_BILL_RULES.digitalProductRule} If you ship a large wholesale batch of physical craft products (e.g. 100 candle jars worth ₹60,000 to another state), you or your courier partner (Delhivery, Shiprocket) must generate an E-Way Bill on ewaybillgst.gov.in prior to parcel handover.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
