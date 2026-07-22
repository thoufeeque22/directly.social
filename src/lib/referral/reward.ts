import { prisma } from '@/lib/core/prisma';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_123', {
  apiVersion: '2026-06-24.dahlia' as any,
});

export async function processReferralReward(referredUserEmail: string, eventId: string) {
  try {
    await prisma.processedWebhook.create({
      data: { id: eventId, type: 'referral_reward' }
    });
  } catch (error: any) {
    if (error?.code === 'P2002') return;
    throw error;
  }

  const user = await prisma.user.findUnique({
    where: { email: referredUserEmail },
    include: { billingProfile: true }
  });

  if (!user || !user.referredById) return;

  const referrer = await prisma.user.findUnique({
    where: { id: user.referredById },
    include: { billingProfile: true }
  });

  if (!referrer) return;

  const referrerTier = referrer.billingProfile?.subscriptionTier || 'FREE_STARTER';
  const referrerCustomerId = referrer.billingProfile?.providerCustomerId;
  const userCustomerId = user.billingProfile?.providerCustomerId;
  const userSubId = user.billingProfile?.providerSubscriptionId;
  const referrerSubId = referrer.billingProfile?.providerSubscriptionId;

  const coupon = await stripe.coupons.create({
    percent_off: 100,
    duration: 'once',
    name: 'Referral Free Month'
  });

  if (userSubId) {
    await stripe.subscriptions.update(userSubId, { discounts: [{ coupon: coupon.id }] });
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
      await stripe.subscriptions.update(referrerSubId, { discounts: [{ coupon: coupon.id }] });
    }
    await prisma.notification.create({
      data: {
        userId: referrer.id,
        type: 'SUCCESS',
        message: 'Your friend upgraded! You earned 1 Free Month on your subscription.'
      }
    });
  }
}
