import React from 'react';
import { Typography, Stack, Link } from '@mui/material';

import { CONTACT_EMAILS } from '@/lib/core/emails';
import { BRAND } from '@/lib/core/brand';

export const CookieContent = () => (
  <Stack spacing={4} sx={{ mt: 4 }}>
    <section>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>1. Strictly Necessary Cookies</Typography>
      <Typography variant="body1" gutterBottom>
        {BRAND.name} only uses cookies that are strictly necessary for the Service to function. We do not use any non-essential, tracking, or advertising cookies.
      </Typography>
    </section>

    <section>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>2. How We Use Cookies</Typography>
      <ul>
        <li><Typography variant="body1"><strong>Authentication:</strong> To securely keep you logged in to your account.</Typography></li>
        <li><Typography variant="body1"><strong>Security & Fraud Prevention:</strong> To protect your data, secure payments, and prevent fraud (via Stripe).</Typography></li>
        <li><Typography variant="body1"><strong>Diagnostics:</strong> To monitor service health and track technical errors securely (via Sentry).</Typography></li>
        <li><Typography variant="body1"><strong>Preferences:</strong> To remember basic interface settings you have chosen.</Typography></li>
      </ul>
    </section>

    <section>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>3. No Advertising Tracking</Typography>
      <Typography variant="body1">
        We do not use third-party advertising cookies or marketing pixels. Your activity on {BRAND.name} is not tracked for advertising or marketing purposes. The only third-party cookies we use are strictly necessary for processing payments securely (Stripe) and monitoring application stability (Sentry).
      </Typography>
    </section>

    <section>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>4. Contact Us</Typography>
      <Typography variant="body1">If you have any questions, please contact us at:</Typography>
      <Typography variant="body1">
        Email:{' '}
        <Link href={`mailto:${CONTACT_EMAILS.privacy}`} sx={{ fontWeight: 700 }}>
          {CONTACT_EMAILS.privacy}
        </Link>
      </Typography>
    </section>
  </Stack>
);
