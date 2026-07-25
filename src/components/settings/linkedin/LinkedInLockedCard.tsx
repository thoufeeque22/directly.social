'use client';

import React from 'react';
import { Box, Typography, Button, Chip } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import { GlassCard } from '@/components/ui/GlassCard';

interface LinkedInLockedCardProps {
  onUpgrade: () => void;
}

/**
 * Free Tier Pricing Anchor Card for LinkedIn.
 * Renders a locked, visually muted integration card with an upgrade CTA.
 * Blueprint §4: Decoy Pricing — Free users see the locked card as a FOMO anchor.
 */
export const LinkedInLockedCard: React.FC<LinkedInLockedCardProps> = ({ onUpgrade }) => (
  <GlassCard
    data-testid="integration-card-linkedin"
    style={{ opacity: 0.75, position: 'relative', overflow: 'hidden' }}
  >
    <Box
      sx={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backdropFilter: 'blur(2px)',
        zIndex: 1,
      }}
    >
      <Box sx={{ textAlign: 'center', p: 3 }}>
        <LockIcon sx={{ fontSize: 40, color: '#0A66C2', mb: 1 }} />
        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
          LinkedIn Integration
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
          Upgrade to Pro to schedule posts on LinkedIn.
        </Typography>
        <Button
          variant="contained"
          size="small"
          onClick={onUpgrade}
          data-testid="linkedin-upgrade-cta"
          sx={{ bgcolor: '#0A66C2', '&:hover': { bgcolor: '#004182' }, textTransform: 'none' }}
        >
          Upgrade to Pro
        </Button>
      </Box>
    </Box>
    <Box sx={{ p: 2, filter: 'grayscale(1)' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>LinkedIn</Typography>
        <Chip label="Pro Feature" size="small" sx={{ bgcolor: '#0A66C2', color: '#fff' }} />
      </Box>
      <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
        Schedule and publish posts to your LinkedIn Member Profile.
      </Typography>
    </Box>
  </GlassCard>
);
