import { prisma } from '@/lib/core/prisma';
import { stripe } from '@/lib/stripe/client';
import type Stripe from 'stripe';
import { SubscriptionTier, SubscriptionStatus } from '@prisma/client';

export class SubscriptionService {
  static async createCheckoutSession(userId: string, userEmail: string, tierId: string) {
    // Configuration mapping
    const envKey = `STRIPE_PRICE_ID_${tierId.replace('-', '_').toUpperCase()}`;
    const priceId = process.env[envKey];
    if (!priceId) {
      throw new Error(`Invalid tier configuration for ${tierId}`);
    }

    // Get or create billing profile
    let billingProfile = await prisma.billingProfile.findUnique({
      where: { userId },
    });

    if (!billingProfile) {
      const customer = await stripe.customers.create({
        email: userEmail,
        metadata: { userId },
      });
      
      billingProfile = await prisma.billingProfile.create({
        data: {
          userId,
          providerCustomerId: customer.id,
        },
      });
    }

    // Create Stripe Session
    const session = await stripe.checkout.sessions.create({
      customer: billingProfile.providerCustomerId,
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: tierId === 'lifetime-deal' ? 'payment' : 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/settings?tab=account&success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/pricing?canceled=true`,
      metadata: { userId, tierId },
    });

    return session.url;
  }
}

export class WebhookStrategyRegistry {
  private strategies: Record<string, (event: Stripe.Event) => Promise<void>> = {};

  register(eventType: string, handler: (event: Stripe.Event) => Promise<void>) {
    this.strategies[eventType] = handler;
  }

  async handle(event: Stripe.Event) {
    const handler = this.strategies[event.type];
    if (handler) {
      await handler(event);
    } else {
      console.log(`[STRIPE_WEBHOOK] Unhandled event type: ${event.type}`);
    }
  }
}

export const webhookRegistry = new WebhookStrategyRegistry();

webhookRegistry.register('checkout.session.completed', async (event: Stripe.Event) => {
  const session = event.data.object as Stripe.Checkout.Session;
  if (session.metadata?.userId) {
    const userId = session.metadata.userId;
    const tierId = session.metadata.tierId;
    const subscriptionId = session.subscription as string | null;

    let tierEnum: SubscriptionTier = SubscriptionTier.FREE_STARTER;
    if (tierId === 'creator-pro') tierEnum = SubscriptionTier.CREATOR_PRO;
    if (tierId === 'cloud-pro') tierEnum = SubscriptionTier.CLOUD_PRO;
    if (tierId === 'power-pass') tierEnum = SubscriptionTier.POWER_PASS;
    if (tierId === 'lifetime-deal') tierEnum = SubscriptionTier.LIFETIME_DEAL;

    await prisma.billingProfile.update({
      where: { userId },
      data: {
        providerSubscriptionId: subscriptionId,
        subscriptionTier: tierEnum,
        subscriptionStatus: SubscriptionStatus.ACTIVE,
      },
    });
  }
});

webhookRegistry.register('invoice.payment_succeeded', async (event: Stripe.Event) => {
  const invoice = event.data.object as Stripe.Invoice & { subscription?: string };
  if (invoice.subscription) {
    const subscriptionId = invoice.subscription as string;
    const subscription = await stripe.subscriptions.retrieve(subscriptionId) as any;
    
    await prisma.billingProfile.updateMany({
      where: { providerSubscriptionId: subscriptionId },
      data: {
        subscriptionStatus: SubscriptionStatus.ACTIVE,
        subscriptionPeriodEnd: new Date(subscription.current_period_end * 1000),
      },
    });
  }
});

webhookRegistry.register('customer.subscription.deleted', async (event: Stripe.Event) => {
  const subscription = event.data.object as any;
  await prisma.billingProfile.updateMany({
    where: { providerSubscriptionId: subscription.id },
    data: {
      subscriptionStatus: SubscriptionStatus.CANCELED,
    },
  });
});
