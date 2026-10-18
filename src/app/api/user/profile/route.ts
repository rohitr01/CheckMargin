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
    const email = session.user.email;
    const name = session.user.name || '';

    // Fetch existing profile or create one automatically
    const existing = await sql`
      SELECT id, neon_user_id, email, display_name, business_name, primary_industry, plan, created_at, updated_at
      FROM user_profiles
      WHERE neon_user_id = ${userId}
      LIMIT 1
    `;

    if (existing.length > 0) {
      return NextResponse.json({ profile: existing[0], user: session.user });
    }

    // Insert new profile record
    const inserted = await sql`
      INSERT INTO user_profiles (neon_user_id, email, display_name, plan)
      VALUES (${userId}, ${email}, ${name}, 'free')
      RETURNING id, neon_user_id, email, display_name, business_name, primary_industry, plan, created_at, updated_at
    `;

    return NextResponse.json({ profile: inserted[0], user: session.user });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch profile';
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
    const email = session.user.email;
    const body = await req.json();
    const displayName = body.displayName ?? session.user.name ?? '';
    const businessName = body.businessName ?? '';
    const primaryIndustry = body.primaryIndustry ?? 'Candles';

    const result = await sql`
      INSERT INTO user_profiles (neon_user_id, email, display_name, business_name, primary_industry, plan, updated_at)
      VALUES (${userId}, ${email}, ${displayName}, ${businessName}, ${primaryIndustry}, 'free', NOW())
      ON CONFLICT (neon_user_id) DO UPDATE
      SET display_name = EXCLUDED.display_name,
          business_name = EXCLUDED.business_name,
          primary_industry = EXCLUDED.primary_industry,
          updated_at = NOW()
      RETURNING id, neon_user_id, email, display_name, business_name, primary_industry, plan, updated_at
    `;

    return NextResponse.json({ profile: result[0], success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update profile';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
