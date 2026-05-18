'use client';

import { ByokWizard } from '@/components/byok/ByokWizard';
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
        
        <Box sx={{ mb: 5 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
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
            <ByokWizard key={platform.id} platform={platform.id} />
          ))}
        </Box>
      </Box>
    </Container>
  );
}
