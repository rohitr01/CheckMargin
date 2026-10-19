import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth/server';
import { sql } from '@/lib/db';
import { getBusinessCategory } from '@/lib/business-categories';

export async function GET() {
  try {
    const { data: session } = await auth.getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const email = session.user.email || '';
    const name = session.user.name || '';

    // Fetch existing profile matching either auth_user_id or neon_user_id
    const existing = await sql`
      SELECT 
        id,
        auth_user_id,
        neon_user_id,
        email,
        display_name,
        business_name,
        COALESCE(primary_industry, primary_category, 'Candles & Fragrance') as primary_industry,
        COALESCE(primary_category, primary_industry, 'Candles & Fragrance') as primary_category,
        COALESCE(business_category_id, 'candles-fragrance') as business_category_id,
        COALESCE(is_custom_category, false) as is_custom_category,
        custom_category_name,
        custom_category_desc,
        custom_product_or_service,
        COALESCE(custom_product_type, 'physical') as custom_product_type,
        COALESCE(plan, 'free') as plan,
        created_at,
        updated_at
      FROM user_profiles
      WHERE auth_user_id = ${userId} OR neon_user_id = ${userId}
      LIMIT 1
    `;

    if (existing.length > 0) {
      return NextResponse.json({ profile: existing[0], user: session.user });
    }

    // Insert new profile record with default Candles & Fragrance
    const inserted = await sql`
      INSERT INTO user_profiles (
        auth_user_id,
        neon_user_id,
        email,
        display_name,
        primary_category,
        primary_industry,
        business_category_id,
        is_custom_category,
        plan
      )
      VALUES (
        ${userId},
        ${userId},
        ${email},
        ${name},
        'Candles & Fragrance',
        'Candles & Fragrance',
        'candles-fragrance',
        false,
        'free'
      )
      ON CONFLICT (auth_user_id) DO UPDATE
      SET neon_user_id = ${userId},
          email = COALESCE(EXCLUDED.email, user_profiles.email),
          updated_at = NOW()
      RETURNING 
        id,
        auth_user_id,
        neon_user_id,
        email,
        display_name,
        business_name,
        COALESCE(primary_industry, primary_category, 'Candles & Fragrance') as primary_industry,
        COALESCE(primary_category, primary_industry, 'Candles & Fragrance') as primary_category,
        COALESCE(business_category_id, 'candles-fragrance') as business_category_id,
        COALESCE(is_custom_category, false) as is_custom_category,
        custom_category_name,
        custom_category_desc,
        custom_product_or_service,
        COALESCE(custom_product_type, 'physical') as custom_product_type,
        COALESCE(plan, 'free') as plan,
        created_at,
        updated_at
    `;

    return NextResponse.json({ profile: inserted[0], user: session.user });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch profile';
    console.error('Error fetching user profile:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { data: session } = await auth.getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const email = session.user.email || '';
    const body = await req.json();

    const displayName = body.displayName?.trim() ?? session.user.name ?? '';
    const businessName = body.businessName?.trim() ?? '';

    // Business category handling
    const rawCategoryId = body.businessCategoryId || body.primaryIndustry;
    const isCustom = Boolean(body.isCustomCategory || rawCategoryId === 'custom');
    const customCategoryName = body.customCategoryName?.trim() || null;
    const customCategoryDesc = body.customCategoryDesc?.trim() || null;
    const customProductOrService = body.customProductOrService?.trim() || null;
    const customProductType =
      body.customProductType === 'digital'
        ? 'digital'
        : body.customProductType === 'service'
        ? 'service'
        : 'physical';

    // Resolve human-readable category name
    let primaryIndustryName = 'General Products';
    let businessCategoryId = 'custom';
    if (isCustom && customCategoryName) {
      primaryIndustryName = customCategoryName;
      businessCategoryId = 'custom';
    } else if (rawCategoryId) {
      const cat = getBusinessCategory(rawCategoryId);
      primaryIndustryName = cat.name;
      businessCategoryId = cat.id;
    }

    const result = await sql`
      INSERT INTO user_profiles (
        auth_user_id,
        neon_user_id,
        email,
        display_name,
        business_name,
        primary_category,
        primary_industry,
        business_category_id,
        is_custom_category,
        custom_category_name,
        custom_category_desc,
        custom_product_or_service,
        custom_product_type,
        plan,
        updated_at
      )
      VALUES (
        ${userId},
        ${userId},
        ${email},
        ${displayName},
        ${businessName},
        ${primaryIndustryName},
        ${primaryIndustryName},
        ${businessCategoryId},
        ${isCustom},
        ${customCategoryName},
        ${customCategoryDesc},
        ${customProductOrService},
        ${customProductType},
        'free',
        NOW()
      )
      ON CONFLICT (auth_user_id) DO UPDATE
      SET neon_user_id = EXCLUDED.neon_user_id,
          display_name = EXCLUDED.display_name,
          business_name = EXCLUDED.business_name,
          primary_category = EXCLUDED.primary_category,
          primary_industry = EXCLUDED.primary_industry,
          business_category_id = EXCLUDED.business_category_id,
          is_custom_category = EXCLUDED.is_custom_category,
          custom_category_name = EXCLUDED.custom_category_name,
          custom_category_desc = EXCLUDED.custom_category_desc,
          custom_product_or_service = EXCLUDED.custom_product_or_service,
          custom_product_type = EXCLUDED.custom_product_type,
          email = COALESCE(NULLIF(EXCLUDED.email, ''), user_profiles.email),
          updated_at = NOW()
      RETURNING 
        id,
        auth_user_id,
        neon_user_id,
        email,
        display_name,
        business_name,
        primary_industry,
        primary_category,
        business_category_id,
        is_custom_category,
        custom_category_name,
        custom_category_desc,
        custom_product_or_service,
        custom_product_type,
        COALESCE(plan, 'free') as plan,
        updated_at
    `;

    return NextResponse.json({ profile: result[0], success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update profile';
    console.error('Error updating user profile:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
