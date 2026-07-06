import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_123', {
  apiVersion: '2026-06-24.dahlia', // Matches existing project config
});

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('stripe-signature');
    
    let event: Stripe.Event;

    // In E2E test mode, we allow unsigned JSON payload injection
    if (process.env.NEXT_PUBLIC_E2E === 'true' && !signature) {
      event = JSON.parse(rawBody) as Stripe.Event;
    } else {
      if (!signature) {
        return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
      }
      
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
      if (!webhookSecret) {
        throw new Error('CRITICAL: STRIPE_WEBHOOK_SECRET is not set');
      }

      try {
        event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
      } catch (err: unknown) {
         const message = err instanceof Error ? err.message : String(err);
         console.error('Webhook signature verification failed:', message);
         return NextResponse.json({ error: `Webhook Error: ${message}` }, { status: 400 });
      }
    }

    if (event.type === 'invoice.payment_succeeded') {
      const invoice = event.data.object as Stripe.Invoice;
      if (invoice.billing_reason === 'subscription_create' && invoice.customer_email) {
        const user = await prisma.user.findUnique({
          where: { email: invoice.customer_email },
        });

        if (user && user.referredById) {
          const referrer = await prisma.user.findUnique({
            where: { id: user.referredById },
            include: { billingProfile: true }
          });

          if (referrer && referrer.billingProfile?.providerCustomerId) {
            const customerId = referrer.billingProfile.providerCustomerId;

            // Issue Stripe Credit to Referrer
            await stripe.customers.createBalanceTransaction(customerId, {
              amount: -invoice.total,
              currency: invoice.currency,
              description: `Referral bonus for ${user.email}`,
            });

            const historicalPaidCount = await prisma.user.count({
              where: { 
                referredById: referrer.id,
                billingProfile: {
                  is: {
                    subscriptionTier: { not: 'FREE_STARTER' }
                  }
                }
              },
            });

            const activePaidCount = await prisma.user.count({
              where: { 
                referredById: referrer.id,
                billingProfile: {
                  is: {
                    subscriptionStatus: 'ACTIVE',
                    subscriptionTier: { not: 'FREE_STARTER' }
                  }
                }
              },
            });

            if (historicalPaidCount >= 5) {
              await prisma.user.update({
                where: { id: referrer.id },
                data: { lifetimeUnlock: true }
              });
            }

            if (activePaidCount >= 5) {
               const subscriptions = await stripe.subscriptions.list({ customer: customerId });
               if (subscriptions.data.length > 0) {
                  await stripe.subscriptions.update(
                    subscriptions.data[0].id,
                    { discounts: [{ coupon: process.env.STRIPE_100_OFF_COUPON || '100_OFF' }] }
                  );
               }
            }
          }
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Webhook failed:', message);
    return NextResponse.json({ error: 'Webhook failed' }, { status: 400 });
  }
}
