import React from 'react';
import { Typography, Stack } from '@mui/material';
import { BRAND } from '@/lib/core/brand';

export const ReferralTermsContent = () => (
  <Stack spacing={4} sx={{ mt: 4 }}>
    <section>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>1. The Program</Typography>
      <Typography variant="body1" gutterBottom>
        The {BRAND.name} Referral Program allows users to earn rewards by inviting others to use the Service.
      </Typography>
    </section>
    
    <section>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>2. Qualified Sign-Ups</Typography>
      <Typography variant="body1" gutterBottom>
        A referral is considered successful (&quot;Qualified Sign-Up&quot;) only when the referred user creates a new account using the referral link AND links at least one authorized third-party social media account (e.g., TikTok, Facebook, Google) to their profile.
      </Typography>
    </section>

    <section>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>3. Tiered Rewards</Typography>
      <Typography variant="body1" gutterBottom>
        Rewards are issued based on the Referrer&apos;s active subscription tier at the time the referred user completes a Qualified Action or Payment:
      </Typography>
      <ul>
        <li><Typography variant="body1"><strong>Free Referrers:</strong> Receive +1 Extra Post Quota for each Qualified Sign-Up.</Typography></li>
        <li><Typography variant="body1"><strong>Paid Referrers:</strong> Receive a $10 Stripe Account Credit when the referred user purchases a paid subscription.</Typography></li>
        <li><Typography variant="body1"><strong>Lifetime Referrers:</strong> Receive +1,000 AI Credits when the referred user purchases a paid subscription.</Typography></li>
      </ul>
    </section>

    <section>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>4. No Cash Value & Anti-Fraud</Typography>
      <Typography variant="body1" gutterBottom>
        Stripe credits and AI Credits have no real-world cash value and cannot be withdrawn or transferred. Self-referrals, creating fake accounts, or gaming the system will result in immediate permanent account termination and forfeiture of all rewards.
      </Typography>
    </section>
  </Stack>
);
