import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/core/prisma';

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        referrals: {
          include: { billingProfile: true }
        },
        billingProfile: true
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    let referralCode = user.referralCode;
    if (!referralCode) {
      // Fallback for existing users created before this feature
      const { nanoid } = await import('nanoid');
      referralCode = nanoid(8);
      await prisma.user.update({
        where: { id: user.id },
        data: { referralCode }
      });
    }

    const history = user.referrals.map(ref => {
      const isPaid = ref.billingProfile && ref.billingProfile.subscriptionTier !== 'FREE_STARTER';
      const isActive = ref.billingProfile?.subscriptionStatus === 'ACTIVE';
      
      let status = 'Free';
      if (isPaid) {
        status = isActive ? 'Active' : 'Churned';
      }
      
      const obfuscated = ref.email ? `${ref.email[0]}***@${ref.email.split('@')[1]}` : 'Unknown';
      
      return { email: obfuscated, status };
    });

    const activeCount = history.filter(h => h.status === 'Active').length;
    
    // Construct absolute URL for referral link
    const host = req.headers.get('host') || 'directly.social';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const referralUrl = `${protocol}://${host}/login?ref=${referralCode}`;

    return NextResponse.json({
      referralUrl,
      activeCount,
      quotaRemaining: user.extraPostsQuota,
      history,
      subscriptionTier: user.billingProfile?.subscriptionTier || 'FREE_STARTER'
    });

  } catch (error) {
    console.error('Error fetching referral stats:', error);
    return NextResponse.json({ error: 'internal_error' }, { status: 500 });
  }
}
