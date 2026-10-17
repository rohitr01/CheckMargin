import Link from 'next/link';
import { Calculator, ArrowRight, Lock, Mail } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-10 w-full max-w-md shadow-sm">
        {/* Brand */}
        <Link href="/" className="inline-flex items-center gap-2 mb-8 group">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-500/25">
            <Calculator className="w-5 h-5" />
          </div>
          <span className="text-xl font-black text-slate-900">
            Check<span className="text-indigo-600">Margin</span>
          </span>
        </Link>

        <h1 className="text-2xl font-black text-slate-900 tracking-tight mb-1">Welcome back</h1>
        <p className="text-xs text-slate-500 mb-8">Log in to manage your product recipes and costing studio</p>

        <form className="space-y-4">
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
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Password
              </label>
              <a href="#" className="text-xs font-semibold text-indigo-600 hover:underline">
                Forgot?
              </a>
            </div>
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
            <span>Log in to Studio</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 text-center text-xs text-slate-500">
          Don&apos;t have an account yet?{' '}
          <Link href="/auth/signup" className="font-bold text-indigo-600 hover:underline">
            Sign up free
          </Link>
        </div>
      </div>
    </div>
  );
}
