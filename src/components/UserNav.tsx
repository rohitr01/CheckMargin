'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LogOut, User, Sparkles, CreditCard } from 'lucide-react';
import { useSession, signOut } from '@/lib/auth/client';

export default function UserNav() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  async function handleSignOut() {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push('/auth/login');
          router.refresh();
        },
      },
    });
  }

  if (isPending) {
    return (
      <div className="py-2 px-3 animate-pulse">
        <div className="h-8 bg-slate-100 rounded-lg w-full"></div>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="pt-2">
        <Link
          href="/auth/login"
          className="flex items-center justify-center gap-2 w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs py-2 px-3 rounded-xl transition-colors"
        >
          <User className="w-3.5 h-3.5" />
          <span>Sign In to Cloud</span>
        </Link>
      </div>
    );
  }

  const user = session.user;
  const initial = user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase();

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 border border-slate-200/80">
        <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
          {initial}
        </div>
        <div className="overflow-hidden min-w-0 flex-1">
          <p className="text-xs font-bold text-slate-900 truncate">{user.name || 'Maker'}</p>
          <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        <Link
          href="/settings"
          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold transition-colors"
          title="Studio & Category Settings"
        >
          <span>Category & Profile</span>
        </Link>
        <Link
          href="/settings/billing"
          className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
          title="Plan & Billing"
        >
          <CreditCard className="w-3.5 h-3.5" />
        </Link>
        <button
          onClick={handleSignOut}
          type="button"
          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
          title="Sign Out"
        >
          <LogOut className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
