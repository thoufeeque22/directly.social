'use client';

import React from 'react';
import { Box, Typography, Button, List, ListItem, ListItemText, Divider } from '@mui/material';
import { GlassCard } from '@/components/ui/GlassCard';
import EmailIcon from '@mui/icons-material/Email';
import { CONTACT_EMAILS } from '@/lib/core/emails';
import { SupportForm } from './SupportForm';

export const SupportTab: React.FC = () => {
  return (
    <GlassCard style={{ padding: '2rem' }}>
      <Box>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: 'text.primary' }}>
          Support & Help
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4 }}>
          Need assistance or have questions? We&apos;re here to help!
        </Typography>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'text.primary' }}>
            Contact Us
          </Typography>
          <SupportForm />
        </Box>

        <Divider sx={{ mb: 4 }} />

        <Box sx={{ mb: 4 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<EmailIcon />}
            href={`mailto:${CONTACT_EMAILS.support}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Email Support
          </Button>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
            Reach out to us directly at {CONTACT_EMAILS.support}
          </Typography>
        </Box>

        <Divider sx={{ mb: 4 }} />

        <Box>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'text.primary' }}>
            Frequently Asked Questions
          </Typography>
          <List>
            <ListItem>
              <ListItemText
                primary="How do I connect my social media accounts?"
                secondary="Navigate to the Destinations tab in Settings and click 'Connect' for the desired platform."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Can I use my own API keys for AI generation?"
                secondary="Yes, go to the AI Providers tab to securely add your own API keys."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="How is my data stored?"
                secondary="By default, your data is securely stored temporarily on our servers. For complete control, we offer Bring Your Own Storage (BYOS), which you can configure in the Storage tab to securely host your own data."
              />
            </ListItem>
          </List>
        </Box>
      </Box>
    </GlassCard>
  );
};
