'use client';

import { GlassCard } from '@/components/ui/GlassCard';
import { PlatformByokWizard } from '@/components/byok/PlatformByokWizard';
import { Container, Typography, Box } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Link from 'next/link';
import { Button } from '@mui/material';

import { PLATFORMS } from '@/lib/core/constants';

export default function ByokSettingsPage() {
  const supportedPlatforms = PLATFORMS.filter(p => 
    ['youtube', 'tiktok', 'facebook', 'instagram'].includes(p.id)
  );

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 6 }}>
        <Button 
          component={Link} 
          href="/settings" 
          startIcon={<ArrowBackIcon />}
          sx={{ mb: 3, textTransform: 'none', color: 'text.secondary' }}
        >
          Back to Settings
        </Button>
        
        <GlassCard style={{ padding: '2rem' }}>
          <Box sx={{ mb: 5 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: 'text.primary' }}>
              BYOK Integrations
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: '600px' }}>
              Bring Your Own Key (BYOK) allows you to use your own dedicated API quotas, 
              ensuring maximum reliability and bypassing global rate limits.
            </Typography>
          </Box>
        
        <Box 
          sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gap: 4 
          }}
        >
          {supportedPlatforms.map((platform) => (
            <PlatformByokWizard key={platform.id} platform={platform.id} />
          ))}
        </Box>
        </GlassCard>
      </Box>
    </Container>
  );
}
