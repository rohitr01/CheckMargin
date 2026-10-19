'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Package,
  PlusCircle,
  Calculator,
  Trash2,
  Search,
  Sparkles,
  Filter,
  ArrowRight,
  Cloud,
  CloudUpload,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ShieldAlert,
} from 'lucide-react';
import { useSession } from '@/lib/auth/client';

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
  isCustom?: boolean;
}

interface EntitlementsState {
  plan: {
    name: string;
    displayName: string;
    maxSavedProducts: number;
    unlimitedProducts: boolean;
  };
  savedProductsCount: number;
  canCreateProduct: boolean;
  quotaRemaining: number;
}

const DEFAULT_PRESETS: SavedProduct[] = [
  {
    id: 'demo-1',
    title: 'Handcrafted 200g Vanilla Soy Candle',
    category: 'HSN 3406 (12% GST)',
    unitCost: '₹264.40',
    sellingPrice: '₹599.00',
    margin: '53.7%',
    saleableYield: '9 / 10',
    date: 'Preset Demo',
    industryGroup: 'Candles',
    isCustom: false,
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
    isCustom: false,
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
    isCustom: false,
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
    isCustom: false,
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
    isCustom: false,
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
    isCustom: false,
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
    isCustom: false,
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
    isCustom: false,
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
    isCustom: false,
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
    isCustom: false,
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
    isCustom: false,
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
    isCustom: false,
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
    isCustom: false,
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
    isCustom: false,
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
  const { data: session } = useSession();
  const [customProducts, setCustomProducts] = useState<SavedProduct[]>([]);
  const [entitlements, setEntitlements] = useState<EntitlementsState | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('All Categories');
  const [localItemsToMigrate, setLocalItemsToMigrate] = useState<SavedProduct[]>([]);
  const [migrating, setMigrating] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'custom' | 'presets'>('all');

  useEffect(() => {
    fetchCloudProducts();
    checkLocalStorageMigration();
  }, []);

  async function fetchCloudProducts() {
    setLoading(true);
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        const formatted: SavedProduct[] = (data.products || []).map((p: any) => ({
          id: p.id,
          title: p.title,
          category: p.category || (p.hsn_code ? `HSN ${p.hsn_code}` : 'Custom Recipe'),
          unitCost: `₹${Number(p.unit_cost || 0).toFixed(2)}`,
          sellingPrice: `₹${Number(p.selling_price || 0).toFixed(2)}`,
          margin: `${Number(p.margin_percent || 0).toFixed(1)}%`,
          saleableYield: p.saleable_yield || '1/1',
          date: new Date(p.created_at).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          }),
          industryGroup: p.industry_group || 'Candles',
          isCustom: true,
        }));
        setCustomProducts(formatted);
        if (data.entitlements) {
          setEntitlements(data.entitlements);
        }
      }
    } catch (err) {
      console.warn('Failed to load cloud products:', err);
    } finally {
      setLoading(false);
    }
  }

  function checkLocalStorageMigration() {
    try {
      const saved = localStorage.getItem('makermargin_products');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Exclude items that are identical to demo presets
        const customOnly = parsed.filter(
          (item: SavedProduct) => !item.id.startsWith('demo-')
        );
        if (customOnly.length > 0) {
          setLocalItemsToMigrate(customOnly);
        }
      }
    } catch {
      // ignore JSON parse errors
    }
  }

  async function handleMigrateLocal() {
    if (localItemsToMigrate.length === 0) return;
    setMigrating(true);
    try {
      for (const item of localItemsToMigrate) {
        await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: item.title,
            category: item.category,
            industryGroup: item.industryGroup || 'Candles',
            unitCost: parseFloat(item.unitCost.replace(/[^\d.]/g, '')) || 0,
            sellingPrice: parseFloat(item.sellingPrice.replace(/[^\d.]/g, '')) || 0,
            marginPercent: parseFloat(item.margin.replace(/[^\d.]/g, '')) || 0,
            saleableYield: item.saleableYield,
          }),
        });
      }
      localStorage.removeItem('makermargin_products');
      setLocalItemsToMigrate([]);
      await fetchCloudProducts();
    } catch (err) {
      console.error('Migration failed:', err);
    } finally {
      setMigrating(false);
    }
  }

  async function handleDelete(id: string, isCustom?: boolean) {
    if (isCustom) {
      try {
        const res = await fetch(`/api/products?id=${id}`, { method: 'DELETE' });
        if (res.ok) {
          setCustomProducts((prev) => prev.filter((p) => p.id !== id));
          if (entitlements) {
            setEntitlements({
              ...entitlements,
              savedProductsCount: Math.max(0, entitlements.savedProductsCount - 1),
              quotaRemaining: entitlements.quotaRemaining + 1,
              canCreateProduct: true,
            });
          }
        }
      } catch (err) {
        console.error('Delete failed:', err);
      }
    }
  }

  const allDisplayProducts =
    activeTab === 'custom'
      ? customProducts
      : activeTab === 'presets'
      ? DEFAULT_PRESETS
      : [...customProducts, ...DEFAULT_PRESETS];

  const filteredProducts = allDisplayProducts.filter((p) => {
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
          <Link
            href="/calculator"
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-xs transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Cost New Product</span>
          </Link>
        </div>
      </div>

      {/* Plan Entitlements Banner */}
      {entitlements && (
        <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">
                {entitlements.plan.displayName}
              </p>
              <p className="text-[11px] text-slate-500">
                {entitlements.plan.unlimitedProducts ? (
                  <span className="text-emerald-700 font-semibold">Unlimited Cloud Recipes Active</span>
                ) : (
                  <span>
                    {entitlements.savedProductsCount} of {entitlements.plan.maxSavedProducts} Custom Products saved (
                    {entitlements.quotaRemaining} slots remaining)
                  </span>
                )}
              </p>
            </div>
          </div>
          {!entitlements.plan.unlimitedProducts && (
            <Link
              href="/settings/billing"
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors self-start sm:self-center"
            >
              Upgrade to Pro (₹299/mo) →
            </Link>
          )}
        </div>
      )}

      {/* LocalStorage Migration Alert */}
      {localItemsToMigrate.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <CloudUpload className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <p className="text-xs font-bold text-amber-900">
                Found {localItemsToMigrate.length} local recipe(s) saved on this device
              </p>
              <p className="text-[11px] text-amber-700">
                Migrate them to your Neon PostgreSQL Cloud account so you never lose them.
              </p>
            </div>
          </div>
          <button
            onClick={handleMigrateLocal}
            disabled={migrating}
            className="flex items-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-colors cursor-pointer self-start sm:self-center"
          >
            {migrating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CloudUpload className="w-3.5 h-3.5" />}
            <span>Migrate to Cloud</span>
          </button>
        </div>
      )}

      {/* Tabs and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        {/* View Tabs */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Products ({customProducts.length + DEFAULT_PRESETS.length})
          </button>
          <button
            onClick={() => setActiveTab('custom')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'custom' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            My Saved ({customProducts.length})
          </button>
          <button
            onClick={() => setActiveTab('presets')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'presets' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Industry Templates ({DEFAULT_PRESETS.length})
          </button>
        </div>

        {/* Search & Industry Filter */}
        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search product or HSN..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-3 py-1.5 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-xs"
            />
          </div>

          <div className="relative">
            <select
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
              className="bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-xs cursor-pointer"
            >
              {INDUSTRY_FILTERS.map((ind) => (
                <option key={ind} value={ind}>
                  {ind}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Product Cards Grid */}
      {loading ? (
        <div className="py-16 text-center">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mx-auto mb-3" />
          <p className="text-xs text-slate-500">Loading recipes from Neon PostgreSQL...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center">
          <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-bold text-slate-900 text-base mb-1">No products match your filter</h3>
          <p className="text-xs text-slate-500 mb-6">Try searching for a different keyword or reset industry filters.</p>
          <button
            onClick={() => {
              setSearch('');
              setSelectedIndustry('All Categories');
            }}
            className="text-xs font-bold text-indigo-600 hover:underline"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProducts.map((p) => (
            <div
              key={p.id}
              className={`bg-white border-2 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between ${
                p.isCustom ? 'border-indigo-200 hover:border-indigo-400' : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider bg-indigo-50 px-2 py-0.5 rounded-md">
                        {p.industryGroup || 'General'}
                      </span>
                      {p.isCustom ? (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                          Cloud
                        </span>
                      ) : (
                        <span className="text-[10px] font-medium text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                          Template
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2">
                      {p.title}
                    </h3>
                  </div>

                  {p.isCustom && (
                    <button
                      onClick={() => handleDelete(p.id, p.isCustom)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Delete saved recipe"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <p className="text-[11px] text-slate-400 font-medium mb-4">{p.category}</p>

                {/* Economics Grid */}
                <div className="grid grid-cols-3 gap-2 bg-slate-50 border border-slate-100 rounded-xl p-3 mb-4">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Unit Cost</span>
                    <span className="text-xs font-bold text-slate-900">{p.unitCost}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Price</span>
                    <span className="text-xs font-bold text-indigo-600">{p.sellingPrice}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Margin</span>
                    <span className="text-xs font-black text-emerald-700">{p.margin}</span>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Yield: {p.saleableYield} units</span>
                <Link
                  href="/calculator"
                  className="font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 group"
                >
                  <span>Open Recipe</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
