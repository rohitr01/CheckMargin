import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { sql } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    // Fail-closed signature verification: webhook secret is mandatory
    if (!webhookSecret) {
      console.error('CRITICAL: RAZORPAY_WEBHOOK_SECRET is not configured on the server. Rejecting webhook.');
      return NextResponse.json(
        { error: 'Webhook processing unavailable: signing secret not configured' },
        { status: 500 }
      );
    }

    const signature = req.headers.get('x-razorpay-signature');
    if (!signature) {
      return NextResponse.json({ error: 'Missing required x-razorpay-signature header' }, { status: 400 });
    }

    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(rawBody)
      .digest('hex');

    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
      return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 });
    }

    const payload = JSON.parse(rawBody);
    const event = payload.event;

    // Handle subscription & payment capture events
    if (event === 'subscription.charged' || event === 'payment.captured' || event === 'order.paid') {
      const entity = payload.payload?.payment?.entity || payload.payload?.subscription?.entity || payload.payload?.order?.entity;
      const email = entity?.email || entity?.notes?.email;
      const userId = entity?.notes?.user_id;
      const rawPlan = entity?.notes?.plan || entity?.plan_id || 'pro';
      const isAnnual = String(rawPlan).toLowerCase().includes('annual');
      const targetPlan = isAnnual ? 'annual' : 'pro';
      const periodInterval = isAnnual ? "INTERVAL '1 year'" : "INTERVAL '1 month'";

      if (email || userId) {
        // Upgrade user plan in user_profiles
        if (userId) {
          await sql`
            UPDATE user_profiles
            SET plan = ${targetPlan},
                updated_at = NOW()
            WHERE auth_user_id = ${userId} OR neon_user_id = ${userId}
          `;
        } else if (email) {
          await sql`
            UPDATE user_profiles
            SET plan = ${targetPlan},
                updated_at = NOW()
            WHERE email = ${email}
          `;
        }

        // Record or update in subscriptions table
        const matchingProfile = await sql`
          SELECT auth_user_id, neon_user_id
          FROM user_profiles
          WHERE (${userId}::text IS NOT NULL AND (auth_user_id = ${userId} OR neon_user_id = ${userId}))
             OR (${email}::text IS NOT NULL AND email = ${email})
          LIMIT 1
        `;

        const subUserId = matchingProfile[0]?.auth_user_id || matchingProfile[0]?.neon_user_id || userId;

        if (subUserId) {
          const providerSubId = entity?.id || `sub_${Date.now()}`;
          const periodEnd = isAnnual
            ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
            : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

          await sql`
            INSERT INTO subscriptions (
              user_id,
              plan_id,
              plan,
              status,
              provider,
              provider_subscription_id,
              current_period_start,
              current_period_end,
              updated_at
            )
            VALUES (
              ${subUserId},
              ${targetPlan},
              ${targetPlan},
              'active',
              'razorpay',
              ${providerSubId},
              NOW(),
              ${periodEnd.toISOString()},
              NOW()
            )
          `;
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Webhook error';
    console.error('Billing webhook error:', err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
