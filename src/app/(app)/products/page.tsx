'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Package, PlusCircle, Calculator, Trash2, Search, Sparkles, Filter, ArrowRight } from 'lucide-react';

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
    industryGroup: 'Resin & Art',
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
    industryGroup: 'Digital & Tech',
  },
  {
    id: 'demo-10',
    title: 'Jesmonite AC100 Oval Trinket Tray',
    category: 'HSN 6815 (18% GST)',
    unitCost: '₹174.00',
    sellingPrice: '₹449.00',
    margin: '54.5%',
    saleableYield: '8 / 8',
    date: 'Preset Demo',
    industryGroup: 'Resin & Art',
  },
  {
    id: 'demo-11',
    title: 'Handcrafted Teak Wood Chopping Board',
    category: 'HSN 4419 (12% GST)',
    unitCost: '₹340.00',
    sellingPrice: '₹899.00',
    margin: '55.6%',
    saleableYield: '6 / 6',
    date: 'Preset Demo',
    industryGroup: 'Wood & Ceramics',
  },
  {
    id: 'demo-12',
    title: 'Wheel-Thrown Stoneware Coffee Mug (350ml)',
    category: 'HSN 6912 (12% GST)',
    unitCost: '₹195.00',
    sellingPrice: '₹550.00',
    margin: '58.3%',
    saleableYield: '10 / 12',
    date: 'Preset Demo',
    industryGroup: 'Wood & Ceramics',
  },
  {
    id: 'demo-13',
    title: 'Vegetable-Tanned Minimalist Leather Cardholder',
    category: 'HSN 4202 (18% GST)',
    unitCost: '₹280.00',
    sellingPrice: '₹799.00',
    margin: '58.7%',
    saleableYield: '10 / 10',
    date: 'Preset Demo',
    industryGroup: 'Leather & Goods',
  },
  {
    id: 'demo-14',
    title: '3D Printable Tabletop Miniatures Pack (STL)',
    category: 'SAC 998319 (18% GST)',
    unitCost: '₹210.00',
    sellingPrice: '₹1499.00',
    margin: '82.4%',
    saleableYield: '40 / 40',
    date: 'Preset Demo',
    industryGroup: 'Digital & Tech',
  },
];

const INDUSTRY_FILTERS = [
  'All Categories',
  'Candles',
  'Soaps',
  'Bakery',
  'Cosmetics',
  'Resin & Art',
  'Jewellery',
  'Apparel',
  'Food',
  'Wood & Ceramics',
  'Leather & Goods',
  'Digital & Tech',
];

export default function ProductsPage() {
  const [products, setProducts] = useState<SavedProduct[]>([]);
  const [search, setSearch] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('All Categories');

  useEffect(() => {
    const saved = localStorage.getItem('makermargin_products');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setProducts(parsed.length > 0 ? parsed : DEFAULT_PRESETS);
      } catch {
        setProducts(DEFAULT_PRESETS);
      }
    } else {
      setProducts(DEFAULT_PRESETS);
    }
  }, []);

  function handleDelete(id: string) {
    const updated = products.filter((p) => p.id !== id);
    setProducts(updated);
    localStorage.setItem('makermargin_products', JSON.stringify(updated));
  }

  function handleResetDemo() {
    setProducts(DEFAULT_PRESETS);
    localStorage.setItem('makermargin_products', JSON.stringify(DEFAULT_PRESETS));
  }

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase());
    const matchesIndustry =
      selectedIndustry === 'All Categories' || p.industryGroup === selectedIndustry;
    return matchesSearch && matchesIndustry;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-indigo-50 border border-indigo-200/80 rounded-full px-3 py-1 text-xs font-semibold text-indigo-700 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Product Catalog & Recipe Library</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Saved Products</h1>
          <p className="text-slate-500 text-sm mt-1">
            Browse, manage, and benchmark unit economics across all your craft and digital verticals.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleResetDemo}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 bg-white border border-slate-300 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors"
          >
            Reset Pre-filled Presets
          </button>
          <Link
            href="/calculator"
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm px-5 py-2.5 rounded-xl shadow-xs transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Costing</span>
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search products by title, HSN code, or tax rate..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
            <span>Showing {filteredProducts.length} of {products.length} products</span>
          </div>
        </div>

        {/* Industry Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <Filter className="w-4 h-4 text-slate-400 shrink-0 mr-1" />
          {INDUSTRY_FILTERS.map((ind) => (
            <button
              key={ind}
              onClick={() => setSelectedIndustry(ind)}
              className={`text-xs font-bold px-3 py-1.5 rounded-xl whitespace-nowrap transition-all ${
                selectedIndustry === ind
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {ind}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center">
          <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-bold text-slate-900 text-lg mb-1">No products found</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto mb-6">
            No products matched your search or category filter. Try clearing filters or create a new batch.
          </p>
          <button
            onClick={() => {
              setSearch('');
              setSelectedIndustry('All Categories');
            }}
            className="text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-xl transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProducts.map((p) => (
            <div
              key={p.id}
              className="bg-white border border-slate-200 hover:border-indigo-400 rounded-3xl p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">
                    {p.industryGroup || 'General'}
                  </span>
                  <span className="text-[11px] font-medium text-slate-400">
                    {p.date}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-base leading-snug mb-1 group-hover:text-indigo-600 transition-colors">
                  {p.title}
                </h3>
                <span className="inline-block text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md mb-4">
                  {p.category}
                </span>

                <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 rounded-2xl mb-4 border border-slate-100">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Cost</span>
                    <span className="text-xs font-black text-slate-900">{p.unitCost}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Price</span>
                    <span className="text-xs font-black text-slate-900">{p.sellingPrice}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Margin</span>
                    <span className="text-xs font-black text-emerald-600">{p.margin}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 font-medium">
                  Yield: <strong className="text-slate-800">{p.saleableYield}</strong>
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Delete product"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <Link
                    href="/calculator"
                    className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-xl transition-colors"
                  >
                    <span>Recalculate</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
