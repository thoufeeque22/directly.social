import { prisma } from '@/lib/core/prisma';
import { extractAccountName } from '@/lib/utils/utils';
import { cookies } from 'next/headers';

export async function handleUserCreated(user: any) {
  if (!user.id) return;
  const cookieStore = await cookies();
  const referralCode = cookieStore.get('referralCode')?.value;
  if (referralCode) {
    if (referralCode === user.id) return;
    let referrer = await prisma.user.findUnique({ where: { referralCode: referralCode } });
    if (!referrer) referrer = await prisma.user.findUnique({ where: { id: referralCode } });
    if (referrer) {
      await prisma.user.update({
        where: { id: user.id },
        data: { referredById: referrer.id },
      });
    }
  }
}

export async function handleSocialLinkReward(account: any, profile: any, userId: string | undefined) {
  const accountName = extractAccountName(profile);
  
  if (accountName) {
    await prisma.account.update({
      where: {
        provider_providerAccountId: {
          provider: account.provider,
          providerAccountId: account.providerAccountId,
        },
      },
      data: { accountName },
    });
  }

  if (!userId) return;

  try {
    await prisma.$transaction(async (tx) => {
      const dbUser = await tx.user.findUnique({
        where: { id: userId },
        select: { referredById: true, referralRewardClaimed: true }
      });

      if (!dbUser?.referredById || dbUser.referralRewardClaimed) return;

      await tx.claimedSocialAccount.create({
        data: {
          provider: account.provider,
          providerAccountId: account.providerAccountId,
        }
      });

      await tx.user.update({
        where: { id: userId },
        data: { 
          referralRewardClaimed: true,
          extraPostsQuota: { increment: 1 }
        }
      });

      const referrerProfile = await tx.billingProfile.findUnique({
        where: { userId: dbUser.referredById }
      });
      const tier = referrerProfile?.subscriptionTier || 'FREE_STARTER';
      
      if (tier === 'FREE_STARTER') {
        await tx.user.update({
          where: { id: dbUser.referredById },
          data: { extraPostsQuota: { increment: 1 } }
        });
        await tx.notification.create({
          data: {
            userId: dbUser.referredById as string,
            type: 'SUCCESS',
            message: 'Your friend signed up! You received +1 Extra Post Quota.'
          }
        });
      } else {
        await tx.user.update({
          where: { id: dbUser.referredById },
          data: { aiCredits: { increment: 50 } }
        });
        await tx.notification.create({
          data: {
            userId: dbUser.referredById as string,
            type: 'SUCCESS',
            message: 'Your friend signed up! You received +50 AI Credits.'
          }
        });
      }

      await tx.notification.create({
        data: {
          userId: userId as string,
          type: 'SUCCESS',
          message: 'You received +1 Extra Post Quota for signing up via referral!'
        }
      });
    });
  } catch {
    console.log(`[Referral] Social account ${account.provider} already claimed or error occurred.`);
  }
}
