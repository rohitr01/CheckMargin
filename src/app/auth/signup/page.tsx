'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Calculator, ArrowRight, User, Mail, Lock, Building, Loader2, AlertCircle } from 'lucide-react';
import { authClient } from '@/lib/auth/client';

function getSafeRedirect(url: string | null): string {
  if (!url || typeof url !== 'string') return '/dashboard';
  const clean = url.trim();
  if (clean.startsWith('/') && !clean.startsWith('//') && !clean.includes('\\')) {
    return clean;
  }
  return '/dashboard';
}

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawRedirect = searchParams.get('redirect');
  const safeRedirectUrl = getSafeRedirect(rawRedirect);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [primaryIndustry, setPrimaryIndustry] = useState('Candles');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    setLoading(true);

    try {
      const { data, error: authError } = await authClient.signUp.email({
        email: email.trim(),
        password,
        name: name.trim(),
      });

      if (authError) {
        setError(authError.message || 'Failed to create account. Please check your credentials.');
        setLoading(false);
        return;
      }

      // Sync business profile metadata to Neon PostgreSQL
      try {
        const profileRes = await fetch('/api/user/profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            displayName: name.trim(),
            businessName: businessName.trim() || undefined,
            primaryIndustry,
          }),
        });
        if (!profileRes.ok) {
          console.warn('Profile sync returned non-OK status:', profileRes.status);
        }
      } catch (err) {
        console.warn('Profile sync warning:', err);
      }

      // Route to workspace securely
      router.push(safeRedirectUrl);
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An unexpected error occurred during signup.';
      setError(msg);
      setLoading(false);
    }
  }

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

        <h1 className="text-2xl font-black text-slate-900 tracking-tight mb-1">Create free account</h1>
        <p className="text-xs text-slate-500 mb-6">Start knowing your true product unit economics today</p>

        {error && (
          <div className="mb-6 p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-xs text-rose-700">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Full Name *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Rohit Sharma"
                className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="founder@yourbrand.com"
                className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Business / Brand Name (Optional)
            </label>
            <div className="relative">
              <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Aura Artisan Studio"
                className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Primary Product Category
            </label>
            <select
              value={primaryIndustry}
              onChange={(e) => setPrimaryIndustry(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-xs"
            >
              <option value="Candles">🕯️ Candles & Wax Melts</option>
              <option value="Soaps">🧼 Soaps, Bath & Body</option>
              <option value="Resin & Art">🎨 Resin, Jesmonite & Decor</option>
              <option value="Bakery">🧁 Bakery, Confectionery & Food</option>
              <option value="Cosmetics">🧴 Organic Cosmetics & Skincare</option>
              <option value="Jewellery">💍 Handmade Jewellery</option>
              <option value="Apparel">🧵 Clothing, Embroidery & Textiles</option>
              <option value="Wood & Ceramics">🪵 Wood, Pottery & Handmade Crafts</option>
              <option value="Digital & Tech">💻 Digital Goods, Templates & 3D STLs</option>
              <option value="Other">📦 Other Batch-Manufactured Products</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Create Password (min 8 chars) *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-xs"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-bold text-sm py-3 px-4 rounded-xl shadow-md shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer mt-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <span>Create Studio Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <p className="text-[11px] text-slate-400 mt-4 text-center leading-normal">
          By signing up, you agree to our Terms of Service & Privacy Policy. No credit card required.
        </p>

        <div className="mt-8 pt-6 border-t border-slate-100 text-center text-xs text-slate-500">
          Already have an account?{' '}
          <Link
            href={`/auth/login${safeRedirectUrl !== '/dashboard' ? `?redirect=${encodeURIComponent(safeRedirectUrl)}` : ''}`}
            className="font-bold text-indigo-600 hover:underline"
          >
            Log in here
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
          <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
        </div>
      }
    >
      <SignupForm />
    </Suspense>
  );
}
