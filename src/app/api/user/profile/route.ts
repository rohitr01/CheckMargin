import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth/server';
import { sql } from '@/lib/db';

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
        COALESCE(primary_industry, primary_category, 'General') as primary_industry,
        COALESCE(primary_category, primary_industry, 'General') as primary_category,
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

    // Insert new profile record with both auth_user_id and neon_user_id populated
    const inserted = await sql`
      INSERT INTO user_profiles (
        auth_user_id,
        neon_user_id,
        email,
        display_name,
        primary_category,
        primary_industry,
        plan
      )
      VALUES (
        ${userId},
        ${userId},
        ${email},
        ${name},
        'General',
        'General',
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
        COALESCE(primary_industry, primary_category, 'General') as primary_industry,
        COALESCE(primary_category, primary_industry, 'General') as primary_category,
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
    const primaryIndustry = body.primaryIndustry?.trim() ?? 'Candles';

    const result = await sql`
      INSERT INTO user_profiles (
        auth_user_id,
        neon_user_id,
        email,
        display_name,
        business_name,
        primary_category,
        primary_industry,
        plan,
        updated_at
      )
      VALUES (
        ${userId},
        ${userId},
        ${email},
        ${displayName},
        ${businessName},
        ${primaryIndustry},
        ${primaryIndustry},
        'free',
        NOW()
      )
      ON CONFLICT (auth_user_id) DO UPDATE
      SET neon_user_id = EXCLUDED.neon_user_id,
          display_name = EXCLUDED.display_name,
          business_name = EXCLUDED.business_name,
          primary_category = EXCLUDED.primary_category,
          primary_industry = EXCLUDED.primary_industry,
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
