'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  CreditCard,
  CheckCircle2,
  Sparkles,
  Zap,
  ShieldCheck,
  ArrowRight,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { useSession } from '@/lib/auth/client';

export default function BillingPage() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [upgrading, setUpgrading] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch('/api/user/profile');
        if (res.ok) {
          const data = await res.json();
          setProfile(data.profile);
        }
      } catch (err) {
        console.warn('Failed to load profile:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  async function handleUpgrade(planName: 'pro' | 'annual') {
    setUpgrading(planName);
    setNotice(null);

    try {
      const res = await fetch('/api/billing/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planName }),
      });
      const data = await res.json();

      if (!res.ok) {
        setNotice(data.error || 'Failed to initiate billing session.');
        return;
      }

      if (!data.configured) {
        setNotice(
          `Live Gateway Configuration Notice: ${data.message} All Free Starter calculator features remain fully functional without payment.`
        );
      } else {
        setNotice(
          `Checkout order created (${data.orderId}) for ₹${data.amount / 100}. Ready for payment gateway checkout modal.`
        );
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Billing connection failed';
      setNotice(msg);
    } finally {
      setUpgrading(null);
    }
  }

  const currentPlan = profile?.plan || 'free';

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 bg-indigo-50 border border-indigo-200/80 rounded-full px-3 py-1 text-xs font-semibold text-indigo-700 mb-2">
          <CreditCard className="w-3.5 h-3.5" />
          <span>SaaS Entitlements & Subscription Studio</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Plan & Billing</h1>
        <p className="text-slate-500 text-sm mt-1">
          Manage your CheckMargin workspace tier, product recipe quotas, and export capabilities.
        </p>
      </div>

      {notice && (
        <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-2xl flex items-start gap-3 text-xs text-indigo-900">
          <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold">Billing Gateway Ready</p>
            <p>{notice}</p>
          </div>
        </div>
      )}

      {/* Current Subscription Status */}
      <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 md:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Active Workspace Subscription
            </span>
            <div className="flex items-center gap-2.5">
              <h2 className="text-2xl font-black text-slate-900 capitalize">
                {currentPlan === 'free' ? 'Free Starter Tier' : `${currentPlan} Plan`}
              </h2>
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold px-2 py-0.5 rounded-full">
                Active
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              {currentPlan === 'free'
                ? 'Allows up to 3 custom saved products in cloud storage and full calculation engine access.'
                : 'Unlimited saved recipes, priority calculation snapshots, and CSV/PDF studio exports.'}
            </p>
          </div>

          <div className="text-right sm:border-l sm:border-slate-100 sm:pl-6">
            <span className="text-2xl font-black text-slate-900">
              {currentPlan === 'free' ? '₹0' : currentPlan === 'annual' ? '₹2,499' : '₹299'}
            </span>
            <span className="text-xs text-slate-400 font-semibold block">
              {currentPlan === 'free' ? 'forever' : currentPlan === 'annual' ? '/year' : '/month'}
            </span>
          </div>
        </div>
      </div>

      {/* Billing Switcher */}
      <div className="flex justify-center">
        <div className="bg-slate-100 p-1 rounded-xl flex items-center text-xs font-bold">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-4 py-2 rounded-lg transition-colors cursor-pointer ${
              billingCycle === 'monthly' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Monthly Billing
          </button>
          <button
            onClick={() => setBillingCycle('annual')}
            className={`px-4 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              billingCycle === 'annual' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Annual Billing</span>
            <span className="bg-emerald-100 text-emerald-800 text-[10px] px-1.5 py-0.5 rounded font-black">
              Save 30%
            </span>
          </button>
        </div>
      </div>

      {/* Tier Comparison Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Free Plan */}
        <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-black text-slate-900">Free Starter</h3>
              <span className="text-xs font-bold text-slate-400">Basic</span>
            </div>
            <div className="mb-4">
              <span className="text-3xl font-black text-slate-900">₹0</span>
              <span className="text-xs text-slate-400 ml-1">forever</span>
            </div>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              Ideal for hobbyists testing product unit economics and initial batch pricing.
            </p>
            <ul className="space-y-3 text-xs text-slate-700 mb-8">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Up to 3 saved custom product recipes</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Full batch cost calculator & yield modeling</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>All 173 GST HSN/SAC categories directory</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>14 pre-loaded industry demo presets</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>CSV export of material breakdown</span>
              </li>
            </ul>
          </div>

          <button
            disabled
            className="w-full bg-slate-100 text-slate-400 font-bold text-xs py-3 px-4 rounded-xl cursor-default"
          >
            Current Default Plan
          </button>
        </div>

        {/* Pro Plan */}
        <div className="bg-white border-2 border-indigo-500 ring-2 ring-indigo-500/20 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-lg shadow-indigo-100 relative">
          <div className="absolute -top-3 right-6 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-xs">
            Most Popular
          </div>
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-black text-slate-900">
                {billingCycle === 'annual' ? 'Pro Annual' : 'Pro Studio'}
              </h3>
              <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
            </div>
            <div className="mb-4">
              <span className="text-3xl font-black text-slate-900">
                {billingCycle === 'annual' ? '₹2,499' : '₹299'}
              </span>
              <span className="text-xs text-slate-400 ml-1">
                {billingCycle === 'annual' ? '/year (₹208/mo)' : '/month'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              For active artisans, D2C founders, and craft studios with multiple active SKUs.
            </p>
            <ul className="space-y-3 text-xs text-slate-700 mb-8">
              <li className="flex items-center gap-2 font-bold text-indigo-950">
                <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>Unlimited saved custom product recipes</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>Multi-tier wholesale & B2B quote generator</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>1-Click industrial labour efficiency batch scaler</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>Automated supplier pack shopping lists</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>Executive PDF & CSV cost sheet downloads</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>Priority email support & early feature access</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => handleUpgrade(billingCycle === 'annual' ? 'annual' : 'pro')}
            disabled={upgrading !== null}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-bold text-xs py-3 px-4 rounded-xl shadow-md shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            {upgrading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Connecting Payment Gateway...</span>
              </>
            ) : (
              <>
                <span>Upgrade to {billingCycle === 'annual' ? 'Annual Pro' : 'Pro Studio'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
