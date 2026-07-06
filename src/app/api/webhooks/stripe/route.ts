import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_123', {
  apiVersion: '2026-06-24.dahlia',
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const event = body as Stripe.Event;

    if (event.type === 'invoice.payment_succeeded') {
      const invoice = event.data.object as Stripe.Invoice;
      if (invoice.billing_reason === 'subscription_create' && invoice.customer_email) {
        const user = await prisma.user.findUnique({
          where: { email: invoice.customer_email },
        });

        if (user && user.referredById) {
          const referrer = await prisma.user.findUnique({
            where: { id: user.referredById },
          });

          if (referrer && referrer.email) {
            const customers = await stripe.customers.list({ email: referrer.email, limit: 1 });
            const referrerCustomer = customers.data[0];

            if (referrerCustomer) {
              await stripe.customers.createBalanceTransaction(referrerCustomer.id, {
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

              if (activePaidCount >= 5 && referrerCustomer.id) {
                 const subscriptions = await stripe.subscriptions.list({ customer: referrerCustomer.id });
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
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    return NextResponse.json({ error: 'Webhook failed' }, { status: 400 });
  }
}
