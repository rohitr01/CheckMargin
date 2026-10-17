'use client';

import { useState } from 'react';
import {
  calculateBatchCost,
  suggestPrices,
  generateShoppingList,
  BatchInput,
  CalculationResult,
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
} from 'lucide-react';

const EMPTY_MATERIAL = { name: '', packPrice: 0, packSize: 1, packUnit: 'g', qtyUsed: 0 };

const SAMPLE_TEMPLATES: Record<string, { form: any; materials: any[] }> = {
  candle: {
    form: {
      productName: '200g Soy Fragrance Jar Candle',
      batchSize: 10,
      failedUnits: 1,
      labourMinutes: 90,
      labourHourlyRate: 150,
      packagingPerUnit: 25,
      shippingPerOrder: 65,
      overheadPerBatch: 60,
      sellingPrice: 599,
      platformFeePercent: 12,
      platformFeeFixed: 15,
      isGSTRegistered: false,
      gstRatePercent: 18,
      isPriceGSTInclusive: true,
      targetUnits: 30,
    },
    materials: [
      { name: 'Pure Soy Wax (Flakes)', packPrice: 850, packSize: 1000, packUnit: 'g', qtyUsed: 1800 },
      { name: 'French Vanilla Fragrance Oil', packPrice: 1400, packSize: 100, packUnit: 'ml', qtyUsed: 120 },
      { name: 'Braided Cotton Wicks + Tabs', packPrice: 150, packSize: 50, packUnit: 'piece', qtyUsed: 10 },
      { name: 'Frosted Glass Amber Jars (250ml)', packPrice: 700, packSize: 20, packUnit: 'piece', qtyUsed: 10 },
      { name: 'Metallic Foiled Brand Label', packPrice: 200, packSize: 50, packUnit: 'piece', qtyUsed: 10 },
    ],
  },
  soap: {
    form: {
      productName: 'Cold Process Goat Milk & Honey Bar (100g)',
      batchSize: 12,
      failedUnits: 1,
      labourMinutes: 75,
      labourHourlyRate: 180,
      packagingPerUnit: 18,
      shippingPerOrder: 50,
      overheadPerBatch: 40,
      sellingPrice: 280,
      platformFeePercent: 10,
      platformFeeFixed: 10,
      isGSTRegistered: false,
      gstRatePercent: 18,
      isPriceGSTInclusive: true,
      targetUnits: 50,
    },
    materials: [
      { name: 'Cold Pressed Virgin Coconut Oil', packPrice: 420, packSize: 1000, packUnit: 'ml', qtyUsed: 350 },
      { name: 'Extra Virgin Olive Oil', packPrice: 900, packSize: 1000, packUnit: 'ml', qtyUsed: 400 },
      { name: 'Sodium Hydroxide (Lye)', packPrice: 180, packSize: 500, packUnit: 'g', qtyUsed: 110 },
      { name: 'Organic Raw Forest Honey', packPrice: 350, packSize: 250, packUnit: 'g', qtyUsed: 50 },
      { name: 'Lavender Essential Oil', packPrice: 850, packSize: 50, packUnit: 'ml', qtyUsed: 30 },
      { name: 'Kraft Window Soap Box', packPrice: 240, packSize: 20, packUnit: 'piece', qtyUsed: 12 },
    ],
  },
  bakery: {
    form: {
      productName: 'Artisan Sourdough Chocolate Babka Loaf',
      batchSize: 6,
      failedUnits: 0,
      labourMinutes: 120,
      labourHourlyRate: 200,
      packagingPerUnit: 35,
      shippingPerOrder: 0,
      overheadPerBatch: 120,
      sellingPrice: 480,
      platformFeePercent: 8,
      platformFeeFixed: 0,
      isGSTRegistered: false,
      gstRatePercent: 5,
      isPriceGSTInclusive: true,
      targetUnits: 24,
    },
    materials: [
      { name: 'Imported Bread Flour (T55)', packPrice: 550, packSize: 5000, packUnit: 'g', qtyUsed: 1200 },
      { name: 'French Cultured Butter (82%)', packPrice: 650, packSize: 1000, packUnit: 'g', qtyUsed: 300 },
      { name: 'Callebaut Dark Chocolate (54%)', packPrice: 1800, packSize: 1000, packUnit: 'g', qtyUsed: 450 },
      { name: 'Organic Brown Sugar', packPrice: 160, packSize: 1000, packUnit: 'g', qtyUsed: 200 },
      { name: 'Custom Loaf Liner & Presentation Box', packPrice: 350, packSize: 10, packUnit: 'piece', qtyUsed: 6 },
    ],
  },
};

export default function CalculatorPage() {
  const [materials, setMaterials] = useState(SAMPLE_TEMPLATES.candle.materials);
  const [form, setForm] = useState(SAMPLE_TEMPLATES.candle.form);
  const [result, setResult] = useState<CalculationResult | null>(() => {
    return calculateBatchCost({ ...SAMPLE_TEMPLATES.candle.form, materials: SAMPLE_TEMPLATES.candle.materials });
  });
  const [error, setError] = useState('');

  function loadTemplate(key: string) {
    const t = SAMPLE_TEMPLATES[key];
    if (t) {
      setForm(t.form);
      setMaterials(t.materials);
      setResult(calculateBatchCost({ ...t.form, materials: t.materials }));
      setError('');
    }
  }

  function updateMaterial(i: number, field: string, value: string | number) {
    setMaterials((prev) =>
      prev.map((m, idx) => (idx === i ? { ...m, [field]: value } : m))
    );
  }

  function addMaterial() {
    setMaterials((prev) => [...prev, { ...EMPTY_MATERIAL }]);
  }

  function removeMaterial(i: number) {
    setMaterials((prev) => prev.filter((_, idx) => idx !== i));
  }

  function handleCalculate() {
    setError('');
    if (!form.productName.trim()) {
      setError('Please provide a product title.');
      return;
    }
    if (form.batchSize <= 0) {
      setError('Batch size must be at least 1.');
      return;
    }
    if (form.failedUnits >= form.batchSize) {
      setError('Failed units cannot equal or exceed total batch size.');
      return;
    }
    if (materials.some((m) => !m.name.trim() || m.packPrice <= 0 || m.packSize <= 0)) {
      setError('Every material requires a name, pack purchase price > 0, and pack size > 0.');
      return;
    }

    const input: BatchInput = { ...form, materials };
    setResult(calculateBatchCost(input));
  }

  const prices = result ? suggestPrices(result.totalDirectCostPerUnit) : [];
  const shoppingList = result
    ? generateShoppingList(materials, form.targetUnits, result.saleableYield, form.batchSize)
    : [];

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      {/* Page Title & Preset Loader */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full mb-2">
              <Calculator className="w-3.5 h-3.5" />
              <span>Deterministic Batch Costing</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Batch Cost & Margin Calculator
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Real-time unit economics for small-batch products. Omit nothing.
            </p>
          </div>

          {/* Quick Preset Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">Load Demo:</span>
            <button
              onClick={() => loadTemplate('candle')}
              className="text-xs font-semibold bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 px-3 py-1.5 rounded-lg border border-slate-200 transition-colors"
            >
              🕯️ Candle
            </button>
            <button
              onClick={() => loadTemplate('soap')}
              className="text-xs font-semibold bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 px-3 py-1.5 rounded-lg border border-slate-200 transition-colors"
            >
              🧼 Soap
            </button>
            <button
              onClick={() => loadTemplate('bakery')}
              className="text-xs font-semibold bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 px-3 py-1.5 rounded-lg border border-slate-200 transition-colors"
            >
              🧁 Bakery
            </button>
          </div>
        </div>
      </div>

      {/* Real-time KPI Summary Bar (Always Visible at Top when result exists) */}
      {result && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Unit Cost */}
          <div className="bg-white border-2 border-slate-200 rounded-2xl p-5 shadow-xs">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
              True Cost / Unit
            </span>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">
              ₹{result.totalCostPerUnit.toFixed(2)}
            </div>
            <span className="text-[11px] font-semibold text-slate-400 mt-1 block">
              Direct: ₹{result.totalDirectCostPerUnit.toFixed(2)} + Fees: ₹{(result.platformFeeAmount + result.shippingCostPerUnit).toFixed(2)}
            </span>
          </div>

          {/* Selling Price */}
          <div className="bg-white border-2 border-slate-200 rounded-2xl p-5 shadow-xs">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Selling Price
            </span>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">
              ₹{form.sellingPrice}
            </div>
            <span className="text-[11px] font-semibold text-indigo-600 mt-1 block">
              {form.isPriceGSTInclusive ? 'GST Inclusive' : 'GST Exclusive'}
            </span>
          </div>

          {/* Net Profit */}
          <div className={`border-2 rounded-2xl p-5 shadow-xs ${result.grossProfitPerUnit >= 0 ? 'bg-emerald-50/60 border-emerald-300' : 'bg-rose-50/60 border-rose-300'}`}>
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1">
              Net Profit / Unit
            </span>
            <div className={`text-2xl sm:text-3xl font-black ${result.grossProfitPerUnit >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
              ₹{result.grossProfitPerUnit.toFixed(2)}
            </div>
            <span className={`text-[11px] font-bold mt-1 block ${result.grossProfitPerUnit >= 0 ? 'text-emerald-800' : 'text-rose-800'}`}>
              {result.grossProfitPerUnit >= 0 ? 'Profitable' : 'Loss-Making'}
            </span>
          </div>

          {/* Net Margin */}
          <div className={`border-2 rounded-2xl p-5 shadow-xs ${result.grossMarginPercent >= 25 ? 'bg-indigo-50/70 border-indigo-300' : 'bg-amber-50/70 border-amber-300'}`}>
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1">
              Net Margin
            </span>
            <div className={`text-2xl sm:text-3xl font-black ${result.grossMarginPercent >= 25 ? 'text-indigo-800' : 'text-amber-800'}`}>
              {result.grossMarginPercent.toFixed(1)}%
            </div>
            <span className="text-[11px] font-semibold text-slate-500 mt-1 block">
              Markup: {result.markupPercent.toFixed(0)}% on cost
            </span>
          </div>
        </div>
      )}

      {/* Main Form Sections */}
      <div className="space-y-6">
        {/* Step 1: Product Name */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">1</span>
            <h2 className="font-bold text-slate-900 text-lg">Product Identity</h2>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Product Title or Recipe Name
            </label>
            <input
              type="text"
              value={form.productName}
              onChange={(e) => setForm((f: any) => ({ ...f, productName: e.target.value }))}
              placeholder="e.g. 200g Lavender Soy Jar Candle"
              className="w-full bg-white border border-slate-300 text-slate-900 rounded-xl px-4 py-3 text-base font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-xs"
            />
          </div>
        </div>

        {/* Step 2: Recipe & Materials Table */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">2</span>
              <h2 className="font-bold text-slate-900 text-lg">Recipe Ingredients & Materials</h2>
            </div>
            <button
              onClick={addMaterial}
              className="inline-flex items-center gap-1.5 text-xs font-bold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-lg border border-indigo-200 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Material Row</span>
            </button>
          </div>

          <p className="text-xs text-slate-500 mb-6">
            Enter wholesale pack purchase price and size. MakerMargin calculates the exact fraction consumed per batch.
          </p>

          <div className="overflow-x-auto -mx-6 md:mx-0 px-6 md:px-0">
            <div className="min-w-[680px] space-y-3">
              <div className="grid grid-cols-12 gap-3 text-xs font-bold text-slate-400 uppercase tracking-wider px-2">
                <div className="col-span-4">Material / Ingredient</div>
                <div className="col-span-2">Pack Price (₹)</div>
                <div className="col-span-2">Pack Size</div>
                <div className="col-span-2">Unit</div>
                <div className="col-span-2">Used / Batch</div>
              </div>

              {materials.map((m, i) => {
                const rowCost = m.packSize > 0 ? (m.packPrice / m.packSize) * m.qtyUsed : 0;
                return (
                  <div
                    key={i}
                    className="grid grid-cols-12 gap-3 items-center bg-slate-50 border border-slate-200 rounded-xl p-3 hover:border-slate-300 transition-all"
                  >
                    <div className="col-span-4">
                      <input
                        type="text"
                        placeholder="e.g. Soy Wax"
                        value={m.name}
                        onChange={(e) => updateMaterial(i, 'name', e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm font-medium text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>
                    <div className="col-span-2">
                      <input
                        type="number"
                        placeholder="800"
                        value={m.packPrice || ''}
                        onChange={(e) => updateMaterial(i, 'packPrice', parseFloat(e.target.value) || 0)}
                        className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>
                    <div className="col-span-2">
                      <input
                        type="number"
                        placeholder="1000"
                        value={m.packSize || ''}
                        onChange={(e) => updateMaterial(i, 'packSize', parseFloat(e.target.value) || 1)}
                        className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>
                    <div className="col-span-2">
                      <select
                        value={m.packUnit}
                        onChange={(e) => updateMaterial(i, 'packUnit', e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-2 text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      >
                        <option value="g">Grams (g)</option>
                        <option value="kg">Kilograms (kg)</option>
                        <option value="ml">Millilitres (ml)</option>
                        <option value="L">Litres (L)</option>
                        <option value="piece">Pieces (pcs)</option>
                        <option value="metre">Metres (m)</option>
                        <option value="pack">Pack / Box</option>
                      </select>
                    </div>
                    <div className="col-span-2 flex items-center gap-2">
                      <input
                        type="number"
                        placeholder="150"
                        value={m.qtyUsed || ''}
                        onChange={(e) => updateMaterial(i, 'qtyUsed', parseFloat(e.target.value) || 0)}
                        className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm font-bold text-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                      {materials.length > 1 && (
                        <button
                          onClick={() => removeMaterial(i)}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Remove material"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>{materials.length} material lines configured</span>
            <span>Subtotal Material Batch Cost: <strong className="text-slate-900 font-bold">₹{materials.reduce((acc, m) => acc + (m.packSize > 0 ? (m.packPrice / m.packSize) * m.qtyUsed : 0), 0).toFixed(2)}</strong></span>
          </div>
        </div>

        {/* Step 3: Production Batch & Real Yield */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">3</span>
            <h2 className="font-bold text-slate-900 text-lg">Batch Production & Saleable Yield</h2>
          </div>
          <p className="text-xs text-slate-500 mb-6">
            If you produce 10 candles and 1 has frosting defects or crack, only 9 can be sold. All 10 must be paid for by those 9.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Batch Size (Units Made)
              </label>
              <input
                type="number"
                value={form.batchSize || ''}
                onChange={(e) => setForm((f: any) => ({ ...f, batchSize: parseFloat(e.target.value) || 0 }))}
                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 font-bold text-slate-900 text-base focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Defective / Failed Units
              </label>
              <input
                type="number"
                value={form.failedUnits}
                onChange={(e) => setForm((f: any) => ({ ...f, failedUnits: parseFloat(e.target.value) || 0 }))}
                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 font-bold text-rose-700 text-base focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex flex-col justify-center">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Saleable Yield</span>
              <span className="text-2xl font-black text-indigo-700">
                {Math.max(form.batchSize - form.failedUnits, 0)} units
              </span>
              <span className="text-[11px] font-semibold text-slate-400">
                Yield Efficiency: {form.batchSize > 0 ? (((form.batchSize - form.failedUnits) / form.batchSize) * 100).toFixed(0) : 0}%
              </span>
            </div>
          </div>
        </div>

        {/* Step 4: Direct Labour, Packaging & Overhead */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">4</span>
            <h2 className="font-bold text-slate-900 text-lg">Labour, Packaging & Overhead Allocation</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Batch Labour (Minutes)
              </label>
              <input
                type="number"
                value={form.labourMinutes || ''}
                onChange={(e) => setForm((f: any) => ({ ...f, labourMinutes: parseFloat(e.target.value) || 0 }))}
                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 font-bold text-slate-900 text-base focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">Prep, pouring, cleanup</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Labour Rate (₹ / Hour)
              </label>
              <input
                type="number"
                value={form.labourHourlyRate || ''}
                onChange={(e) => setForm((f: any) => ({ ...f, labourHourlyRate: parseFloat(e.target.value) || 0 }))}
                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 font-bold text-slate-900 text-base focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">Your time has monetary value</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Packaging / Unit (₹)
              </label>
              <input
                type="number"
                value={form.packagingPerUnit || ''}
                onChange={(e) => setForm((f: any) => ({ ...f, packagingPerUnit: parseFloat(e.target.value) || 0 }))}
                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 font-bold text-slate-900 text-base focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">Box, bubble wrap, thank you card</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Overhead / Batch (₹)
              </label>
              <input
                type="number"
                value={form.overheadPerBatch || ''}
                onChange={(e) => setForm((f: any) => ({ ...f, overheadPerBatch: parseFloat(e.target.value) || 0 }))}
                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 font-bold text-slate-900 text-base focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">Electricity, tool depreciation</span>
            </div>
          </div>
        </div>

        {/* Step 5: Selling Channels, Shipping & Fees */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">5</span>
            <h2 className="font-bold text-slate-900 text-lg">Target Price, Sales Channels & Taxes</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Target Selling Price (₹)
              </label>
              <input
                type="number"
                value={form.sellingPrice || ''}
                onChange={(e) => setForm((f: any) => ({ ...f, sellingPrice: parseFloat(e.target.value) || 0 }))}
                className="w-full bg-white border-2 border-indigo-400 rounded-xl px-4 py-2.5 font-black text-indigo-950 text-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">Price shown to customer</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Platform Fee (%)
              </label>
              <input
                type="number"
                value={form.platformFeePercent}
                onChange={(e) => setForm((f: any) => ({ ...f, platformFeePercent: parseFloat(e.target.value) || 0 }))}
                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 font-bold text-slate-900 text-base focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">e.g. Amazon ~12%, Etsy ~6.5%</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Fixed Order Fee (₹)
              </label>
              <input
                type="number"
                value={form.platformFeeFixed}
                onChange={(e) => setForm((f: any) => ({ ...f, platformFeeFixed: parseFloat(e.target.value) || 0 }))}
                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 font-bold text-slate-900 text-base focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">Gateway or closing fee</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Seller-Paid Shipping (₹)
              </label>
              <input
                type="number"
                value={form.shippingPerOrder}
                onChange={(e) => setForm((f: any) => ({ ...f, shippingPerOrder: parseFloat(e.target.value) || 0 }))}
                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 font-bold text-slate-900 text-base focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">₹0 if buyer pays shipping</span>
            </div>
          </div>

          {/* GST Toggle Option */}
          <div className="mt-6 pt-5 border-t border-slate-100 flex flex-wrap items-center gap-4 bg-slate-50 p-4 rounded-2xl">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isGSTRegistered}
                onChange={(e) => setForm((f: any) => ({ ...f, isGSTRegistered: e.target.checked }))}
                className="w-4 h-4 text-indigo-600 rounded"
              />
              <span className="text-sm font-bold text-slate-800">I am GST Registered</span>
            </label>

            {form.isGSTRegistered && (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    value={form.gstRatePercent}
                    onChange={(e) => setForm((f: any) => ({ ...f, gstRatePercent: parseFloat(e.target.value) || 0 }))}
                    className="w-16 bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-sm font-bold text-slate-900"
                  />
                  <span className="text-xs font-bold text-slate-600">% GST Rate</span>
                </div>
                <label className="flex items-center gap-1.5 cursor-pointer text-xs font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={form.isPriceGSTInclusive}
                    onChange={(e) => setForm((f: any) => ({ ...f, isPriceGSTInclusive: e.target.checked }))}
                    className="w-3.5 h-3.5 text-indigo-600 rounded"
                  />
                  <span>Selling price is GST-inclusive</span>
                </label>
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="bg-rose-50 border-2 border-rose-200 text-rose-800 text-sm font-semibold rounded-2xl p-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Big Calculate Button */}
        <button
          onClick={handleCalculate}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black text-lg py-4 px-8 rounded-2xl shadow-lg shadow-indigo-500/25 active:scale-99 transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <Calculator className="w-5 h-5" />
          <span>Update All Calculations & Projections</span>
        </button>
      </div>

      {/* Results Section */}
      {result && (
        <div className="space-y-8 pt-4">
          {/* Detailed Breakdown Card */}
          <div className="bg-white border-2 border-indigo-200 rounded-3xl p-6 md:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-black text-slate-900">
                  Cost Breakdown per Saleable Unit — {form.productName}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Based on a batch of {form.batchSize} units ({result.saleableYield} saleable yield).
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Material Cost</span>
                <div className="text-lg font-bold text-slate-900 mt-1">₹{result.materialCostPerUnit.toFixed(2)}</div>
                <span className="text-[10px] text-slate-400">Total batch: ₹{result.totalMaterialCost.toFixed(0)}</span>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Labour Cost</span>
                <div className="text-lg font-bold text-slate-900 mt-1">₹{result.labourCostPerUnit.toFixed(2)}</div>
                <span className="text-[10px] text-slate-400">Total batch: ₹{result.labourCostPerBatch.toFixed(0)}</span>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Packaging Cost</span>
                <div className="text-lg font-bold text-slate-900 mt-1">₹{form.packagingPerUnit.toFixed(2)}</div>
                <span className="text-[10px] text-slate-400">Boxes, labels, cards</span>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Batch Overhead</span>
                <div className="text-lg font-bold text-slate-900 mt-1">₹{result.overheadPerUnit.toFixed(2)}</div>
                <span className="text-[10px] text-slate-400">Power, rent, tools</span>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Platform & Pay Fee</span>
                <div className="text-lg font-bold text-slate-900 mt-1">₹{result.platformFeeAmount.toFixed(2)}</div>
                <span className="text-[10px] text-slate-400">{form.platformFeePercent}% + ₹{form.platformFeeFixed}</span>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Shipping Paid</span>
                <div className="text-lg font-bold text-slate-900 mt-1">₹{result.shippingCostPerUnit.toFixed(2)}</div>
                <span className="text-[10px] text-slate-400">Seller absorption</span>
              </div>

              <div className="bg-indigo-600 text-white rounded-xl p-4 col-span-2 sm:col-span-1 md:col-span-2">
                <span className="text-[11px] font-bold text-indigo-200 uppercase">True Total Cost / Unit</span>
                <div className="text-2xl font-black mt-1">₹{result.totalCostPerUnit.toFixed(2)}</div>
                <span className="text-[10px] text-indigo-200 font-medium">All material, labour, packaging & fees included</span>
              </div>
            </div>

            {/* Line-by-line Materials Breakdown */}
            <div className="border-t border-slate-100 pt-6">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                Materials Fraction Breakdown
              </h4>
              <div className="space-y-2">
                {result.materialBreakdown.map((m) => (
                  <div key={m.name} className="flex items-center justify-between text-xs py-1.5 px-3 bg-slate-50 rounded-lg">
                    <span className="font-medium text-slate-700">{m.name}</span>
                    <span className="font-bold text-slate-900">₹{m.cost.toFixed(2)} per batch (₹{(m.cost / result.saleableYield).toFixed(2)}/unit)</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Suggested Price Scenarios Table */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-xs">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
              <h3 className="text-xl font-black text-slate-900">Suggested Retail Pricing Scenarios</h3>
            </div>
            <p className="text-xs text-slate-500 mb-6">
              Markup is added on cost. Target Margin represents your share of the final customer price.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b border-slate-200 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <th className="pb-3">Strategy</th>
                    <th className="pb-3">Multiplier</th>
                    <th className="pb-3">Suggested Price</th>
                    <th className="pb-3">Net Profit / Unit</th>
                    <th className="pb-3">Gross Margin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {prices.map((p, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 font-semibold text-slate-800">
                        {p.method === 'markup' ? '📈 Standard Markup' : '🎯 Target Gross Margin'}
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

          {/* Scaled Material Shopping List */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-indigo-600" />
                  <h3 className="text-xl font-black text-slate-900">Ready-To-Order Shopping List</h3>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Automatically rounded up to whole supplier pack sizes, including your historical waste factor.
                </p>
              </div>

              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
                <span className="text-xs font-bold text-slate-600">Target Production:</span>
                <input
                  type="number"
                  value={form.targetUnits}
                  onChange={(e) => setForm((f: any) => ({ ...f, targetUnits: parseInt(e.target.value) || 1 }))}
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
                          {item.packsNeeded} pack{item.packsNeeded > 1 ? 's' : ''}
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
    </div>
  );
}
