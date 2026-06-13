import React from 'react';
import { Typography, Stack } from '@mui/material';

export const TermsContent = () => (
  <Stack spacing={4} sx={{ mt: 4 }}>
    <section>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>1. Acceptance of Terms</Typography>
      <Typography variant="body1" gutterBottom>
        By accessing or using Directly Social (the &quot;Service&quot;), you agree to be bound by these Terms of Service.
      </Typography>
    </section>

    <section>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>2. Description of Service</Typography>
      <Typography variant="body1" gutterBottom>
        Directly Social is a distribution platform that allows users to manage and post content to various social media platforms.
      </Typography>
    </section>

    <section>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>3. Third-Party Platforms</Typography>
      <Typography variant="body1" gutterBottom>
        Our Service interacts with third-party platforms. By connecting your accounts, you agree to comply with:
      </Typography>
      <ul>
        <li><Typography variant="body1"><a href="https://www.youtube.com/t/terms" target="_blank" rel="noopener noreferrer">YouTube Terms of Service</a></Typography></li>
        <li><Typography variant="body1"><a href="https://www.tiktok.com/legal/terms-of-service" target="_blank" rel="noopener noreferrer">TikTok Terms of Service</a></Typography></li>
        <li><Typography variant="body1"><a href="https://www.facebook.com/terms.php" target="_blank" rel="noopener noreferrer">Meta Terms of Service</a></Typography></li>
      </ul>
    </section>

    <section>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>4. Prohibited Activities</Typography>
      <Typography variant="body1" gutterBottom>
        You agree NOT to: post illegal content, use the Service for spam, or bypass security features.
      </Typography>
    </section>

    <section>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>5. Contact Us</Typography>
      <Typography variant="body1">If you have any questions, please contact us at:</Typography>
      <Typography variant="body1" sx={{ fontWeight: 700 }}>Email: legal@directly.social</Typography>
    </section>
  </Stack>
);
