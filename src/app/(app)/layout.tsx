import Link from 'next/link';
import {
  LayoutDashboard,
  Calculator,
  Package,
  Sparkles,
  ArrowLeft,
  ShieldCheck,
  PlusCircle,
} from 'lucide-react';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Workspace Dashboard' },
  { href: '/calculator', icon: Calculator, label: 'Batch Calculator' },
  { href: '/products', icon: Package, label: 'Saved Products' },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col bg-white border-r border-slate-200 px-4 py-6 shadow-xs">
        {/* Brand */}
        <div className="px-3 mb-8">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-500/25">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                Maker<span className="text-indigo-600">Margin</span>
              </span>
              <span className="text-[10px] font-bold text-slate-400 block -mt-1 uppercase tracking-wider">
                App Studio
              </span>
            </div>
          </Link>
        </div>

        {/* Quick Action */}
        <div className="px-2 mb-6">
          <Link
            href="/calculator"
            className="flex items-center justify-center gap-2 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-xs transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Batch Costing</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1.5 px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 transition-all group"
              >
                <Icon className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer info in sidebar */}
        <div className="mt-auto pt-6 px-3 border-t border-slate-100">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors mb-4"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Public Site</span>
          </Link>
          <div className="text-[11px] text-slate-400 space-y-1">
            <p className="font-semibold text-slate-500">MakerMargin v1.0 Production</p>
            <p>Formulas verified against hand-calculated ground truth.</p>
          </div>
        </div>
      </aside>

      {/* Mobile Top Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 h-16 flex items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-black text-slate-900">
          <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
            MM
          </div>
          <span>MakerMargin</span>
        </Link>
        <div className="flex items-center gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="p-2 text-slate-600 hover:text-indigo-600 rounded-lg hover:bg-slate-100"
                title={item.label}
              >
                <Icon className="w-5 h-5" />
              </Link>
            );
          })}
        </div>
      </div>

      {/* Content Canvas */}
      <main className="flex-1 md:p-8 p-4 mt-16 md:mt-0 min-h-screen">
        {children}
      </main>
    </div>
  );
}
