import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/core/prisma';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_123', {
  apiVersion: '2026-06-24.dahlia',
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });
  }

  try {
    const { choice } = await req.json();
    if (choice !== 'CLOUD_PRO' && choice !== 'LIFETIME_DEAL') {
      return NextResponse.json({ error: 'invalid_choice' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        referrals: { include: { billingProfile: true } },
        billingProfile: true
      }
    });

    if (!user) return NextResponse.json({ error: 'user_not_found' }, { status: 404 });

    // Verify 5 active referrals
    const activePaidCount = user.referrals.filter(ref => 
      ref.billingProfile?.subscriptionTier !== 'FREE_STARTER' && 
      ref.billingProfile?.subscriptionStatus === 'ACTIVE'
    ).length;

    if (activePaidCount < 5) return NextResponse.json({ error: 'insufficient_referrals' }, { status: 403 });

    const currentTier = user.billingProfile?.subscriptionTier || 'FREE_STARTER';
    
    // Prevent reclaiming if already claimed
    if (currentTier === 'CLOUD_PRO' || currentTier === 'LIFETIME_DEAL' || user.lifetimeUnlock) {
      return NextResponse.json({ error: 'already_claimed' }, { status: 400 });
    }

    const customerId = user.billingProfile?.providerCustomerId;

    if (customerId) {
      const subscriptions = await stripe.subscriptions.list({ customer: customerId });
      if (choice === 'CLOUD_PRO' && subscriptions.data.length > 0) {
        await stripe.subscriptions.update(
          subscriptions.data[0].id,
          { discounts: [{ coupon: process.env.STRIPE_100_OFF_COUPON || '100_OFF' }] }
        );
      } else if (choice === 'LIFETIME_DEAL') {
        for (const sub of subscriptions.data) {
          await stripe.subscriptions.cancel(sub.id);
        }
      }
    }

    // Update local DB
    await prisma.user.update({
      where: { id: user.id },
      data: {
        lifetimeUnlock: true,
        billingProfile: {
          update: { subscriptionTier: choice }
        }
      }
    });

    return NextResponse.json({ success: true, newTier: choice });
  } catch (error) {
    console.error('Error in redeem endpoint:', error);
    return NextResponse.json({ error: 'internal_error' }, { status: 500 });
  }
}
