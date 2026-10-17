import Link from 'next/link';
import { Sparkles, ArrowRight, Calculator, ShieldCheck } from 'lucide-react';

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-700 text-white text-xs font-medium py-2 px-4 text-center flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
        <span>CheckMargin: Precision batch costing, fees & GST intelligence for product makers</span>
        <Link href="/calculator" className="underline font-semibold hover:text-indigo-200 transition-colors ml-1">
          Launch Calculator Free →
        </Link>
      </div>

      {/* Sticky Premium Navbar */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/25 group-hover:scale-105 transition-transform">
              <Calculator className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                Check<span className="text-indigo-600">Margin</span>
              </span>
              <span className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase -mt-1">
                Costing Operating System
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600">
            <Link href="/#how-it-works" className="hover:text-indigo-600 transition-colors">
              How It Works
            </Link>
            <Link href="/features" className="hover:text-indigo-600 transition-colors">
              Features
            </Link>
            <Link href="/gst-guide" className="hover:text-indigo-600 transition-colors">
              GST & HSN Guide
            </Link>
            <Link href="/compare" className="hover:text-indigo-600 transition-colors">
              Compare Couriers
            </Link>
            <Link href="/pricing" className="hover:text-indigo-600 transition-colors">
              Pricing
            </Link>
            <Link href="/calculator" className="flex items-center gap-1.5 text-indigo-600 font-bold hover:text-indigo-700 transition-colors bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100">
              <Calculator className="w-4 h-4" />
              <span>Studio Calculator</span>
            </Link>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-3">
            <Link
              href="/auth/login"
              className="text-sm font-semibold text-slate-700 hover:text-indigo-600 px-3.5 py-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              Log in
            </Link>
            <Link
              href="/auth/signup"
              className="inline-flex items-center gap-2 text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl shadow-md shadow-indigo-500/20 hover:shadow-lg hover:shadow-indigo-500/30 active:scale-98 transition-all"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Page Content */}
      <main className="flex-1">{children}</main>

      {/* Premium Footer */}
      <footer className="border-t border-slate-200 bg-white pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-100">
            <div className="md:col-span-2 space-y-4">
              <Link href="/" className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                  CM
                </div>
                <span className="text-xl font-black text-slate-900 tracking-tight">
                  Check<span className="text-indigo-600">Margin</span>
                </span>
              </Link>
              <p className="text-sm text-slate-500 max-w-sm leading-relaxed">
                The smart production costing, wholesale pricing, and margin protection platform for makers, crafters, artisan brands, and small-batch manufacturers.
              </p>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Deterministic calculations. True unit economics. Zero guesswork.</span>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">Product</h4>
              <ul className="space-y-2.5 text-sm text-slate-600 font-medium">
                <li><Link href="/calculator" className="hover:text-indigo-600 transition-colors">Live Batch Calculator</Link></li>
                <li><Link href="/gst-guide" className="hover:text-indigo-600 transition-colors">GST & HSN Guide</Link></li>
                <li><Link href="/compare" className="hover:text-indigo-600 transition-colors">Compare Couriers & Platforms</Link></li>
                <li><Link href="/features" className="hover:text-indigo-600 transition-colors">Features & Capabilities</Link></li>
                <li><Link href="/pricing" className="hover:text-indigo-600 transition-colors">Pricing & Plans</Link></li>
                <li><Link href="/dashboard" className="hover:text-indigo-600 transition-colors">Studio Workspace</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">Industries Served</h4>
              <ul className="space-y-2.5 text-sm text-slate-500">
                <li>Candles & Home Fragrance</li>
                <li>Soaps & Bath Products</li>
                <li>Resin, Jesmonite & Decor</li>
                <li>Bakery, Confectionery & Food</li>
                <li>Apparel, Jewellery & Crafts</li>
              </ul>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 font-medium">
            <p>© 2026 CheckMargin Inc. All rights reserved. Calculations are advisory and not tax or accounting advice.</p>
            <div className="flex gap-6 text-slate-500">
              <Link href="/pricing" className="hover:text-indigo-600">Pricing</Link>
              <Link href="/features" className="hover:text-indigo-600">Features</Link>
              <Link href="/auth/signup" className="hover:text-indigo-600">Create Account</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
