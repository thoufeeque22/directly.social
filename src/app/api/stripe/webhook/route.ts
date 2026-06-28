import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/client';
import { webhookRegistry } from '@/lib/billing/webhook-registry';

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = req.headers.get('Stripe-Signature');

    if (!signature) {
      return NextResponse.json({ error: 'Missing Stripe signature' }, { status: 400 });
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error('Missing STRIPE_WEBHOOK_SECRET environment variable.');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    let event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`Webhook signature verification failed. ${message}`);
      return NextResponse.json({ error: `Webhook Error: ${message}` }, { status: 400 });
    }

    await webhookRegistry.handle(event);

    return NextResponse.json({ received: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('[STRIPE_WEBHOOK]', message);
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
  }
}
