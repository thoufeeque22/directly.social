import React from 'react';
import { Typography, Stack } from '@mui/material';

export const CookieContent = () => (
  <Stack spacing={4} sx={{ mt: 4 }}>
    <section>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>1. Our Commitment to Privacy</Typography>
      <Typography variant="body1" gutterBottom>
        At Directly Social, we believe in a banner-free experience. We do not use non-essential tracking cookies, marketing cookies, or third-party analytics cookies that require a consent banner.
      </Typography>
    </section>

    <section>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>2. Essential Cookies Only</Typography>
      <Typography variant="body1" gutterBottom>
        We only use &quot;Strictly Necessary&quot; cookies to provide our service:
      </Typography>
      <ul>
        <li><Typography variant="body1"><strong>Authentication:</strong> Securely keeping you logged into your account (Next-Auth).</Typography></li>
        <li><Typography variant="body1"><strong>Security:</strong> Protecting the integrity of your session and preventing CSRF attacks.</Typography></li>
      </ul>
    </section>

    <section>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>3. Anonymous Telemetry</Typography>
      <Typography variant="body1" gutterBottom>
        We track aggregate feature usage (e.g., how many videos were posted today) using an anonymous server-side counter. This data is not linked to your user identity and does not use cookies.
      </Typography>
    </section>

    <section>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>4. Contact Us</Typography>
      <Typography variant="body1">If you have any questions, please contact us at:</Typography>
      <Typography variant="body1" sx={{ fontWeight: 700 }}>Email: privacy@directly.social</Typography>
    </section>
  </Stack>
);
