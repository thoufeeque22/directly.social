import { prisma } from '@/lib/core/prisma';
import { stripe } from '@/lib/stripe/client';


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

  static async createCustomerPortalSession(userId: string) {
    const billingProfile = await prisma.billingProfile.findUnique({
      where: { userId },
    });

    if (!billingProfile?.providerCustomerId) {
      throw new Error('No billing profile found');
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: billingProfile.providerCustomerId,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/settings?tab=account`,
    });

    return session.url;
  }
}


