'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Package, PlusCircle, Calculator, Trash2, Search, Sparkles, Filter } from 'lucide-react';

interface SavedProduct {
  id: string;
  title: string;
  category: string;
  unitCost: string;
  sellingPrice: string;
  margin: string;
  saleableYield: string;
  date: string;
  industryGroup?: string;
}

const DEFAULT_PRESETS: SavedProduct[] = [
  {
    id: 'demo-1',
    title: 'Handcrafted 200g Vanilla Soy Candle',
    category: 'HSN 3406 (5% GST)',
    unitCost: '₹264.40',
    sellingPrice: '₹599.00',
    margin: '53.7%',
    saleableYield: '9 / 10',
    date: 'Preset Demo',
    industryGroup: 'Candles',
  },
  {
    id: 'demo-2',
    title: 'Cold Process Honey & Goat Milk Bar',
    category: 'HSN 3401 (5% GST)',
    unitCost: '₹124.50',
    sellingPrice: '₹280.00',
    margin: '53.3%',
    saleableYield: '11 / 12',
    date: 'Preset Demo',
    industryGroup: 'Soaps',
  },
  {
    id: 'demo-3',
    title: 'Artisan Belgian Chocolate Brownie Batch',
    category: 'HSN 1905 (5% GST)',
    unitCost: '₹68.20',
    sellingPrice: '₹160.00',
    margin: '54.8%',
    saleableYield: '15 / 16',
    date: 'Preset Demo',
    industryGroup: 'Bakery',
  },
  {
    id: 'demo-4',
    title: 'Vitamin C Brightening Face Serum (30ml)',
    category: 'HSN 3304 (18% GST)',
    unitCost: '₹285.60',
    sellingPrice: '₹699.00',
    margin: '51.8%',
    saleableYield: '10 / 10',
    date: 'Preset Demo',
    industryGroup: 'Cosmetics',
  },
  {
    id: 'demo-5',
    title: 'Ocean Wave Epoxy Resin Coasters (Set of 4)',
    category: 'HSN 3926 (18% GST)',
    unitCost: '₹415.20',
    sellingPrice: '₹999.00',
    margin: '50.9%',
    saleableYield: '4 / 4',
    date: 'Preset Demo',
    industryGroup: 'Resin',
  },
  {
    id: 'demo-6',
    title: 'Polymer Clay Floral Dangle Earrings',
    category: 'HSN 7117 (3% GST)',
    unitCost: '₹188.40',
    sellingPrice: '₹499.00',
    margin: '58.2%',
    saleableYield: '9 / 10',
    date: 'Preset Demo',
    industryGroup: 'Jewellery',
  },
  {
    id: 'demo-7',
    title: 'Hand-Block Printed Cotton Tote Bag',
    category: 'HSN 6204 (12% GST)',
    unitCost: '₹292.00',
    sellingPrice: '₹650.00',
    margin: '49.7%',
    saleableYield: '5 / 5',
    date: 'Preset Demo',
    industryGroup: 'Apparel',
  },
  {
    id: 'demo-8',
    title: 'Roasted Peri Peri Makhana Pouch (100g)',
    category: 'HSN 1904 (12% GST)',
    unitCost: '₹84.50',
    sellingPrice: '₹199.00',
    margin: '52.4%',
    saleableYield: '10 / 10',
    date: 'Preset Demo',
    industryGroup: 'Food',
  },
  {
    id: 'demo-9',
    title: 'Notion Life & Business OS Template',
    category: 'SAC 9984 (18% GST)',
    unitCost: '₹122.00',
    sellingPrice: '₹999.00',
    margin: '76.8%',
    saleableYield: '50 / 50',
    date: 'Preset Demo',
    industryGroup: 'Digital',
  },
];

const FILTER_CATEGORIES = [
  'All',
  'Candles',
  'Soaps',
  'Bakery',
  'Cosmetics',
  'Resin',
  'Jewellery',
  'Apparel',
  'Food',
  'Digital',
];

export default function ProductsPage() {
  const [products, setProducts] = useState<SavedProduct[]>(DEFAULT_PRESETS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');

  useEffect(() => {
    try {
      const stored = localStorage.getItem('checkmargin_products') || localStorage.getItem('makermargin_products');
      if (stored) {
        const parsed: SavedProduct[] = JSON.parse(stored);
        if (parsed.length > 0) {
          setProducts([...parsed, ...DEFAULT_PRESETS]);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  function deleteProduct(id: string) {
    const updated = products.filter((p) => p.id !== id);
    setProducts(updated);
    try {
      const stored = JSON.parse(localStorage.getItem('checkmargin_products') || localStorage.getItem('makermargin_products') || '[]');
      const filtered = stored.filter((p: any) => p.id !== id);
      localStorage.setItem('checkmargin_products', JSON.stringify(filtered));
    } catch {
      // ignore
    }
  }

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedFilter === 'All' || p.industryGroup === selectedFilter || p.title.toLowerCase().includes(selectedFilter.toLowerCase());
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Universal Maker Formula Archive</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Saved Product Library</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage your formulas across candle making, bakery, skincare, apparel, resin crafts, and digital downloads.
          </p>
        </div>
        <Link
          href="/calculator"
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-xs transition-colors shrink-0 cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Product Costing</span>
        </Link>
      </div>

      {/* Search & Category Filter Toolbar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search saved products by title, category, or HSN code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {FILTER_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedFilter(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedFilter === cat
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid md:grid-cols-3 gap-5">
        {filteredProducts.map((item) => (
          <div
            key={item.id}
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

            <div className="pt-6 mt-4 border-t border-slate-100 flex items-center gap-2">
              <Link
                href="/calculator"
                className="flex-1 inline-flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 font-bold text-xs py-2.5 px-3 rounded-xl border border-slate-200 transition-colors"
              >
                <Calculator className="w-3.5 h-3.5" />
                <span>Open in Studio</span>
              </Link>
              {!item.id.startsWith('demo-') && (
                <button
                  onClick={() => deleteProduct(item.id)}
                  className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center text-slate-500">
          <p className="text-base font-bold text-slate-700">No products match your filter criteria.</p>
          <p className="text-xs mt-1">Try selecting &apos;All&apos; or clearing your search keywords.</p>
        </div>
      )}
    </div>
  );
}
