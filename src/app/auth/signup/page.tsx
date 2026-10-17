import Link from 'next/link';
import { Calculator, ArrowRight, User, Mail, Lock, Sparkles } from 'lucide-react';

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-10 w-full max-w-md shadow-sm">
        {/* Brand */}
        <Link href="/" className="inline-flex items-center gap-2 mb-8 group">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-500/25">
            <Calculator className="w-5 h-5" />
          </div>
          <span className="text-xl font-black text-slate-900">
            Maker<span className="text-indigo-600">Margin</span>
          </span>
        </Link>

        <h1 className="text-2xl font-black text-slate-900 tracking-tight mb-1">Create free account</h1>
        <p className="text-xs text-slate-500 mb-8">Start knowing your true product unit economics today</p>

        <form className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Rohit Sharma"
                className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                placeholder="founder@yourbrand.com"
                className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Primary Product Category
            </label>
            <select className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-xs">
              <option>🕯️ Candles & Wax Melts</option>
              <option>🧼 Soaps, Bath & Body</option>
              <option>🎨 Resin, Jesmonite & Decor</option>
              <option>🧁 Bakery, Confectionery & Food</option>
              <option>🧴 Organic Cosmetics & Skincare</option>
              <option>🧵 Clothing, Embroidery & Textiles</option>
              <option>🪵 Wood, Pottery & Handmade Crafts</option>
              <option>📦 Other Batch-Manufactured Products</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Create Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                placeholder="••••••••"
                className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-xs"
              />
            </div>
          </div>

          <Link
            href="/dashboard"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm py-3 px-4 rounded-xl shadow-md shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all mt-2"
          >
            <span>Create Studio Account</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </form>

        <p className="text-[11px] text-slate-400 mt-4 text-center leading-normal">
          By signing up, you agree to our Terms of Service & Privacy Policy. No credit card required.
        </p>

        <div className="mt-8 pt-6 border-t border-slate-100 text-center text-xs text-slate-500">
          Already have an account?{' '}
          <Link href="/auth/login" className="font-bold text-indigo-600 hover:underline">
            Log in here
          </Link>
        </div>
      </div>
    </div>
  );
}
