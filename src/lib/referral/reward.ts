import { prisma } from '@/lib/core/prisma';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_123', {
  apiVersion: '2026-06-24.dahlia',
});

export async function processReferralReward(referredUserEmail: string, eventId: string, paymentAmount?: number, currency?: string) {
  try {
    await prisma.processedWebhook.create({
      data: { id: eventId, type: 'referral_reward' }
    });
  } catch (error: any) {
    if (error.code === 'P2002') {
      // Event already processed, ignore to prevent replay attack
      return;
    }
    throw error;
  }

  const user = await prisma.user.findUnique({
    where: { email: referredUserEmail },
  });

  if (!user || !user.referredById) return;

  const referrer = await prisma.user.findUnique({
    where: { id: user.referredById },
    include: { billingProfile: true }
  });

  if (!referrer) return;

  const referrerTier = referrer.billingProfile?.subscriptionTier || 'FREE_STARTER';
  const customerId = referrer.billingProfile?.providerCustomerId;

  // Reward Logic
  if (referrerTier === 'LIFETIME_DEAL') {
    await prisma.user.update({
      where: { id: referrer.id },
      data: { aiCredits: { increment: 1000 } }
    });
  } else if (referrerTier === 'FREE_STARTER') {
    await prisma.user.update({
      where: { id: referrer.id },
      data: { extraPostsQuota: { increment: 1 } }
    });
  } else if (customerId && paymentAmount && currency) {
    // Paid tiers with a customer ID
    await stripe.customers.createBalanceTransaction(customerId, {
      amount: -paymentAmount,
      currency: currency,
      description: `Referral Bonus`,
    }, {
      idempotencyKey: `reward_${eventId}`
    });
  }

  // Grand Prize Tracking
  const historicalPaidCount = await prisma.user.count({
    where: { 
      referredById: referrer.id,
      billingProfile: {
        is: { subscriptionTier: { not: 'FREE_STARTER' } }
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

  if (activePaidCount >= 5 && customerId) {
    const subscriptions = await stripe.subscriptions.list({ customer: customerId });
    if (subscriptions.data.length > 0) {
      await stripe.subscriptions.update(
        subscriptions.data[0].id,
        { discounts: [{ coupon: process.env.STRIPE_100_OFF_COUPON || '100_OFF' }] }
      );
    }
  }
}
