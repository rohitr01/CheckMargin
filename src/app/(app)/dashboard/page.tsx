import Link from 'next/link';
import {
  Calculator,
  PlusCircle,
  Package,
  Sparkles,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Layers,
} from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-violet-700 rounded-3xl p-8 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Batch Costing Workspace</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight mb-2">Welcome to CheckMargin Studio</h1>
          <p className="text-indigo-100 text-sm leading-relaxed mb-6">
            Calculate your true cost per unit, eliminate pricing guesswork, and generate scaled shopping lists for your upcoming production runs.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/calculator"
              className="inline-flex items-center gap-2 bg-white text-indigo-700 font-bold text-sm px-5 py-2.5 rounded-xl shadow-xs hover:bg-slate-50 transition-colors"
            >
              <Calculator className="w-4 h-4" />
              <span>Launch Calculator</span>
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-indigo-800/60 hover:bg-indigo-800 text-white font-semibold text-sm px-4 py-2.5 rounded-xl border border-indigo-400/40 transition-colors"
            >
              <span>View Product Catalog</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Launch Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Link
          href="/calculator"
          className="bg-white border-2 border-slate-200 hover:border-indigo-500 rounded-2xl p-6 shadow-xs hover:shadow-md transition-all group"
        >
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
            <Calculator className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900 text-base mb-1">New Batch Calculation</h3>
          <p className="text-xs text-slate-500 mb-4 leading-relaxed">
            Input wholesale pack sizes, production recipe, failed units, and get instant unit economics.
          </p>
          <span className="text-xs font-bold text-indigo-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            <span>Open Tool</span>
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

        <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 shadow-xs">
          <div className="w-12 h-12 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center mb-4">
            <TrendingUp className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900 text-base mb-1">Batch Yield Tracking</h3>
          <p className="text-xs text-slate-500 mb-4 leading-relaxed">
            Always remember: failed batches or scrap must be absorbed by saleable units only.
          </p>
          <span className="text-xs font-bold text-violet-600">
            Active Protection Engine
          </span>
        </div>
      </div>

      {/* Suggested Demo Presets */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-xs">
        <h2 className="font-bold text-slate-900 text-lg mb-2">Instant Pre-Loaded Demo Templates</h2>
        <p className="text-xs text-slate-500 mb-6">
          Click any template below to explore a real-world product costing breakdown:
        </p>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          <Link
            href="/calculator"
            className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-300 transition-all cursor-pointer"
          >
            <span className="text-2xl">🕯️</span>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Soy Jar Candle (200g)</h4>
              <p className="text-[11px] text-slate-500">Wax, fragrance, jar, wick, label • HSN 3406</p>
            </div>
          </Link>
          <Link
            href="/calculator"
            className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-300 transition-all cursor-pointer"
          >
            <span className="text-2xl">🧼</span>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Cold Process Soap Bar</h4>
              <p className="text-[11px] text-slate-500">Coconut, olive, lye, honey • HSN 3401</p>
            </div>
          </Link>
          <Link
            href="/calculator"
            className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-300 transition-all cursor-pointer"
          >
            <span className="text-2xl">🧁</span>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Belgian Chocolate Brownies</h4>
              <p className="text-[11px] text-slate-500">Couverture, butter, cocoa, walnuts • HSN 1905</p>
            </div>
          </Link>
          <Link
            href="/calculator"
            className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-300 transition-all cursor-pointer"
          >
            <span className="text-2xl">🧴</span>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Vitamin C Serum (30ml)</h4>
              <p className="text-[11px] text-slate-500">Hyaluronic, ferulic, amber dropper • HSN 3304</p>
            </div>
          </Link>
          <Link
            href="/calculator"
            className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-300 transition-all cursor-pointer"
          >
            <span className="text-2xl">🎨</span>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Epoxy Resin Coaster 4-Pack</h4>
              <p className="text-[11px] text-slate-500">Resin, hardener, pigments, gold leaf • HSN 3926</p>
            </div>
          </Link>
          <Link
            href="/calculator"
            className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-300 transition-all cursor-pointer"
          >
            <span className="text-2xl">💍</span>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Polymer Clay Earrings</h4>
              <p className="text-[11px] text-slate-500">Clay, 18K gold studs, UV glaze • HSN 7117</p>
            </div>
          </Link>
          <Link
            href="/calculator"
            className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-300 transition-all cursor-pointer"
          >
            <span className="text-2xl">🧵</span>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Block-Print Cotton Tote</h4>
              <p className="text-[11px] text-slate-500">Heavy canvas, natural indigo, straps • HSN 6204</p>
            </div>
          </Link>
          <Link
            href="/calculator"
            className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-300 transition-all cursor-pointer"
          >
            <span className="text-2xl">🍫</span>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Peri Peri Makhana (100g)</h4>
              <p className="text-[11px] text-slate-500">Jumbo foxnuts, spices, nitrogen pouch • HSN 1904</p>
            </div>
          </Link>
          <Link
            href="/calculator"
            className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-300 transition-all cursor-pointer"
          >
            <span className="text-2xl">💻</span>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Notion OS & Digital Assets</h4>
              <p className="text-[11px] text-slate-500">Zero freight, zero packaging, 18% GST • SAC 9984</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
