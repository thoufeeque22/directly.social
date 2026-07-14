/* eslint-disable max-lines */
import React from 'react';
import { Box, Typography, Stack, Link } from '@mui/material';

import { CONTACT_EMAILS } from '@/lib/core/emails';
import { BRAND } from '@/lib/core/brand';

export const PrivacyContent = () => (
  <Stack spacing={4} sx={{ mt: 4 }}>
    <section>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>1. Introduction</Typography>
      <Typography variant="body1" gutterBottom>
        {BRAND.name} (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and share information when you use our web and mobile applications (the &quot;Service&quot;).
      </Typography>
      <Typography variant="body1" gutterBottom>
        {BRAND.name} is operated by {BRAND.legal.owner}.
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
        <li><Typography variant="body1">Billing information (processed securely by our payment provider, Stripe).</Typography></li>
        <li><Typography variant="body1">Social media account identifiers and authentication tokens (OAuth).</Typography></li>
        <li><Typography variant="body1">Content you upload (e.g., videos, titles, descriptions).</Typography></li>
        <li><Typography variant="body1">Diagnostic data (e.g., IP addresses, crash logs, and device info used strictly for error tracking via Sentry).</Typography></li>
      </ul>
    </section>

    <section>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>3. Use of Third-Party APIs</Typography>
      <Box sx={{ ml: 2, mb: 2 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }} gutterBottom>Google / YouTube API Services Data Handling</Typography>
        <Typography variant="body1" gutterBottom>
          Our application uses Google API Services (specifically YouTube APIs) to allow you to upload videos directly to your YouTube channel. By using this feature, you agree to be bound by the <a href="https://www.youtube.com/t/terms" target="_blank" rel="noopener noreferrer">YouTube Terms of Service</a> and the <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google Privacy Policy</a>.
        </Typography>
        <Typography variant="body1" gutterBottom sx={{ mt: 2 }}>
          <strong>1. Data Access:</strong> We request access to your YouTube account solely to upload media files (videos) on your behalf and to read basic channel information necessary to confirm successful uploads.
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>2. Data Use:</strong> The raw and derived Google user data accessed by our application is used strictly to provide the core user-facing feature of publishing your scheduled content to your YouTube channel.
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>3. Data Transfer:</strong> We do not transfer or share your Google user data with any third parties, data brokers, or advertisers. Data is solely transmitted securely between your device, our servers, and Google APIs.
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>4. Data Protection:</strong> All Google user data, including OAuth tokens, is encrypted in transit using industry-standard TLS/SSL and encrypted at rest in our secure database.
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>5. Data Retention & Deletion:</strong> We retain your authentication tokens only as long as your account is active to facilitate scheduled publishing. Upon account deletion or disconnecting your YouTube account, all associated Google user data and tokens are immediately and permanently deleted from our systems.
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>6. Prohibited Data Use & Transfer:</strong> We expressly prohibit the use of your raw, aggregated, or anonymized Google user data for targeted advertising, lending purposes, or sale to third parties.
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>7. AI/ML Model Training Restrictions:</strong> Raw and aggregated Google user data is strictly prohibited from being used to develop, improve, or train any generalized Artificial Intelligence (AI) or Machine Learning (ML) models. We do not transfer Google user data to any third-party AI/ML services for model training purposes.
        </Typography>
        <Typography variant="body1" sx={{ fontStyle: 'italic', bgcolor: 'action.hover', p: 2, borderRadius: 1, borderLeft: '4px solid', borderColor: 'primary.main', mt: 2 }}>
          <strong>Google API Disclosure:</strong> The use of raw or derived user data received from Workspace APIs will adhere to the <a href="https://developers.google.com/terms/api-services-user-data-policy#limited-use-policy" target="_blank" rel="noopener noreferrer">Google API Services User Data Policy</a>, including the Limited Use requirements.
        </Typography>
      </Box>
      <Box sx={{ ml: 2, mb: 2 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }} gutterBottom>TikTok API</Typography>
        <Typography variant="body1" gutterBottom>
          We use TikTok for Developers APIs to facilitate video posting and account management. We adhere to TikTok&apos;s Developer Terms.
        </Typography>
      </Box>
      <Box sx={{ ml: 2, mb: 2 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }} gutterBottom>Meta (Facebook/Instagram) API</Typography>
        <Typography variant="body1" gutterBottom>
          We use Meta Graph APIs to publish content to your Facebook Pages and Instagram Business accounts.
        </Typography>
      </Box>
      <Box sx={{ ml: 2, mb: 2 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }} gutterBottom>AI Content Enhancement</Typography>
        <Typography variant="body1" gutterBottom>
          To provide AI-assisted content generation (e.g., generating descriptions and hashtags), we transmit relevant video metadata and styling prompts to trusted AI providers (such as OpenAI, Google, Anthropic, or Groq). Your Personal Identifiable Information (PII) is strictly excluded from these prompts unless you explicitly include it in your content. We do not allow these providers to use our API data to train their models.
        </Typography>
      </Box>
      <Box sx={{ ml: 2 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }} gutterBottom>Infrastructure, Payment & Telemetry</Typography>
        <Typography variant="body1" gutterBottom>
          We use <strong>Stripe</strong> for secure payment processing and do not store your full credit card details on our servers. For essential infrastructure, we use <strong>Upstash</strong> for rate-limiting and security, and <strong>Resend</strong> for transactional email delivery. We also use <strong>Sentry</strong> for error monitoring and diagnostics to ensure the stability of the Service.
        </Typography>
      </Box>
    </section>

    <section>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>4. Data Retention and Deletion</Typography>
      <Typography variant="body1" gutterBottom>
        <strong>Right to be Forgotten:</strong> You may request the deletion of your account and all associated data by emailing us at{' '}
        <Link href={`mailto:${CONTACT_EMAILS.privacy}`}>{CONTACT_EMAILS.privacy}</Link>
        {' '}or by using the &quot;Delete Account&quot; feature in your settings.
      </Typography>
      <Typography variant="body1" gutterBottom>
        When you initiate an account deletion, our system immediately and permanently deletes all of your associated relational database records, authentication credentials, and uploaded media assets from our cloud storage. We do not use soft-deletes or retain your core data after an explicit deletion request.
      </Typography>
    </section>

    <section>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>5. Contact Us</Typography>
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
