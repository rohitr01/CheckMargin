import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth/server';

export async function POST(req: Request) {
  try {
    const { data: session } = await auth.getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const plan = body.plan === 'annual' ? 'annual' : 'pro';
    const amount = plan === 'annual' ? 249900 : 29900; // in paise (₹2,499 vs ₹299)

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return NextResponse.json({
        configured: false,
        plan,
        amount: amount / 100,
        message: 'Payment gateway configuration pending: RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET must be configured in environment variables to process live card/UPI payments.',
      });
    }

    // In a live environment with configured Razorpay credentials:
    // Create standard order via Razorpay REST API
    const authHeader = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
    const orderRes = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${authHeader}`,
      },
      body: JSON.stringify({
        amount,
        currency: 'INR',
        receipt: `rcpt_${session.user.id.slice(0, 8)}_${Date.now()}`,
        notes: {
          user_id: session.user.id,
          email: session.user.email,
          plan,
        },
      }),
    });

    if (!orderRes.ok) {
      const errData = await orderRes.json();
      return NextResponse.json({ error: errData.error?.description || 'Failed to initiate checkout order' }, { status: 502 });
    }

    const orderData = await orderRes.json();

    return NextResponse.json({
      configured: true,
      keyId,
      orderId: orderData.id,
      amount: orderData.amount,
      currency: orderData.currency,
      user: {
        name: session.user.name,
        email: session.user.email,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Checkout initiation failed';
    console.error('Checkout error:', err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
