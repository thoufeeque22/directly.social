import React from 'react';
import { Typography, Stack } from '@mui/material';

export const CookieContent = () => (
  <Stack spacing={4} sx={{ mt: 4 }}>
    <section>
      <Typography variant="h5" gutterBottom fontWeight={600}>1. What Are Cookies</Typography>
      <Typography variant="body1" gutterBottom>
        Cookies are small text files stored on your device to make websites work more efficiently.
      </Typography>
    </section>

    <section>
      <Typography variant="h5" gutterBottom fontWeight={600}>2. How We Use Cookies</Typography>
      <ul>
        <li><Typography variant="body1"><strong>Authentication:</strong> To keep you logged in.</Typography></li>
        <li><Typography variant="body1"><strong>Preferences:</strong> To remember your settings.</Typography></li>
        <li><Typography variant="body1"><strong>Security:</strong> To protect your account.</Typography></li>
      </ul>
    </section>

    <section>
      <Typography variant="h5" gutterBottom fontWeight={600}>3. Contact Us</Typography>
      <Typography variant="body1">If you have any questions, please contact us at:</Typography>
      <Typography variant="body1" fontWeight={700}>Email: privacy@directly.social</Typography>
    </section>
  </Stack>
);
