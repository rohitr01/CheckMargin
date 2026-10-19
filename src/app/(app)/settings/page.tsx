'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Building,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Save,
  CreditCard,
  ShieldCheck,
} from 'lucide-react';
import { BUSINESS_CATEGORIES } from '@/lib/business-categories';

export default function SettingsProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form states
  const [displayName, setDisplayName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('candles-fragrance');
  const [isCustom, setIsCustom] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customDesc, setCustomDesc] = useState('');
  const [customProduct, setCustomProduct] = useState('');
  const [customProductType, setCustomProductType] = useState<'physical' | 'digital' | 'service'>('physical');

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch('/api/user/profile');
        if (res.ok) {
          const data = await res.json();
          const p = data.profile;
          setProfile(p);
          setDisplayName(p.display_name || '');
          setBusinessName(p.business_name || '');
          setSelectedCategory(p.business_category_id || 'candles-fragrance');
          setIsCustom(Boolean(p.is_custom_category || p.business_category_id === 'custom'));
          setCustomName(p.custom_category_name || '');
          setCustomDesc(p.custom_category_desc || '');
          setCustomProduct(p.custom_product_or_service || '');
          setCustomProductType(
            p.custom_product_type === 'digital'
              ? 'digital'
              : p.custom_product_type === 'service'
              ? 'service'
              : 'physical'
          );
        }
      } catch (err) {
        console.warn('Failed to load profile settings:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    if (isCustom && !customName.trim()) {
      setErrorMessage('Please enter a name for your custom business category.');
      setSaving(false);
      return;
    }

    try {
      const res = await fetch('/api/user/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          displayName: displayName.trim(),
          businessName: businessName.trim(),
          businessCategoryId: isCustom ? 'custom' : selectedCategory,
          isCustomCategory: isCustom,
          customCategoryName: isCustom ? customName.trim() : null,
          customCategoryDesc: isCustom ? customDesc.trim() : null,
          customProductOrService: isCustom ? customProduct.trim() : null,
          customProductType: isCustom ? customProductType : 'physical',
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to save settings.');
      }

      const updated = await res.json();
      setProfile(updated.profile);
      setSuccessMessage('Workspace settings and business category saved successfully! Existing saved products remain intact.');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An error occurred while saving.';
      setErrorMessage(msg);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-12 flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mb-3" />
        <p className="text-xs text-slate-500 font-medium">Loading workspace settings...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 bg-indigo-50 border border-indigo-200/80 rounded-full px-3 py-1 text-xs font-semibold text-indigo-700 mb-2">
          <Building className="w-3.5 h-3.5" />
          <span>Workspace & Business Category Setup</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Business Profile & Category</h1>
        <p className="text-slate-500 text-sm mt-1">
          Personalize your studio identity, template suggestions, and default costing workflow.
        </p>
      </div>

      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-3 text-xs text-emerald-800">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <span className="font-semibold">{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3 text-xs text-rose-800">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        {/* Section 1: Business Identity */}
        <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-5">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-900">Studio & Maker Identity</h2>
            <p className="text-xs text-slate-500">Your brand name and contact profile</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Business / Studio Name
              </label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="e.g. Aura Artisan Candles"
                className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Founder / Maker Name
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="e.g. Rohit Sharma"
                className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Business Category Selection */}
        <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Primary Business Category</h2>
                <p className="text-xs text-slate-500">
                  Select the primary category that best describes your business, or create your own custom category.
                </p>
              </div>
              <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
                Editable anytime
              </span>
            </div>
          </div>

          {/* Critical Architecture Callout */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-start gap-3 text-xs text-slate-600">
            <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold text-slate-800">Independent Product Classification Protection</p>
              <p>
                Changing your primary business category personalizes dashboard suggestions and quick templates.
                It will <strong>NEVER delete, rename, or modify your existing saved products</strong>, and will never alter their GST rates or HSN/SAC codes.
              </p>
            </div>
          </div>

          {/* Broad Category Grid */}
          <div className="grid sm:grid-cols-3 gap-3">
            {BUSINESS_CATEGORIES.map((cat) => {
              const isSelected = !isCustom && selectedCategory === cat.id && cat.id !== 'custom';
              const isCustomCard = cat.id === 'custom';
              const isCustomActive = isCustom && isCustomCard;

              return (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => {
                    if (isCustomCard) {
                      setIsCustom(true);
                      setSelectedCategory('custom');
                    } else {
                      setIsCustom(false);
                      setSelectedCategory(cat.id);
                    }
                  }}
                  className={`text-left p-4 rounded-2xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
                    isSelected || isCustomActive
                      ? 'border-indigo-600 bg-indigo-50/50 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60'
                  }`}
                >
                  {cat.badge && (
                    <span className="absolute top-3 right-3 text-[10px] font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-full">
                      {cat.badge}
                    </span>
                  )}
                  <div>
                    <span className="text-2xl mb-2 block">{cat.icon}</span>
                    <h3 className="font-bold text-slate-900 text-sm mb-1">{cat.name}</h3>
                    <p className="text-[11px] text-slate-500 leading-normal line-clamp-2">{cat.tagline}</p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 capitalize">{cat.defaultProductType}</span>
                    {(isSelected || isCustomActive) && (
                      <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Custom Category Details Form (Expands when Other / Custom is chosen) */}
          {isCustom && (
            <div className="mt-6 p-6 bg-indigo-50/40 border-2 border-indigo-200 rounded-2xl space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <h3 className="font-bold text-slate-900 text-sm">Define Your Custom Business Category</h3>
              </div>
              <p className="text-xs text-slate-500">
                Enter your unique business or craft category so CheckMargin can tailor your workspace.
              </p>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Custom Business / Industry Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="e.g. 3D-Printed Model Kits or Concrete Pottery"
                    className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Primary Product / Service
                  </label>
                  <input
                    type="text"
                    value={customProduct}
                    onChange={(e) => setCustomProduct(e.target.value)}
                    placeholder="e.g. Modular Tabletop Miniatures"
                    className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Primary Product Delivery Type
                  </label>
                  <select
                    value={customProductType}
                    onChange={(e) => setCustomProductType(e.target.value as 'physical' | 'digital' | 'service')}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="physical">📦 Physical Batch Manufactured Product</option>
                    <option value="digital">💻 Digital Download / File / Template</option>
                    <option value="service">🛠️ Bespoke Service / Workshop / Custom Crafting</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Description / Production Process (Optional)
                  </label>
                  <input
                    type="text"
                    value={customDesc}
                    onChange={(e) => setCustomDesc(e.target.value)}
                    placeholder="e.g. Resin SLA printing, UV post-curing, hand finishing"
                    className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Submit Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <Link
            href="/settings/billing"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-indigo-600 transition-colors"
          >
            <CreditCard className="w-4 h-4" />
            <span>Manage Subscription & Plan Quota →</span>
          </Link>

          <button
            type="submit"
            disabled={saving}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-bold text-sm px-7 py-3 rounded-xl shadow-md shadow-indigo-500/25 transition-all cursor-pointer"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving Changes...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Workspace Settings</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
