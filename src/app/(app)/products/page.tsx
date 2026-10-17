import Link from 'next/link';
import { Package, PlusCircle, ArrowRight, Sparkles, Calculator } from 'lucide-react';

export default function ProductsPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-xs">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Saved Product Library</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage your formulas, track supplier cost shifts, and reuse past batch parameters.
          </p>
        </div>
        <Link
          href="/calculator"
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-xs transition-colors shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Product Costing</span>
        </Link>
      </div>

      {/* Preset demo items in library */}
      <div className="grid md:grid-cols-3 gap-5">
        {[
          {
            title: 'Soy Fragrance Candle 200g',
            category: 'Candles',
            unitCost: '₹232.44',
            sellingPrice: '₹599.00',
            margin: '61.2%',
            saleableYield: '9 / 10',
            date: 'Updated today',
          },
          {
            title: 'Cold Process Honey & Oat Bar',
            category: 'Soaps',
            unitCost: '₹108.50',
            sellingPrice: '₹280.00',
            margin: '61.3%',
            saleableYield: '11 / 12',
            date: 'Updated yesterday',
          },
          {
            title: 'Babka Chocolate Artisan Loaf',
            category: 'Bakery',
            unitCost: '₹210.80',
            sellingPrice: '₹480.00',
            margin: '56.1%',
            saleableYield: '6 / 6',
            date: 'Saved 3 days ago',
          },
        ].map((item) => (
          <div
            key={item.title}
            className="bg-white border-2 border-slate-200 hover:border-indigo-400 rounded-2xl p-6 shadow-xs transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-200">
                  {item.category}
                </span>
                <span className="text-slate-400 font-medium">{item.date}</span>
              </div>
              <h3 className="font-black text-slate-900 text-base mb-4 mt-2">{item.title}</h3>

              <div className="space-y-2 text-xs border-t border-slate-100 pt-3 text-slate-600">
                <div className="flex justify-between">
                  <span>Unit True Cost:</span>
                  <strong className="text-slate-900 font-bold">{item.unitCost}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Selling Price:</span>
                  <strong className="text-slate-900 font-bold">{item.sellingPrice}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Gross Margin:</span>
                  <strong className="text-emerald-700 font-bold">{item.margin}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Yield Efficiency:</span>
                  <span className="font-semibold text-slate-700">{item.saleableYield} units</span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-4 border-t border-slate-100">
              <Link
                href="/calculator"
                className="w-full inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 font-bold text-xs py-2.5 px-4 rounded-xl border border-slate-200 transition-colors"
              >
                <Calculator className="w-3.5 h-3.5" />
                <span>Re-Calculate in Studio</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
