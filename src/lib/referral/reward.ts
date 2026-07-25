import { prisma } from '@/lib/core/prisma';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_123', {
  apiVersion: '2026-06-24.dahlia',
});

export async function processReferralReward(referredUserEmail: string, eventId: string) {
  try {
    await prisma.processedWebhook.create({
      data: { id: eventId, type: 'referral_reward' }
    });
  } catch (error: unknown) {
    const err = error as { code?: string };
    if (err?.code === 'P2002') return;
    throw error;
  }

  const user = await prisma.user.findUnique({
    where: { email: referredUserEmail },
    include: { billingProfile: true }
  });

  if (!user || !user.referredById || user.purchaseRewardClaimed) return;

  const referrer = await prisma.user.findUnique({
    where: { id: user.referredById },
    include: { billingProfile: true }
  });

  if (!referrer) return;

  const referrerTier = referrer.billingProfile?.subscriptionTier || 'FREE_STARTER';
  const userSubId = user.billingProfile?.providerSubscriptionId;
  const referrerSubId = referrer.billingProfile?.providerSubscriptionId;

  if (userSubId) {
    const userCoupon = await stripe.coupons.create({
      percent_off: 100,
      duration: 'repeating',
      duration_in_months: 1,
      max_redemptions: 1,
      name: 'Referral Free Month'
    });
    await stripe.subscriptions.update(userSubId, { discounts: [{ coupon: userCoupon.id }] });
  }

  await prisma.notification.create({
    data: {
      userId: user.id,
      type: 'SUCCESS',
      message: 'Your 1 Free Month referral bonus has been applied to your subscription!'
    }
  });

  await prisma.user.update({
    where: { id: referrer.id },
    data: { earnedFreeMonths: { increment: 1 } }
  });

  if (referrerTier === 'LIFETIME_DEAL') {
    await prisma.user.update({
      where: { id: referrer.id },
      data: { aiCredits: { increment: 1000 } }
    });
    await prisma.notification.create({
      data: {
        userId: referrer.id,
        type: 'SUCCESS',
        message: 'Your friend upgraded! You earned 1000 AI Credits.'
      }
    });
  } else {
    if (referrerSubId) {
      const referrerCoupon = await stripe.coupons.create({
        percent_off: 100,
        duration: 'repeating',
        duration_in_months: 1,
        max_redemptions: 1,
        name: 'Referral Free Month'
      });
      await stripe.subscriptions.update(referrerSubId, { discounts: [{ coupon: referrerCoupon.id }] });
    }
    await prisma.notification.create({
      data: {
        userId: referrer.id,
        type: 'SUCCESS',
        message: 'Your friend upgraded! You earned 1 Free Month on your subscription.'
      }
    });
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { purchaseRewardClaimed: true }
  });
}
