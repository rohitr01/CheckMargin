import { sql } from '@/lib/db';

export interface PlanLimits {
  name: 'free' | 'pro' | 'annual';
  displayName: string;
  maxSavedProducts: number; // e.g. 3 for free, Infinity for pro
  unlimitedProducts: boolean;
  canExportPDF: boolean;
  canExportCSV: boolean;
  prioritySupport: boolean;
}

export const PLAN_LIMITS: Record<string, PlanLimits> = {
  free: {
    name: 'free',
    displayName: 'Free Starter',
    maxSavedProducts: 3,
    unlimitedProducts: false,
    canExportPDF: false,
    canExportCSV: true,
    prioritySupport: false,
  },
  pro: {
    name: 'pro',
    displayName: 'Pro Monthly (₹299/mo)',
    maxSavedProducts: Infinity,
    unlimitedProducts: true,
    canExportPDF: true,
    canExportCSV: true,
    prioritySupport: true,
  },
  annual: {
    name: 'annual',
    displayName: 'Pro Annual (₹2,499/yr)',
    maxSavedProducts: Infinity,
    unlimitedProducts: true,
    canExportPDF: true,
    canExportCSV: true,
    prioritySupport: true,
  },
};

/**
 * Retrieves the effective plan limits and current product count for a given user.
 */
export async function getUserEntitlements(userId: string): Promise<{
  plan: PlanLimits;
  savedProductsCount: number;
  canCreateProduct: boolean;
  quotaRemaining: number;
}> {
  // Fetch user profile plan
  const profileRows = await sql`
    SELECT plan FROM user_profiles WHERE neon_user_id = ${userId} OR auth_user_id = ${userId} LIMIT 1
  `;
  const planKey = (profileRows[0]?.plan as string) || 'free';
  const plan = PLAN_LIMITS[planKey] || PLAN_LIMITS.free;

  // Count user saved products
  const countRows = await sql`
    SELECT COUNT(*)::int as total FROM products WHERE user_id = ${userId}
  `;
  const savedProductsCount = (countRows[0]?.total as number) || 0;

  const canCreateProduct = plan.unlimitedProducts || savedProductsCount < plan.maxSavedProducts;
  const quotaRemaining = plan.unlimitedProducts
    ? Infinity
    : Math.max(0, plan.maxSavedProducts - savedProductsCount);

  return {
    plan,
    savedProductsCount,
    canCreateProduct,
    quotaRemaining,
  };
}
