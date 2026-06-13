import React from 'react';
import { Box, Typography, Stack } from '@mui/material';

export const PrivacyContent = () => (
  <Stack spacing={4} sx={{ mt: 4 }}>
    <section>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>1. Introduction</Typography>
      <Typography variant="body1" gutterBottom>
        Directly Social (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and share information when you use our web and mobile applications (the &quot;Service&quot;).
      </Typography>
    </section>

    <section>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>2. Data We Collect</Typography>
      <Typography variant="body1" gutterBottom>
        We collect information that you provide directly to us, such as when you create an account, connect social media profiles, or upload content. This may include:
      </Typography>
      <ul>
        <li><Typography variant="body1">Name and email address.</Typography></li>
        <li><Typography variant="body1">Profile information (e.g., avatar, bio).</Typography></li>
        <li><Typography variant="body1">Social media account identifiers and authentication tokens (OAuth).</Typography></li>
        <li><Typography variant="body1">Content you upload (e.g., videos, titles, descriptions).</Typography></li>
      </ul>
    </section>

    <section>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>3. Use of Third-Party APIs</Typography>
      <Box sx={{ ml: 2, mb: 2 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }} gutterBottom>Google / YouTube API</Typography>
        <Typography variant="body1" gutterBottom>
          Our application uses Google API Services to allow you to upload videos to your YouTube channel. By using this feature, you agree to be bound by the <a href="https://www.youtube.com/t/terms" target="_blank" rel="noopener noreferrer">YouTube Terms of Service</a> and the <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google Privacy Policy</a>.
        </Typography>
        <Typography variant="body1" sx={{ fontStyle: 'italic', bgcolor: 'action.hover', p: 2, borderRadius: 1, borderLeft: '4px solid', borderColor: 'primary.main' }}>
          <strong>Google API Disclosure:</strong> Directly Social&apos;s use and transfer to any other app of information received from Google APIs will adhere to the <a href="https://developers.google.com/terms/api-services-user-data-policy#limited-use-policy" target="_blank" rel="noopener noreferrer">Google API Services User Data Policy</a>, including the Limited Use requirements.
        </Typography>
      </Box>
      <Box sx={{ ml: 2, mb: 2 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }} gutterBottom>TikTok API</Typography>
        <Typography variant="body1" gutterBottom>
          We use TikTok for Developers APIs to facilitate video posting and account management. We adhere to TikTok&apos;s Developer Terms.
        </Typography>
      </Box>
      <Box sx={{ ml: 2 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }} gutterBottom>Meta (Facebook/Instagram) API</Typography>
        <Typography variant="body1" gutterBottom>
          We use Meta Graph APIs to publish content to your Facebook Pages and Instagram Business accounts.
        </Typography>
      </Box>
    </section>

    <section>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>4. Data Portability & Deletion</Typography>
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }} gutterBottom>Right to Access (Data Export)</Typography>
        <Typography variant="body1" gutterBottom>
          You have the right to access and download a copy of your data at any time. We provide an automated &quot;Export My Data&quot; feature in your Privacy Settings which generates a JSON file containing your profile info, social account metadata, gallery details, activity logs, and templates.
        </Typography>
      </Box>
      <Box>
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }} gutterBottom>Right to Erasure (Account Deletion)</Typography>
        <Typography variant="body1" gutterBottom>
          You can delete your account and all associated data permanently via the &quot;Danger Zone&quot; in your Settings. Once confirmed, your data is immediately purged from our database. This process is automated and irreversible.
        </Typography>
      </Box>
    </section>

    <section>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>5. Contact Us</Typography>
      <Typography variant="body1">If you have any questions, please contact us at:</Typography>
      <Typography variant="body1" sx={{ fontWeight: 700 }}>Email: privacy@directly.social</Typography>
    </section>
  </Stack>
);
