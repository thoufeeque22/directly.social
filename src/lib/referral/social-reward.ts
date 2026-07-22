/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from '@/lib/core/prisma';
import { extractAccountName } from '@/lib/utils/utils';
import { cookies } from 'next/headers';

export async function handleUserCreated(user: any) {
  if (!user.id) return;
  const cookieStore = await cookies();
  const refCode = cookieStore.get('referralCode')?.value;
  if (!refCode || refCode === user.id) return;
  
  const referrer = await prisma.user.findFirst({
    where: { OR: [{ referralCode: refCode }, { id: refCode }] }
  });
  
  if (referrer) {
    await prisma.user.update({
      where: { id: user.id },
      data: { referredById: referrer.id }
    });
  }
}

export async function handleSocialLinkReward(account: any, profile: any, userId?: string) {
  const accountName = extractAccountName(profile);
  if (accountName) {
    await prisma.account.update({
      where: { provider_providerAccountId: { provider: account.provider, providerAccountId: account.providerAccountId } },
      data: { accountName },
    });
  }

  if (!userId) return;

  try {
    await prisma.$transaction(async (tx) => {
      const dbUser = await tx.user.findUnique({
        where: { id: userId },
        select: { referredById: true, referralRewardClaimed: true, emailVerified: true }
      });

      if (!dbUser?.referredById || dbUser.referralRewardClaimed || !dbUser.emailVerified) return;

      const claimedCount = await tx.user.count({
        where: { referredById: dbUser.referredById, referralRewardClaimed: true }
      });
      if (claimedCount >= 5) return;

      await tx.claimedSocialAccount.create({
        data: { provider: account.provider, providerAccountId: account.providerAccountId }
      });

      await tx.user.update({
        where: { id: userId },
        data: { referralRewardClaimed: true, extraPostsQuota: { increment: 1 } }
      });

      const rProfile = await tx.billingProfile.findUnique({ where: { userId: dbUser.referredById } });
      const isFree = (rProfile?.subscriptionTier || 'FREE_STARTER') === 'FREE_STARTER';

      await tx.user.update({
        where: { id: dbUser.referredById },
        data: isFree ? { extraPostsQuota: { increment: 1 } } : { aiCredits: { increment: 50 } }
      });

      await tx.notification.createMany({
        data: [
          { userId: dbUser.referredById, type: 'SUCCESS', message: isFree ? 'Your friend signed up! You received +1 Extra Post Quota.' : 'Your friend signed up! You received +50 AI Credits.' },
          { userId, type: 'SUCCESS', message: 'You received +1 Extra Post Quota for signing up via referral!' }
        ]
      });
    });
  } catch {
    console.log(`[Referral] Social account ${account.provider} already claimed or error occurred.`);
  }
}
