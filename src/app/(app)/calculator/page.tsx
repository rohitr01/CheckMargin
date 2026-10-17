'use client';

import { useState, useEffect } from 'react';
import {
  calculateBatchCost,
  suggestPrices,
  generateShoppingList,
  calculateWholesaleTiers,
  scaleBatch,
  HSN_DIRECTORY,
  type BatchInput,
  type CalculationResult,
  CHANNEL_PRESETS,
} from '@/lib/calculator';
import {
  Calculator,
  Plus,
  Trash2,
  TrendingUp,
  AlertCircle,
  Package,
  Layers,
  Sparkles,
  ShoppingBag,
  HelpCircle,
  Coins,
  ShieldCheck,
  CheckCircle2,
  Receipt,
  FileSpreadsheet,
  Printer,
  Save,
  ArrowRight,
  Truck,
  Store,
  DollarSign,
  Percent,
  Building2,
  Scale,
  BookOpen,
  X,
  Search,
  Zap,
  SlidersHorizontal,
} from 'lucide-react';

const HSN_PRESETS = [
  { code: '3406', name: 'Candles & Tapres', defaultRate: 5 },
  { code: '3401', name: 'Soaps & Cleansing Bars', defaultRate: 5 },
  { code: '1905', name: 'Bakery, Cakes, Biscuits', defaultRate: 5 },
  { code: '3304', name: 'Cosmetics, Skincare, Serums', defaultRate: 18 },
  { code: '3926', name: 'Resin Art & Molded Plastic Decor', defaultRate: 18 },
  { code: '6815', name: 'Jesmonite, Cement & Plaster Decor', defaultRate: 18 },
  { code: '6204', name: 'Apparel & Handmade Garments', defaultRate: 12 },
  { code: '9999', name: 'Other General Goods', defaultRate: 18 },
];

const INITIAL_MATERIALS = [
  { name: 'Pure Soy Wax (Flakes)', packPrice: 850, packSize: 1000, packUnit: 'g', qtyUsed: 1800, gstRatePercent: 18, isPackPriceGSTInclusive: true },
  { name: 'French Vanilla Fragrance Oil', packPrice: 1400, packSize: 100, packUnit: 'ml', qtyUsed: 120, gstRatePercent: 18, isPackPriceGSTInclusive: true },
  { name: 'Braided Cotton Wicks + Tabs', packPrice: 150, packSize: 50, packUnit: 'piece', qtyUsed: 10, gstRatePercent: 12, isPackPriceGSTInclusive: true },
  { name: 'Frosted Glass Amber Jars (250ml)', packPrice: 700, packSize: 20, packUnit: 'piece', qtyUsed: 10, gstRatePercent: 18, isPackPriceGSTInclusive: true },
  { name: 'Metallic Foiled Brand Label', packPrice: 200, packSize: 50, packUnit: 'piece', qtyUsed: 10, gstRatePercent: 18, isPackPriceGSTInclusive: true },
];

const INITIAL_FORM: BatchInput = {
  productName: 'Handcrafted 200g Vanilla Soy Candle',
  hsnCode: '3406',
  materials: INITIAL_MATERIALS,
  batchSize: 10,
  failedUnits: 1,
  labourMinutes: 90,
  labourHourlyRate: 150,
  packagingPerUnit: 25,
  overheadPerBatch: 50,
  sellingPrice: 599,
  channelId: 'amazon',
  platformFeePercent: 12,
  platformFeeFixed: 15,
  gstOnPlatformFeePercent: 18,
  shippingPerOrder: 65,
  adSpendPerUnit: 40,
  rtoRatePercent: 8,
  rtoLossPerReturn: 90,
  isGSTRegistered: true,
  claimITC: true,
  supplyType: 'intra-state',
  outputGSTRatePercent: 5,
  isPriceGSTInclusive: true,
  monthlyFixedCost: 15000,
};

export default function CalculatorPage() {
  const [materials, setMaterials] = useState(INITIAL_MATERIALS);
  const [form, setForm] = useState<BatchInput>(INITIAL_FORM);
  const [targetUnits, setTargetUnits] = useState(30);
  const [wholesaleMOQ, setWholesaleMOQ] = useState(25);
  const [scaleMultiplier, setScaleMultiplier] = useState(5);
  const [isHSNModalOpen, setIsHSNModalOpen] = useState(false);
  const [hsnSearch, setHsnSearch] = useState('');
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [error, setError] = useState('');
  const [saveMessage, setSaveMessage] = useState('');

  // Auto calculate on mount & state changes
  useEffect(() => {
    recalc(form, materials);
  }, []);

  function recalc(f: BatchInput, m: typeof materials) {
    if (!f.productName.trim() || f.batchSize <= 0) return;
    const res = calculateBatchCost({ ...f, materials: m });
    setResult(res);
  }

  function handleChannelChange(channelId: string) {
    const preset = CHANNEL_PRESETS.find((p) => p.id === channelId);
    if (preset) {
      const updated = {
        ...form,
        channelId,
        platformFeePercent: preset.feePercent,
        platformFeeFixed: preset.fixedFee,
        shippingPerOrder: preset.shipping,
        gstOnPlatformFeePercent: preset.gstOnFeesPercent,
      };
      setForm(updated);
      recalc(updated, materials);
    }
  }

  function handleHSNChange(code: string) {
    const preset = HSN_PRESETS.find((h) => h.code === code);
    const updated = {
      ...form,
      hsnCode: code,
      outputGSTRatePercent: preset ? preset.defaultRate : form.outputGSTRatePercent,
    };
    setForm(updated);
    recalc(updated, materials);
  }

  function updateMaterial(i: number, field: string, value: string | number | boolean) {
    const updated = materials.map((m, idx) => (idx === i ? { ...m, [field]: value } : m));
    setMaterials(updated);
    recalc(form, updated);
  }

  function addMaterial() {
    const updated = [
      ...materials,
      { name: '', packPrice: 0, packSize: 1, packUnit: 'g', qtyUsed: 0, gstRatePercent: 18, isPackPriceGSTInclusive: true },
    ];
    setMaterials(updated);
  }

  function removeMaterial(i: number) {
    const updated = materials.filter((_, idx) => idx !== i);
    setMaterials(updated);
    recalc(form, updated);
  }

  function handleSaveProduct() {
    if (!result) return;
    try {
      const savedList = JSON.parse(localStorage.getItem('checkmargin_products') || localStorage.getItem('makermargin_products') || '[]');
      const newEntry = {
        id: Date.now().toString(),
        title: form.productName,
        category: form.hsnCode || 'General',
        unitCost: `₹${result.totalCostPerUnit.toFixed(2)}`,
        sellingPrice: `₹${form.sellingPrice.toFixed(2)}`,
        margin: `${result.grossMarginPercent.toFixed(1)}%`,
        saleableYield: `${result.saleableYield} / ${form.batchSize}`,
        date: new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }),
      };
      savedList.unshift(newEntry);
      localStorage.setItem('checkmargin_products', JSON.stringify(savedList));
      setSaveMessage('✅ Product successfully saved to library!');
      setTimeout(() => setSaveMessage(''), 4000);
    } catch {
      setSaveMessage('Saved in current session.');
    }
  }

  function handlePrint() {
    window.print();
  }

  function handleExportCSV() {
    if (!result) return;
    const rows = [
      ['CheckMargin - Product Costing Summary'],
      ['Product Name', form.productName],
      ['HSN Code', form.hsnCode || ''],
      ['Batch Size', form.batchSize.toString()],
      ['Saleable Yield', result.saleableYield.toString()],
      ['Yield Efficiency', `${result.yieldEfficiencyPercent.toFixed(1)}%`],
      [''],
      ['COST COMPONENT', 'AMOUNT PER UNIT (INR)'],
      ['Direct Materials (ex-tax or gross)', result.materialCostPerUnit.toFixed(2)],
      ['Direct Craft Labour', result.labourCostPerUnit.toFixed(2)],
      ['Packaging & Inserts', form.packagingPerUnit.toFixed(2)],
      ['Batch Overhead Allocation', result.overheadPerUnit.toFixed(2)],
      ['Total Direct Cost per Unit', result.totalDirectCostPerUnit.toFixed(2)],
      [''],
      ['Platform & Commission Fee', result.platformFeeRaw.toFixed(2)],
      ['18% GST on Platform Services', result.gstOnPlatformFee.toFixed(2)],
      ['Seller-Paid Shipping', result.shippingCostPerUnit.toFixed(2)],
      ['CAC / Ad Spend per Unit', result.adSpendPerUnit.toFixed(2)],
      ['RTO & Return Reserve', result.rtoAllowancePerUnit.toFixed(2)],
      ['Total Selling & Channel Costs', result.totalSellingCostPerUnit.toFixed(2)],
      [''],
      ['TRUE TOTAL COST PER UNIT', result.totalCostPerUnit.toFixed(2)],
      ['Customer Selling Price', form.sellingPrice.toFixed(2)],
      ['Taxable Value (ex-Output GST)', result.gst.taxableValue.toFixed(2)],
      ['Output GST Collected', result.gst.outputGSTTotal.toFixed(2)],
      ['Eligible Input Tax Credit (ITC)', result.gst.eligibleITC.toFixed(2)],
      ['Net GST Cash Payable to Govt', result.gst.netGSTPayable.toFixed(2)],
      ['NET PROFIT PER UNIT', result.grossProfitPerUnit.toFixed(2)],
      ['GROSS MARGIN %', `${result.grossMarginPercent.toFixed(2)}%`],
      [''],
      ['MONTHLY BREAK-EVEN'],
      ['Monthly Fixed Costs', `INR ${result.monthlyFixedCost}`],
      ['Break-even Volume Required', `${result.breakEvenUnitsPerMonth} units`],
      ['Break-even Revenue Required', `INR ${result.breakEvenRevenuePerMonth.toFixed(2)}`],
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${form.productName.replace(/\s+/g, '_')}_Costing.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const prices = result ? suggestPrices(result.totalDirectCostPerUnit) : [];
  const shoppingList = result
    ? generateShoppingList(materials, targetUnits, result.saleableYield, form.batchSize)
    : [];

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20 print:p-0 print:max-w-none">
      {/* Header and Quick Presets */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-xs print:border-none print:p-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full mb-2">
              <Calculator className="w-3.5 h-3.5" />
              <span>Advanced Batch & GST Costing Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Batch Cost & Margin Calculator
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              End-to-end unit economics: wholesale packs, scrap yield, platform commissions, RTO loss, and Indian GST Input/Output reconciliation.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 print:hidden">
            <button
              onClick={handleSaveProduct}
              className="inline-flex items-center gap-1.5 text-xs font-bold bg-white hover:bg-slate-50 text-slate-700 px-3.5 py-2 rounded-xl border border-slate-300 shadow-xs transition-colors cursor-pointer"
            >
              <Save className="w-3.5 h-3.5 text-indigo-600" />
              <span>Save to Library</span>
            </button>
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 text-xs font-bold bg-white hover:bg-slate-50 text-slate-700 px-3.5 py-2 rounded-xl border border-slate-300 shadow-xs transition-colors cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-2 rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
          </div>
        </div>

        {saveMessage && (
          <div className="mt-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold px-4 py-2 rounded-xl">
            {saveMessage}
          </div>
        )}
      </div>

      {/* Top Real-time Executive KPI Banner */}
      {result && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white border-2 border-slate-200 rounded-2xl p-5 shadow-xs">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
              True Unit Cost
            </span>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">
              ₹{result.totalCostPerUnit.toFixed(2)}
            </div>
            <span className="text-[11px] font-semibold text-slate-400 mt-1 block">
              Direct: ₹{result.totalDirectCostPerUnit.toFixed(2)} | Selling: ₹{result.totalSellingCostPerUnit.toFixed(2)}
            </span>
          </div>

          <div className="bg-white border-2 border-slate-200 rounded-2xl p-5 shadow-xs">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Customer Price
            </span>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">
              ₹{form.sellingPrice}
            </div>
            <span className="text-[11px] font-semibold text-indigo-600 mt-1 block">
              Taxable: ₹{result.gst.taxableValue.toFixed(2)} ({form.isPriceGSTInclusive ? 'GST Incl.' : 'GST Excl.'})
            </span>
          </div>

          <div className={`border-2 rounded-2xl p-5 shadow-xs ${result.grossProfitPerUnit >= 0 ? 'bg-emerald-50/70 border-emerald-300' : 'bg-rose-50/70 border-rose-300'}`}>
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1">
              Net Profit / Unit
            </span>
            <div className={`text-2xl sm:text-3xl font-black ${result.grossProfitPerUnit >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
              ₹{result.grossProfitPerUnit.toFixed(2)}
            </div>
            <span className={`text-[11px] font-bold mt-1 block ${result.grossProfitPerUnit >= 0 ? 'text-emerald-800' : 'text-rose-800'}`}>
              Net Margin: {result.grossMarginPercent.toFixed(1)}% | Markup: {result.markupPercent.toFixed(0)}%
            </span>
          </div>

          <div className="bg-white border-2 border-slate-200 rounded-2xl p-5 shadow-xs">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Monthly Break-Even
            </span>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">
              {result.breakEvenUnitsPerMonth} <span className="text-base font-bold text-slate-400">units</span>
            </div>
            <span className="text-[11px] font-semibold text-slate-500 mt-1 block">
              Covers ₹{result.monthlyFixedCost.toLocaleString('en-IN')}/mo fixed overhead
            </span>
          </div>
        </div>
      )}

      {/* Inputs Form */}
      <div className="space-y-6">
        {/* Section 1: Product & Classification */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">1</span>
            <h2 className="font-bold text-slate-900 text-lg">Product Identity & Tax Category (HSN)</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Product Title
              </label>
              <input
                type="text"
                value={form.productName}
                onChange={(e) => {
                  const updated = { ...form, productName: e.target.value };
                  setForm(updated);
                  recalc(updated, materials);
                }}
                placeholder="e.g. 200g Lavender Soy Jar Candle"
                className="w-full bg-white border border-slate-300 text-slate-900 rounded-xl px-4 py-2.5 font-bold text-base focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                HSN Classification
              </label>
              <select
                value={form.hsnCode}
                onChange={(e) => handleHSNChange(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                {HSN_PRESETS.map((h) => (
                  <option key={h.code} value={h.code}>
                    HSN {h.code} - {h.name} ({h.defaultRate}%)
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Recipe Materials & Input GST */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">2</span>
              <h2 className="font-bold text-slate-900 text-lg">Bill of Materials (BOM) & Input GST</h2>
            </div>
            <button
              onClick={addMaterial}
              className="inline-flex items-center gap-1.5 text-xs font-bold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-3.5 py-2 rounded-xl border border-indigo-200 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Material Line</span>
            </button>
          </div>

          <p className="text-xs text-slate-500 mb-6">
            Enter wholesale pack purchase price and size. CheckMargin extracts the exact batch fraction and isolates the Input GST paid for tax credit (ITC) reconciliation.
          </p>

          <div className="overflow-x-auto -mx-6 md:mx-0 px-6 md:px-0">
            <div className="min-w-[840px] space-y-3">
              <div className="grid grid-cols-12 gap-3 text-xs font-bold text-slate-400 uppercase tracking-wider px-2">
                <div className="col-span-3">Material / Ingredient</div>
                <div className="col-span-2">Pack Price (₹)</div>
                <div className="col-span-2">Pack Size & Unit</div>
                <div className="col-span-2">Input GST %</div>
                <div className="col-span-2">Qty in Batch</div>
                <div className="col-span-1 text-right">Delete</div>
              </div>

              {materials.map((m, i) => (
                <div
                  key={i}
                  className="grid grid-cols-12 gap-3 items-center bg-slate-50 border border-slate-200 rounded-xl p-3 hover:border-slate-300 transition-all"
                >
                  <div className="col-span-3">
                    <input
                      type="text"
                      placeholder="e.g. Soy Wax"
                      value={m.name}
                      onChange={(e) => updateMaterial(i, 'name', e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      type="number"
                      placeholder="800"
                      value={m.packPrice || ''}
                      onChange={(e) => updateMaterial(i, 'packPrice', parseFloat(e.target.value) || 0)}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div className="col-span-2 flex gap-1.5">
                    <input
                      type="number"
                      placeholder="1000"
                      value={m.packSize || ''}
                      onChange={(e) => updateMaterial(i, 'packSize', parseFloat(e.target.value) || 1)}
                      className="w-20 bg-white border border-slate-300 rounded-lg px-2.5 py-2 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                    <select
                      value={m.packUnit}
                      onChange={(e) => updateMaterial(i, 'packUnit', e.target.value)}
                      className="flex-1 bg-white border border-slate-300 rounded-lg px-1.5 py-2 text-xs font-bold text-slate-700"
                    >
                      <option value="g">g</option>
                      <option value="kg">kg</option>
                      <option value="ml">ml</option>
                      <option value="L">L</option>
                      <option value="piece">pcs</option>
                      <option value="metre">m</option>
                      <option value="pack">pack</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <select
                      value={m.gstRatePercent ?? 18}
                      onChange={(e) => updateMaterial(i, 'gstRatePercent', parseFloat(e.target.value))}
                      className="w-full bg-white border border-slate-300 rounded-lg px-2 py-2 text-xs font-bold text-slate-700"
                    >
                      <option value="0">0% (Exempt)</option>
                      <option value="5">5% Input GST</option>
                      <option value="12">12% Input GST</option>
                      <option value="18">18% Input GST</option>
                      <option value="28">28% Input GST</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <input
                      type="number"
                      placeholder="150"
                      value={m.qtyUsed || ''}
                      onChange={(e) => updateMaterial(i, 'qtyUsed', parseFloat(e.target.value) || 0)}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm font-black text-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div className="col-span-1 text-right">
                    {materials.length > 1 && (
                      <button
                        onClick={() => removeMaterial(i)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Delete line"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section 3: Batch Production & Usable Yield */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">3</span>
            <h2 className="font-bold text-slate-900 text-lg">Batch Production Volume & Scrap Yield</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Total Batch Size (Units Made)
              </label>
              <input
                type="number"
                value={form.batchSize || ''}
                onChange={(e) => {
                  const updated = { ...form, batchSize: parseFloat(e.target.value) || 0 };
                  setForm(updated);
                  recalc(updated, materials);
                }}
                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 font-bold text-slate-900 text-base"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Failed / Defective Scrap Units
              </label>
              <input
                type="number"
                value={form.failedUnits}
                onChange={(e) => {
                  const updated = { ...form, failedUnits: parseFloat(e.target.value) || 0 };
                  setForm(updated);
                  recalc(updated, materials);
                }}
                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 font-bold text-rose-700 text-base"
              />
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex flex-col justify-center">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Net Saleable Yield</span>
              <span className="text-2xl font-black text-indigo-700">
                {Math.max(form.batchSize - form.failedUnits, 0)} units
              </span>
              <span className="text-[11px] font-semibold text-slate-400">
                Yield Efficiency: {form.batchSize > 0 ? (((form.batchSize - form.failedUnits) / form.batchSize) * 100).toFixed(0) : 0}%
              </span>
            </div>
          </div>
        </div>

        {/* Section 4: Direct Labour, Packaging & Studio Overhead */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">4</span>
            <h2 className="font-bold text-slate-900 text-lg">Labour, Packaging & Studio Overhead</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Batch Labour (Minutes)
              </label>
              <input
                type="number"
                value={form.labourMinutes || ''}
                onChange={(e) => {
                  const updated = { ...form, labourMinutes: parseFloat(e.target.value) || 0 };
                  setForm(updated);
                  recalc(updated, materials);
                }}
                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 font-bold text-slate-900 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Hourly Wage (₹ / Hour)
              </label>
              <input
                type="number"
                value={form.labourHourlyRate || ''}
                onChange={(e) => {
                  const updated = { ...form, labourHourlyRate: parseFloat(e.target.value) || 0 };
                  setForm(updated);
                  recalc(updated, materials);
                }}
                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 font-bold text-slate-900 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Packaging / Unit (₹)
              </label>
              <input
                type="number"
                value={form.packagingPerUnit || ''}
                onChange={(e) => {
                  const updated = { ...form, packagingPerUnit: parseFloat(e.target.value) || 0 };
                  setForm(updated);
                  recalc(updated, materials);
                }}
                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 font-bold text-slate-900 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Overhead / Batch (₹)
              </label>
              <input
                type="number"
                value={form.overheadPerBatch || ''}
                onChange={(e) => {
                  const updated = { ...form, overheadPerBatch: parseFloat(e.target.value) || 0 };
                  setForm(updated);
                  recalc(updated, materials);
                }}
                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 font-bold text-slate-900 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Section 5: Sales Channel, Commissions & RTO */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">5</span>
              <h2 className="font-bold text-slate-900 text-lg">Sales Channel, Logistics & RTO Loss Reserve</h2>
            </div>
            {/* Channel Preset Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase">Preset:</span>
              <select
                value={form.channelId}
                onChange={(e) => handleChannelChange(e.target.value)}
                className="bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold px-3 py-1.5 rounded-lg"
              >
                {CHANNEL_PRESETS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Customer Selling Price (₹)
              </label>
              <input
                type="number"
                value={form.sellingPrice || ''}
                onChange={(e) => {
                  const updated = { ...form, sellingPrice: parseFloat(e.target.value) || 0 };
                  setForm(updated);
                  recalc(updated, materials);
                }}
                className="w-full bg-white border-2 border-indigo-500 rounded-xl px-4 py-2.5 font-black text-indigo-950 text-base"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Platform Fee (%) + Fixed (₹)
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="%"
                  value={form.platformFeePercent}
                  onChange={(e) => {
                    const updated = { ...form, platformFeePercent: parseFloat(e.target.value) || 0 };
                    setForm(updated);
                    recalc(updated, materials);
                  }}
                  className="w-1/2 bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm font-bold"
                />
                <input
                  type="number"
                  placeholder="₹ fixed"
                  value={form.platformFeeFixed}
                  onChange={(e) => {
                    const updated = { ...form, platformFeeFixed: parseFloat(e.target.value) || 0 };
                    setForm(updated);
                    recalc(updated, materials);
                  }}
                  className="w-1/2 bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm font-bold"
                />
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">+18% GST charged on platform fee</span>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Seller-Paid Shipping (₹)
              </label>
              <input
                type="number"
                value={form.shippingPerOrder}
                onChange={(e) => {
                  const updated = { ...form, shippingPerOrder: parseFloat(e.target.value) || 0 };
                  setForm(updated);
                  recalc(updated, materials);
                }}
                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 font-bold text-slate-900 text-sm"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Logistics cost if free delivery</span>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Ad Spend / CAC (₹)
              </label>
              <input
                type="number"
                value={form.adSpendPerUnit}
                onChange={(e) => {
                  const updated = { ...form, adSpendPerUnit: parseFloat(e.target.value) || 0 };
                  setForm(updated);
                  recalc(updated, materials);
                }}
                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 font-bold text-slate-900 text-sm"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Meta / Google ads acquisition</span>
            </div>
          </div>

          {/* RTO / Returns Protection */}
          <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Expected RTO / Customer Return Rate (%)
              </label>
              <input
                type="number"
                value={form.rtoRatePercent}
                onChange={(e) => {
                  const updated = { ...form, rtoRatePercent: parseFloat(e.target.value) || 0 };
                  setForm(updated);
                  recalc(updated, materials);
                }}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-sm font-bold text-slate-900"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">Indian e-com COD average: 8%–15%</span>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Average Loss per RTO / Damaged Return (₹)
              </label>
              <input
                type="number"
                value={form.rtoLossPerReturn}
                onChange={(e) => {
                  const updated = { ...form, rtoLossPerReturn: parseFloat(e.target.value) || 0 };
                  setForm(updated);
                  recalc(updated, materials);
                }}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-sm font-bold text-slate-900"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">Unrecoverable reverse courier + scrap pack</span>
            </div>
          </div>
        </div>

        {/* Section 6: Full GST Operating Center (Input, Output, ITC) */}
        <div className="bg-white border-2 border-indigo-200 rounded-3xl p-6 md:p-8 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div className="flex items-center gap-2">
              <Receipt className="w-5 h-5 text-indigo-600" />
              <h2 className="font-bold text-slate-900 text-lg">Indian GST Operating Center & ITC Reconciliation</h2>
            </div>
            <button
              type="button"
              onClick={() => setIsHSNModalOpen(true)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-3.5 py-2 rounded-xl transition-colors cursor-pointer w-fit"
            >
              <BookOpen className="w-4 h-4 text-indigo-600" />
              <span>Explore Craft GST & HSN Directory</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 mb-6">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col justify-between">
              <div>
                <label className="flex items-center gap-2 cursor-pointer font-bold text-xs text-slate-800">
                  <input
                    type="checkbox"
                    checked={form.isGSTRegistered}
                    onChange={(e) => {
                      const updated = { ...form, isGSTRegistered: e.target.checked };
                      setForm(updated);
                      recalc(updated, materials);
                    }}
                    className="w-4 h-4 text-indigo-600 rounded"
                  />
                  <span>GST Registered Seller</span>
                </label>
                <p className="text-[11px] text-slate-400 mt-1">If uncheck, selling price is full revenue and input tax is a sunk cost.</p>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col justify-between">
              <div>
                <label className="flex items-center gap-2 cursor-pointer font-bold text-xs text-slate-800">
                  <input
                    type="checkbox"
                    checked={form.claimITC}
                    disabled={!form.isGSTRegistered}
                    onChange={(e) => {
                      const updated = { ...form, claimITC: e.target.checked };
                      setForm(updated);
                      recalc(updated, materials);
                    }}
                    className="w-4 h-4 text-indigo-600 rounded"
                  />
                  <span>Claim Input Tax Credit (ITC)</span>
                </label>
                <p className="text-[11px] text-slate-400 mt-1">Offsets raw material GST against output tax owed.</p>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Output GST Rate
              </label>
              <select
                value={form.outputGSTRatePercent}
                disabled={!form.isGSTRegistered}
                onChange={(e) => {
                  const updated = { ...form, outputGSTRatePercent: parseFloat(e.target.value) || 0 };
                  setForm(updated);
                  recalc(updated, materials);
                }}
                className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-800"
              >
                <option value="0">0% (Nil / Exempt)</option>
                <option value="5">5% Concessional Rate</option>
                <option value="12">12% Standard Rate</option>
                <option value="18">18% Standard Rate</option>
                <option value="28">28% Luxury Rate</option>
              </select>
              <label className="flex items-center gap-1.5 mt-2 text-[11px] font-semibold text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isPriceGSTInclusive}
                  onChange={(e) => {
                    const updated = { ...form, isPriceGSTInclusive: e.target.checked };
                    setForm(updated);
                    recalc(updated, materials);
                  }}
                  className="w-3.5 h-3.5 rounded"
                />
                <span>Price is GST-Inclusive</span>
              </label>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Supply Destination
              </label>
              <select
                value={form.supplyType}
                disabled={!form.isGSTRegistered}
                onChange={(e) => {
                  const updated = { ...form, supplyType: e.target.value as any };
                  setForm(updated);
                  recalc(updated, materials);
                }}
                className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-800"
              >
                <option value="intra-state">Intra-State (CGST + SGST)</option>
                <option value="inter-state">Inter-State (IGST)</option>
              </select>
              <span className="text-[10px] text-slate-400 mt-1 block">
                {form.supplyType === 'intra-state' ? 'Split 50% Center, 50% State' : '100% IGST'}
              </span>
            </div>
          </div>

          {/* Real-time GST Statement Table */}
          {result && form.isGSTRegistered && (
            <div className="bg-slate-900 text-white rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                  Tax Reconciliation Summary (Per Unit)
                </span>
                <span className="text-xs text-slate-400">HSN: {form.hsnCode} ({form.outputGSTRatePercent}%)</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block mb-0.5">Taxable Sales Value:</span>
                  <span className="text-base font-black text-white">₹{result.gst.taxableValue.toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Output GST Collected:</span>
                  <span className="text-base font-black text-amber-400">₹{result.gst.outputGSTTotal.toFixed(2)}</span>
                  <span className="text-[10px] text-slate-500 block">
                    {form.supplyType === 'intra-state'
                      ? `CGST ₹${result.gst.cgstAmount.toFixed(2)} + SGST ₹${result.gst.sgstAmount.toFixed(2)}`
                      : `IGST ₹${result.gst.igstAmount.toFixed(2)}`}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Raw Material ITC Claimed:</span>
                  <span className="text-base font-black text-emerald-400">₹{result.gst.eligibleITC.toFixed(2)}</span>
                  <span className="text-[10px] text-slate-500 block">Total Input Tax Credit</span>
                </div>
                <div className="bg-indigo-950/80 border border-indigo-700/50 p-2.5 rounded-xl">
                  <span className="text-indigo-300 block mb-0.5 font-bold">Net Cash Tax Payable:</span>
                  <span className="text-xl font-black text-white">₹{result.gst.netGSTPayable.toFixed(2)}</span>
                  <span className="text-[10px] text-indigo-300 block">Cash outflow to Govt</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Comprehensive Output Section */}
      {result && (
        <div className="space-y-8 pt-4">
          {/* Detailed Cost Summary Card */}
          <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 md:p-8 shadow-xs">
            <h3 className="text-xl font-black text-slate-900 mb-6">
              Complete Cost & Fee Schedule per Saleable Unit
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mb-6">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Materials</span>
                <div className="text-base font-black text-slate-900 mt-0.5">₹{result.materialCostPerUnit.toFixed(2)}</div>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Direct Labour</span>
                <div className="text-base font-black text-slate-900 mt-0.5">₹{result.labourCostPerUnit.toFixed(2)}</div>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Packaging</span>
                <div className="text-base font-black text-slate-900 mt-0.5">₹{form.packagingPerUnit.toFixed(2)}</div>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Platform + GST</span>
                <div className="text-base font-black text-slate-900 mt-0.5">₹{result.totalPlatformFeePerUnit.toFixed(2)}</div>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Shipping + RTO</span>
                <div className="text-base font-black text-slate-900 mt-0.5">₹{(result.shippingCostPerUnit + result.rtoAllowancePerUnit).toFixed(2)}</div>
              </div>
              <div className="bg-indigo-600 text-white rounded-xl p-3">
                <span className="text-[10px] font-bold text-indigo-200 uppercase">True Cost / Unit</span>
                <div className="text-lg font-black mt-0.5">₹{result.totalCostPerUnit.toFixed(2)}</div>
              </div>
            </div>
          </div>

          {/* Pricing Scenarios */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-xs">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
              <h3 className="text-xl font-black text-slate-900">Recommended Selling Price Scenarios</h3>
            </div>
            <p className="text-xs text-slate-500 mb-6">
              Direct cost per unit is ₹{result.totalDirectCostPerUnit.toFixed(2)}. Compare how different markup and target gross margin targets impact your retail price:
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b border-slate-200 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <th className="pb-3">Pricing Formula</th>
                    <th className="pb-3">Target %</th>
                    <th className="pb-3">Suggested Price</th>
                    <th className="pb-3">Net Profit / Unit</th>
                    <th className="pb-3">Gross Margin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {prices.map((p, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 font-semibold text-slate-800">
                        {p.method === 'markup' ? '📈 Cost Markup' : '🎯 Target Gross Margin'}
                      </td>
                      <td className="py-3 font-bold text-indigo-700">{p.value}%</td>
                      <td className="py-3 text-base font-black text-slate-900">₹{p.suggestedPrice.toFixed(0)}</td>
                      <td className="py-3 font-bold text-emerald-700">₹{p.profitPerUnit.toFixed(2)}</td>
                      <td className="py-3 font-semibold text-slate-600">{p.marginPercent.toFixed(1)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section: Wholesale vs Retail Tier Matrix (B2B vs D2C) */}
          {result && (() => {
            const wholesale = calculateWholesaleTiers(result.totalDirectCostPerUnit, form.sellingPrice, wholesaleMOQ);
            return (
              <div className="bg-white border-2 border-indigo-100 rounded-3xl p-6 md:p-8 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <div className="flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-indigo-600" />
                      <h3 className="text-xl font-black text-slate-900">
                        Wholesale (B2B) vs Retail (D2C) Pricing Matrix
                      </h3>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      The craft pricing benchmark: <strong className="text-slate-700">Cost × 2 = Wholesale</strong> (50% Maker margin) and <strong className="text-slate-700">Wholesale × 2 = MSRP</strong> (50% Retailer margin).
                    </p>
                  </div>

                  {/* MOQ Controller */}
                  <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-200 rounded-xl px-3.5 py-2">
                    <span className="text-xs font-bold text-indigo-900">Minimum Order Qty (MOQ):</span>
                    <input
                      type="number"
                      min={1}
                      value={wholesaleMOQ}
                      onChange={(e) => setWholesaleMOQ(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-16 bg-white border border-indigo-300 rounded-lg px-2 py-1 text-xs font-black text-center text-indigo-700 shadow-xs"
                    />
                    <span className="text-xs font-semibold text-indigo-600">units</span>
                  </div>
                </div>

                {/* Wholesale KPI cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Direct Cost / Unit
                    </span>
                    <span className="text-xl font-black text-slate-900">
                      ₹{wholesale.directCostPerUnit.toFixed(2)}
                    </span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">Base floor to make</span>
                  </div>

                  <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-200">
                    <span className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider block mb-1">
                      Wholesale Price (2×)
                    </span>
                    <span className="text-xl font-black text-indigo-700">
                      ₹{wholesale.wholesalePrice.toFixed(2)}
                    </span>
                    <span className="text-[10px] text-indigo-600 block mt-0.5 font-semibold">
                      +{wholesale.makerMarginPercent.toFixed(1)}% Maker margin
                    </span>
                  </div>

                  <div className="p-4 bg-purple-50 rounded-2xl border border-purple-200">
                    <span className="text-[11px] font-bold text-purple-700 uppercase tracking-wider block mb-1">
                      Retail MSRP (4×)
                    </span>
                    <span className="text-xl font-black text-purple-900">
                      ₹{wholesale.suggestedMSRP.toFixed(2)}
                    </span>
                    <span className="text-[10px] text-purple-600 block mt-0.5 font-semibold">
                      +{wholesale.retailerMarginPercent.toFixed(1)}% Stockist margin
                    </span>
                  </div>

                  <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
                    <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block mb-1">
                      MOQ Gross Profit ({wholesale.suggestedMOQ} units)
                    </span>
                    <span className="text-xl font-black text-emerald-700">
                      ₹{wholesale.moqGrossProfit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                    <span className="text-[10px] text-emerald-600 block mt-0.5 font-semibold">
                      Order Value: ₹{wholesale.moqOrderValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                {/* Wholesale Tiers Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead>
                      <tr className="border-b border-slate-200 text-xs font-bold text-slate-400 uppercase tracking-wider">
                        <th className="pb-3">Channel / Tier</th>
                        <th className="pb-3">Multiplier</th>
                        <th className="pb-3">Unit Price</th>
                        <th className="pb-3">Your Profit / Unit</th>
                        <th className="pb-3">Your Margin %</th>
                        <th className="pb-3">Recommended For</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {wholesale.tiers.map((t, idx) => (
                        <tr key={idx} className="hover:bg-slate-50 transition-colors">
                          <td className="py-3 font-bold text-slate-900">
                            <div>{t.name}</div>
                            <div className="text-[11px] text-slate-400 font-normal">{t.description}</div>
                          </td>
                          <td className="py-3 font-bold text-indigo-600">{t.multiplier}×</td>
                          <td className="py-3 text-base font-black text-slate-900">₹{t.price.toFixed(2)}</td>
                          <td className="py-3 font-bold text-emerald-700">₹{t.profitPerUnit.toFixed(2)}</td>
                          <td className="py-3 font-semibold text-slate-700">{t.marginPercent.toFixed(1)}%</td>
                          <td className="py-3 text-xs text-slate-500">{t.recommendedFor}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })()}

          {/* Section: 1-Click Batch Multiplier & Scaler Tool */}
          {result && (() => {
            const scaled = scaleBatch(form, result, scaleMultiplier);
            return (
              <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 md:p-8 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <div className="flex items-center gap-2">
                      <Scale className="w-5 h-5 text-indigo-600" />
                      <h3 className="text-xl font-black text-slate-900">
                        1-Click Batch Multiplier & Labour Efficiency Scaler
                      </h3>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      See how scaling up production from {form.batchSize} units to {scaled.batchSize} units reduces direct cost per unit via economies of scale.
                    </p>
                  </div>

                  {/* Multiplier Presets */}
                  <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
                    {[1, 2, 5, 10, 25].map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setScaleMultiplier(m)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          scaleMultiplier === m
                            ? 'bg-indigo-600 text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                        }`}
                      >
                        {m}×
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mb-6">
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Scaled Batch</span>
                    <div className="text-base font-black text-slate-900 mt-0.5">{scaled.batchSize} units</div>
                    <span className="text-[10px] text-slate-500">Yield: {scaled.saleableYield} units</span>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Bulk Material Spend</span>
                    <div className="text-base font-black text-slate-900 mt-0.5">₹{scaled.totalMaterialCost.toFixed(0)}</div>
                    <span className="text-[10px] text-slate-500">Linear scaling</span>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Craft Labour</span>
                    <div className="text-base font-black text-slate-900 mt-0.5">{scaled.labourMinutes} mins</div>
                    <span className="text-[10px] text-emerald-600 font-semibold">Prep efficiency curve</span>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Total Run Cost</span>
                    <div className="text-base font-black text-slate-900 mt-0.5">₹{scaled.totalDirectBatchCost.toFixed(0)}</div>
                    <span className="text-[10px] text-slate-500">Direct production</span>
                  </div>

                  <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-3">
                    <span className="text-[10px] font-bold text-indigo-700 uppercase">New Cost / Unit</span>
                    <div className="text-lg font-black text-indigo-700 mt-0.5">₹{scaled.costPerSaleableUnit.toFixed(2)}</div>
                    <span className="text-[10px] text-slate-400 line-through">Base: ₹{result.totalDirectCostPerUnit.toFixed(2)}</span>
                  </div>

                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3">
                    <span className="text-[10px] font-bold text-emerald-800 uppercase">Savings / Unit</span>
                    <div className="text-lg font-black text-emerald-700 mt-0.5">₹{scaled.savingsPerUnit.toFixed(2)}</div>
                    <span className="text-[10px] text-emerald-600 font-bold">-{scaled.savingsPercent.toFixed(1)}% reduction</span>
                  </div>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>
                      At {scaleMultiplier}× batch size, you save <strong className="text-slate-900">₹{(scaled.savingsPerUnit * scaled.saleableYield).toFixed(2)}</strong> across the production run thanks to setup consolidation.
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-indigo-600 hidden sm:inline">
                    Higher Profit Margin Unlocked
                  </span>
                </div>
              </div>
            );
          })()}

          {/* Ready-to-Order Bulk Shopping List */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-indigo-600" />
                  <h3 className="text-xl font-black text-slate-900">Ready-To-Order Shopping List</h3>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Supplier pack sizes rounded upward, incorporating your {form.failedUnits > 0 ? (((form.failedUnits) / form.batchSize) * 100).toFixed(0) : 0}% scrap rate allowance.
                </p>
              </div>

              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
                <span className="text-xs font-bold text-slate-600">Target Production:</span>
                <input
                  type="number"
                  value={targetUnits}
                  onChange={(e) => setTargetUnits(parseInt(e.target.value) || 1)}
                  className="w-16 bg-white border border-slate-300 rounded-lg px-2 py-1 text-xs font-bold text-center text-indigo-700"
                />
                <span className="text-xs font-medium text-slate-500">saleable units</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b border-slate-200 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <th className="pb-3">Material</th>
                    <th className="pb-3">Exact Quantity</th>
                    <th className="pb-3">Supplier Packs to Order</th>
                    <th className="pb-3 text-right">Estimated Cash Outflow</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {shoppingList.map((item, i) => (
                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 font-semibold text-slate-800">{item.name}</td>
                      <td className="py-3 text-slate-600 font-medium">
                        {item.qtyNeeded} {item.packUnit}
                      </td>
                      <td className="py-3">
                        <span className="bg-indigo-50 text-indigo-700 text-xs font-bold px-2.5 py-1 rounded-md border border-indigo-200">
                          {item.packsNeeded} pack{item.packsNeeded > 1 ? 's' : ''} (₹{item.packPrice}/pack)
                        </span>
                      </td>
                      <td className="py-3 text-right font-bold text-slate-900">₹{item.estimatedCost.toFixed(2)}</td>
                    </tr>
                  ))}
                  <tr className="border-t-2 border-slate-200 bg-slate-50 font-black">
                    <td colSpan={3} className="py-3.5 px-3 text-slate-900">Total Upfront Material Investment Required</td>
                    <td className="py-3.5 px-3 text-right text-indigo-700 text-base">
                      ₹{shoppingList.reduce((acc, it) => acc + it.estimatedCost, 0).toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Indian GST & HSN Reference Directory Modal */}
      {isHSNModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in duration-150">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-lg">Indian Craft GST & HSN Directory</h3>
                  <p className="text-xs text-slate-500">Official classification rates and Input Tax Credit (ITC) rules for makers</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsHSNModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search Input */}
            <div className="p-4 border-b border-slate-100 bg-white">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Search HSN code, product category (e.g. candle, soap, resin, bakery, apparel)..."
                  value={hsnSearch}
                  onChange={(e) => setHsnSearch(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Modal Body List */}
            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              {HSN_DIRECTORY.filter((item) => {
                const q = hsnSearch.toLowerCase();
                return (
                  item.hsnCode.toLowerCase().includes(q) ||
                  item.productCategory.toLowerCase().includes(q) ||
                  item.applicableItems.some((it) => it.toLowerCase().includes(q))
                );
              }).map((item) => (
                <div
                  key={item.hsnCode}
                  className="border border-slate-200 rounded-2xl p-5 hover:border-indigo-300 hover:bg-indigo-50/20 transition-all space-y-2.5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs bg-slate-100 text-slate-800 px-2.5 py-1 rounded-lg border border-slate-200">
                        HSN {item.hsnCode}
                      </span>
                      <h4 className="font-bold text-slate-900 text-sm">{item.productCategory}</h4>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-black text-xs px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800">
                        {item.gstRatePercent}% GST
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = {
                            ...form,
                            hsnCode: item.hsnCode.split('/')[0].trim(),
                            outputGSTRatePercent: item.gstRatePercent,
                          };
                          setForm(updated);
                          recalc(updated, materials);
                          setIsHSNModalOpen(false);
                        }}
                        className="text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded-lg transition-colors cursor-pointer"
                      >
                        Apply to Form
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {item.applicableItems.map((sub, i) => (
                      <span key={i} className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                        {sub}
                      </span>
                    ))}
                  </div>

                  <div className="text-xs space-y-1 text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <p><strong className="text-slate-800">ITC Rule:</strong> {item.itcEligibility}</p>
                    <p className="text-slate-500 text-[11px]"><strong className="text-slate-700">2025 Notes:</strong> {item.notes2025}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
              <span>⚠️ For formal GST filing and tax advice, always consult your Chartered Accountant (CA).</span>
              <button
                type="button"
                onClick={() => setIsHSNModalOpen(false)}
                className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl font-bold text-slate-700 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
