import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth/server';
import { sql } from '@/lib/db';
import { getUserEntitlements } from '@/lib/entitlements';

export async function GET() {
  try {
    const { data: session } = await auth.getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const entitlements = await getUserEntitlements(userId);

    const rows = await sql`
      SELECT 
        id,
        user_id,
        title,
        category,
        industry_group,
        hsn_code,
        gst_rate,
        is_digital,
        unit_cost,
        selling_price,
        margin_percent,
        saleable_yield,
        batch_input,
        calculation_result,
        created_at,
        updated_at
      FROM products
      WHERE user_id = ${userId}
      ORDER BY updated_at DESC
    `;

    return NextResponse.json({
      products: rows,
      entitlements,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch products';
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
    const entitlements = await getUserEntitlements(userId);

    if (!entitlements.canCreateProduct) {
      return NextResponse.json(
        {
          error: `You have reached the limit of ${entitlements.plan.maxSavedProducts} saved products on the Free Starter plan. Upgrade to Pro for unlimited product costing recipes.`,
          upgradeRequired: true,
        },
        { status: 403 }
      );
    }

    const body = await req.json();
    const title = body.title?.trim() || 'Untitled Product Recipe';
    const category = body.category || 'General';
    const industryGroup = body.industryGroup || 'Candles';
    const hsnCode = body.hsnCode || '';
    const gstRate = Number(body.gstRate) || 0;
    const isDigital = Boolean(body.isDigital);
    const unitCost = Number(body.unitCost) || 0;
    const sellingPrice = Number(body.sellingPrice) || 0;
    const marginPercent = Number(body.marginPercent) || 0;
    const saleableYield = body.saleableYield || '1/1';
    const batchInput = body.batchInput ? JSON.stringify(body.batchInput) : null;
    const calculationResult = body.calculationResult ? JSON.stringify(body.calculationResult) : null;

    const inserted = await sql`
      INSERT INTO products (
        user_id,
        title,
        category,
        industry_group,
        hsn_code,
        gst_rate,
        is_digital,
        unit_cost,
        selling_price,
        margin_percent,
        saleable_yield,
        batch_input,
        calculation_result
      )
      VALUES (
        ${userId},
        ${title},
        ${category},
        ${industryGroup},
        ${hsnCode},
        ${gstRate},
        ${isDigital},
        ${unitCost},
        ${sellingPrice},
        ${marginPercent},
        ${saleableYield},
        ${batchInput}::jsonb,
        ${calculationResult}::jsonb
      )
      RETURNING *
    `;

    return NextResponse.json({ product: inserted[0], success: true }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to save product';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { data: session } = await auth.getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('id');

    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    await sql`
      DELETE FROM products
      WHERE id = ${productId} AND user_id = ${userId}
    `;

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to delete product';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
