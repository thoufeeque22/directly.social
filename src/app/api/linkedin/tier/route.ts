import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/core/prisma';
import { SubscriptionTier } from '@prisma/client';

const FREE_TIERS = new Set<SubscriptionTier>([SubscriptionTier.FREE_STARTER, SubscriptionTier.FREE_HACKER]);

/**
 * GET /api/linkedin/tier
 * Returns whether the current user has a Pro+ subscription.
 * Used by the LinkedInSection component to decide which card to render.
 */
export async function GET(): Promise<Response> {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ isPro: false }, { status: 401 });
  }

  const billing = await prisma.billingProfile.findUnique({
    where: { userId: session.user.id },
    select: { subscriptionTier: true },
  });

  const tier = billing?.subscriptionTier ?? SubscriptionTier.FREE_STARTER;
  return NextResponse.json({ isPro: !FREE_TIERS.has(tier) });
}
