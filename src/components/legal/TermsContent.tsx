import React from 'react';
import { Typography, Stack, Link } from '@mui/material';

import { CONTACT_EMAILS } from '@/lib/core/emails';
import { BRAND } from '@/lib/core/brand';

export const TermsContent = () => (
  <Stack spacing={4} sx={{ mt: 4 }}>
    <section>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>1. Acceptance of Terms</Typography>
      <Typography variant="body1" gutterBottom>
        By accessing or using {BRAND.name} (the &quot;Service&quot;), you agree to be bound by these Terms of Service.
      </Typography>
      <Typography variant="body1" gutterBottom>
        {BRAND.name} is operated by {BRAND.legal.owner}.
      </Typography>
    </section>

    <section>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>2. Description of Service</Typography>
      <Typography variant="body1" gutterBottom>
        {BRAND.name} is a distribution platform that allows users to manage and post content to various social media platforms.
      </Typography>
    </section>

    <section>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>3. Subscriptions and Payments</Typography>
      <Typography variant="body1" gutterBottom>
        Certain features of the Service may require a paid subscription. Payments are processed securely through our third-party payment provider, Stripe. By subscribing, you agree to Stripe&apos;s terms and to provide valid billing information. All fees are non-refundable unless otherwise required by law.
      </Typography>
    </section>

    <section>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>4. Third-Party Platforms</Typography>
      <Typography variant="body1" gutterBottom>
        Our Service interacts with third-party platforms. By connecting your accounts, you agree to comply with:
      </Typography>
      <ul>
        <li><Typography variant="body1"><a href="https://www.youtube.com/t/terms" target="_blank" rel="noopener noreferrer">YouTube Terms of Service</a></Typography></li>
        <li><Typography variant="body1"><a href="https://www.tiktok.com/legal/terms-of-service" target="_blank" rel="noopener noreferrer">TikTok Terms of Service</a></Typography></li>
        <li><Typography variant="body1"><a href="https://www.facebook.com/terms.php" target="_blank" rel="noopener noreferrer">Meta Terms of Service</a></Typography></li>
        <li><Typography variant="body1"><a href="https://stripe.com/legal/end-users" target="_blank" rel="noopener noreferrer">Stripe Terms of Service</a></Typography></li>
      </ul>
    </section>

    <section>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>5. Prohibited Activities</Typography>
      <Typography variant="body1" gutterBottom>
        You agree NOT to: post illegal content, use the Service for spam, or bypass security features.
      </Typography>
    </section>

    <section>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>6. Referral Program</Typography>
      <Typography variant="body1" gutterBottom>
        Referral rewards are discretionary and depend on successful non-refunded payments.
        Rewards are subject to revocation in cases of fraud or chargebacks.
        The Grand Prize (100% Free Cloud Pro) requires maintaining exactly 5 active paid referrals.
        We reserve the right to modify, suspend, or terminate the Referral Program at any time without prior notice.
      </Typography>
    </section>

    <section>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>7. Contact Us</Typography>
      <Typography variant="body1">If you have any questions, please contact us at:</Typography>
      <Typography variant="body1">
        Email:{' '}
        <Link href={`mailto:${CONTACT_EMAILS.legal}`} sx={{ fontWeight: 700 }}>
          {CONTACT_EMAILS.legal}
        </Link>
      </Typography>
    </section>
  </Stack>
);
