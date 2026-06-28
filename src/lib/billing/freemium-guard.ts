import { prisma } from '@/lib/core/prisma';
import { SubscriptionTier } from '@prisma/client';

export class FreemiumGuard {
  static async checkUploadQuota(userId: string) {
    const billingProfile = await prisma.billingProfile.findUnique({
      where: { userId },
    });

    const tier = billingProfile?.subscriptionTier || SubscriptionTier.FREE_STARTER;

    // Pro and Agency tiers have no or higher limits (assumed unlimited here)
    if (
      tier === SubscriptionTier.CREATOR_PRO ||
      tier === SubscriptionTier.CLOUD_PRO ||
      tier === SubscriptionTier.AGENCY_PRO ||
      tier === SubscriptionTier.LIFETIME_DEAL
    ) {
      return { allowed: true };
    }

    // Free tier logic: cap at 10 video uploads per month
    const currentMonthStart = new Date();
    currentMonthStart.setDate(1);
    currentMonthStart.setHours(0, 0, 0, 0);

    const uploadsThisMonth = await prisma.postActivity.count({
      where: {
        userId,
        createdAt: {
          gte: currentMonthStart,
        },
      },
    });

    if (uploadsThisMonth >= 10) {
      return {
        allowed: false,
        reason: 'Monthly upload quota exceeded (10 videos on free tier)',
      };
    }

    return { allowed: true };
  }
}
