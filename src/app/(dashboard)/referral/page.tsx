import React from 'react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Box, Typography, Stack, Divider, Paper } from '@mui/material';
import { auth } from '@/auth';
import { prisma } from '@/lib/core/prisma';
import { BRAND } from '@/lib/core/brand';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { ReferralCopier } from '@/components/referral/ReferralCopier';
import { ReferralSquad } from '@/components/referral/ReferralSquad';
import { ReferralProgress } from '@/components/referral/ReferralProgress';
import { headers } from 'next/headers';

export default async function ReferralPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/login');
  }

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
    redirect('/login');
  }

  let referralCode = user.referralCode;
  if (!referralCode) {
    const slugify = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const namePrefix = user.name ? `${slugify(user.name)}-` : '';
    
    let attempts = 0;
    let success = false;
    while (!success && attempts < 3) {
      try {
        const randomSuffix = Math.random().toString(36).substring(2, 2 + 6 + attempts);
        referralCode = `${namePrefix}${randomSuffix}`;
        await prisma.user.update({
          where: { id: user.id },
          data: { referralCode }
        });
        success = true;
      } catch (e: unknown) {
        attempts++;
        if (attempts >= 3) throw e;
      }
    }
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
  
  const headersList = await headers();
  const host = headersList.get('host') || 'directly.social';
  const protocol = host.includes('localhost') ? 'http' : 'https';
  const referralUrl = `${protocol}://${host}/login?ref=${referralCode}`;

  const subscriptionTier = user.billingProfile?.subscriptionTier || 'FREE_STARTER';
  const progressPercent = Math.min((activeCount / 5) * 100, 100);
  const isGrandPrize = activeCount >= 5;

  const isFree = subscriptionTier.startsWith('FREE_');
  const isLifetime = subscriptionTier === 'LIFETIME_DEAL';
  const isCloudPro = subscriptionTier === 'CLOUD_PRO';
  
  const grandPrizeNodes = isFree 
    ? (
      <>
        <Link href="/pricing" style={{ fontWeight: 700, color: 'inherit', textDecoration: 'underline', textDecorationStyle: 'dotted', textUnderlineOffset: '4px' }}>100% Free Cloud Pro</Link>
        {' '}or{' '}
        <Link href="/byok" style={{ fontWeight: 700, color: 'inherit', textDecoration: 'underline', textDecorationStyle: 'dotted', textUnderlineOffset: '4px' }}>Lifetime BYOK</Link>
      </>
    ) : (isLifetime ? (
      <Link href="/byok" style={{ fontWeight: 700, color: 'inherit', textDecoration: 'underline', textDecorationStyle: 'dotted', textUnderlineOffset: '4px' }}>Massive AI Credit Bonuses</Link>
    ) : (
      <>
        <Link href="/pricing" style={{ fontWeight: 700, color: 'inherit', textDecoration: 'underline', textDecorationStyle: 'dotted', textUnderlineOffset: '4px' }}>100% Free Subscription</Link>
        {' '}or{' '}
        <Link href="/byok" style={{ fontWeight: 700, color: 'inherit', textDecoration: 'underline', textDecorationStyle: 'dotted', textUnderlineOffset: '4px' }}>Lifetime BYOK</Link>
      </>
    ));
    
  const grandPrizeReward = isFree 
    ? 'Lifetime BYOK or Cloud Pro'
    : (isLifetime ? 'Massive AI Credits' : (isCloudPro ? 'Cloud Pro Access' : 'Subscription Access'));

  const progressDesc = isFree
    ? 'Get 5 paid referrals for Lifetime BYOK, or maintain 5 active to keep a Pro plan free forever.'
    : (isLifetime
        ? 'You already have Lifetime Access! Every paid referral you bring in grants you a massive +1,000 AI Credits.'
        : 'Get 5 total paid referrals for Lifetime BYOK, or maintain 5 active to keep your current subscription 100% free forever.');

  return (
    <Box sx={{ maxWidth: '800px', mx: 'auto', p: { xs: 2, md: 4 } }}>
      <Paper elevation={0} sx={{ 
        borderRadius: 3, 
        overflow: 'hidden', 
        border: '1px solid', 
        borderColor: 'divider',
        mb: 4
      }}>
        <Box sx={{ 
          background: 'linear-gradient(135deg, rgba(255,107,107,0.1) 0%, rgba(255,142,83,0.1) 100%)',
          pt: 6, pb: 5, px: 4, position: 'relative'
        }}>
          <Stack spacing={2} sx={{ alignItems: 'center', textAlign: 'center' }}>
            <AutoAwesomeIcon sx={{ fontSize: 56, color: '#FF8E53', mb: 1 }} />
            <Typography variant="h3" sx={{ 
              fontWeight: 800,
              background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Give a Month, Get a Month
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '600px', fontWeight: 400 }}>
              Invite friends to {BRAND.name}. 
              Earn extra posts and unlock {grandPrizeNodes}.
            </Typography>
          </Stack>
        </Box>

        <Box sx={{ p: { xs: 3, md: 6 } }}>
          <Stack spacing={5}>
            <ReferralCopier referralUrl={referralUrl} />

            {isFree && (
              <Box sx={{ p: 3, bgcolor: 'action.hover', borderRadius: 2, border: '1px solid', borderColor: 'primary.light' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'primary.main', mb: 1 }}>
                  🚀 Pro Tip: Upgrade to Creator Pro
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 1.5 }}>
                  Upgrade before sharing your link to earn $10 in real statement credits AND 50 AI Credits per referral instead of just post quota!
                </Typography>
                <Typography variant="body1">
                  <a href="/pricing" style={{ color: 'inherit', fontWeight: 'bold' }}>Upgrade Now &rarr;</a>
                </Typography>
              </Box>
            )}

            <ReferralProgress 
              quotaRemaining={user.extraPostsQuota}
              aiCredits={user.aiCredits}
              isFree={isFree}
              isLifetime={isLifetime}
              activeCount={activeCount}
              progressPercent={progressPercent}
              isGrandPrize={isGrandPrize}
              grandPrizeReward={grandPrizeReward}
              progressDesc={progressDesc}
            />

            <Divider />

            <ReferralSquad history={history} />
            
            <Typography variant="body2" color="text.secondary" align="center" sx={{ display: 'block', pt: 2 }}>
              By sharing your link, you agree to our <a href="/referral-terms" style={{ color: 'inherit', textDecoration: 'underline' }}>Referral Program Terms</a>.
            </Typography>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
}
