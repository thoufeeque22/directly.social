import React from 'react';
import { Box, Typography, Button, List, ListItem, ListItemText, Divider } from '@mui/material';
import { GlassCard } from '@/components/ui/GlassCard';
import EmailIcon from '@mui/icons-material/Email';

export const SupportTab = () => {
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
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Contact Us
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<EmailIcon />}
            href="mailto:support.directly.social@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Email Support
          </Button>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
            Reach out to us directly at support.directly.social@gmail.com
          </Typography>
        </Box>

        <Divider sx={{ mb: 4 }} />

        <Box>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
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
            <ListItem>
              <ListItemText
                primary="How does the AI credit system work?"
                secondary="If you prefer not to use your own keys, you can purchase AI credits directly through our platform. Check the Credits tab in Settings for your current balance."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Can I schedule posts in advance?"
                secondary="Absolutely! You can use our Calendar view to schedule and manage your upcoming content across multiple platforms."
              />
            </ListItem>
          </List>
        </Box>
      </Box>
    </GlassCard>
  );
};
