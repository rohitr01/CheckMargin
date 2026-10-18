import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { sql } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    // Signature verification if webhook secret is configured
    if (webhookSecret) {
      const signature = req.headers.get('x-razorpay-signature');
      if (!signature) {
        return NextResponse.json({ error: 'Missing webhook signature' }, { status: 400 });
      }
      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(rawBody)
        .digest('hex');

      if (signature !== expectedSignature) {
        return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 });
      }
    }

    const payload = JSON.parse(rawBody);
    const event = payload.event;

    // Handle subscription events
    if (event === 'subscription.charged' || event === 'payment.captured') {
      const payment = payload.payload?.payment?.entity || payload.payload?.subscription?.entity;
      const email = payment?.email || payment?.notes?.email;
      const planId = payment?.plan_id || payment?.notes?.plan || 'pro';

      if (email) {
        // Upgrade user plan in Neon database
        await sql`
          UPDATE user_profiles
          SET plan = ${planId.includes('annual') ? 'annual' : 'pro'},
              updated_at = NOW()
          WHERE email = ${email}
        `;

        // Record in subscriptions table
        await sql`
          INSERT INTO subscriptions (
            user_id,
            plan,
            status,
            current_period_start,
            current_period_end
          )
          SELECT 
            id,
            ${planId.includes('annual') ? 'annual' : 'pro'},
            'active',
            NOW(),
            NOW() + INTERVAL '1 month'
          FROM user_profiles
          WHERE email = ${email}
          ON CONFLICT DO NOTHING
        `;
      }
    }

    return NextResponse.json({ received: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Webhook error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
