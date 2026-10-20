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
        COALESCE(title, name, 'Untitled Product') as title,
        COALESCE(name, title, 'Untitled Product') as name,
        COALESCE(category, industry_group, 'General') as category,
        COALESCE(industry_group, category, 'General') as industry_group,
        COALESCE(hsn_code, '') as hsn_code,
        COALESCE(gst_rate, 0) as gst_rate,
        COALESCE(is_digital, false) as is_digital,
        unit_cost,
        selling_price,
        margin_percent,
        saleable_yield,
        COALESCE(saleable_yield_text, saleable_yield::text) as saleable_yield_text,
        COALESCE(batch_size, 1) as batch_size,
        batch_input,
        calculation_result,
        COALESCE(status, 'active') as status,
        COALESCE(is_archived, false) as is_archived,
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
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while fetching products.' },
      { status: 500 }
    );
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
    const rawTitle = body.title || body.name || 'Untitled Product Recipe';
    const title = String(rawTitle).trim().slice(0, 255);
    const category = String(body.category || body.industryGroup || 'General').trim();
    const industryGroup = String(body.industryGroup || body.category || 'General').trim();
    const hsnCode = String(body.hsnCode || '').trim();
    const gstRate = Math.max(0, Number(body.gstRate) || 0);
    const isDigital = Boolean(body.isDigital);
    const unitCost = Math.max(0, Number(body.unitCost) || 0);
    const sellingPrice = Math.max(0, Number(body.sellingPrice) || 0);
    const marginPercent = Number(body.marginPercent) || 0;
    
    // Parse batchSize and saleableYield safely
    const batchSize = Math.max(1, Number(body.batchSize) || (body.batchInput?.batchSize ? Number(body.batchInput.batchSize) : 10));
    
    let saleableYieldInt = 1;
    let saleableYieldStr = '1';
    if (typeof body.saleableYield === 'number') {
      saleableYieldInt = Math.max(1, Math.round(body.saleableYield));
      saleableYieldStr = `${saleableYieldInt} / ${batchSize}`;
    } else if (typeof body.saleableYield === 'string') {
      saleableYieldStr = body.saleableYield.trim();
      const parsedInt = parseInt(saleableYieldStr, 10);
      saleableYieldInt = !isNaN(parsedInt) && parsedInt > 0 ? parsedInt : 1;
    }

    const batchInput = body.batchInput ? JSON.stringify(body.batchInput) : null;
    const calculationResult = body.calculationResult ? JSON.stringify(body.calculationResult) : null;

    // Defense-in-depth: limit stored JSONB size to 64KB to prevent DB resource exhaustion
    if (batchInput && batchInput.length > 65536) {
      return NextResponse.json({ error: 'Recipe input data exceeds maximum allowable limit (64KB).' }, { status: 400 });
    }
    if (calculationResult && calculationResult.length > 65536) {
      return NextResponse.json({ error: 'Calculation result data exceeds maximum allowable limit (64KB).' }, { status: 400 });
    }

    const inserted = await sql`
      INSERT INTO products (
        user_id,
        name,
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
        saleable_yield_text,
        batch_size,
        batch_input,
        calculation_result
      )
      VALUES (
        ${userId},
        ${title},
        ${title},
        ${category},
        ${industryGroup},
        ${hsnCode},
        ${gstRate},
        ${isDigital},
        ${unitCost},
        ${sellingPrice},
        ${marginPercent},
        ${saleableYieldInt},
        ${saleableYieldStr},
        ${batchSize},
        ${batchInput}::jsonb,
        ${calculationResult}::jsonb
      )
      RETURNING *
    `;

    return NextResponse.json({ product: inserted[0], success: true }, { status: 201 });
  } catch (error: unknown) {
    console.error('Error saving product:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while saving the product recipe.' },
      { status: 500 }
    );
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
    const productId = searchParams.get('id')?.trim();

    if (!productId || productId.length > 128) {
      return NextResponse.json({ error: 'A valid product ID is required.' }, { status: 400 });
    }

    await sql`
      DELETE FROM products
      WHERE id = ${productId} AND user_id = ${userId}
    `;

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while deleting the product recipe.' },
      { status: 500 }
    );
  }
}
