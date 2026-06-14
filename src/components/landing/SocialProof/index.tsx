'use client';

import React from 'react';
import { Box, Container, Typography, Stack, Tooltip } from '@mui/material';
import { PlatformIcon } from '@/components/ui/PlatformIcon';
import { activePlatforms, upcomingPlatforms } from '../data-secondary';
import AddIcon from '@mui/icons-material/Add';

import { CONTACT_EMAILS } from '@/lib/core/emails';

const RequestPlatformItem = () => (
  <Tooltip title="Don't see your platform? Request it here." arrow>
    <Stack spacing={1} sx={{ alignItems: 'center', opacity: 0.3, transition: 'all 0.3s ease', '&:hover': { opacity: 0.8, transform: 'translateY(-2px)' }, cursor: 'pointer' }} onClick={() => window.location.href = `mailto:${CONTACT_EMAILS.hello}?subject=Platform Request`}>
      <Box sx={{ p: 1, borderRadius: 2, bgcolor: 'background.default', display: 'flex', border: '1px dashed', borderColor: 'divider', width: 42, height: 42, alignItems: 'center', justifyContent: 'center' }}>
        <AddIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
      </Box>
      <Typography variant="caption" sx={{ fontWeight: 700, textTransform: 'uppercase', fontSize: '0.65rem', letterSpacing: '0.05em', color: 'text.secondary' }}>Your App?</Typography>
    </Stack>
  </Tooltip>
);

const PlatformItem = ({ id, isUpcoming }: { id: string, isUpcoming?: boolean }) => {
  const brandColors: Record<string, string> = { tiktok: '#000000', instagram: '#E4405F', youtube: '#FF0000', facebook: '#1877F2', linkedin: '#0A66C2', threads: '#000000', x: '#000000', reddit: '#FF4500' };
  return (
    <Tooltip title={isUpcoming ? `${id} (Coming Soon)` : `Native ${id} Support`} arrow>
      <Stack spacing={1} sx={{ alignItems: 'center', opacity: isUpcoming ? 0.3 : 0.7, filter: isUpcoming ? 'grayscale(100%)' : 'none', transition: 'all 0.3s ease', '&:hover': { opacity: 1, filter: 'none', transform: 'translateY(-2px)' }, cursor: 'default', position: 'relative' }}>
        <Box sx={{ p: 1, borderRadius: 2, bgcolor: 'background.default', display: 'flex', border: '1px solid', borderColor: 'divider', position: 'relative' }}>
          <PlatformIcon platformId={id} sx={{ fontSize: { xs: 24, md: 28 }, color: isUpcoming ? 'text.secondary' : brandColors[id.toLowerCase()] || 'inherit' }} />
          {isUpcoming && (
            <Box sx={{ position: 'absolute', top: -8, right: -8, bgcolor: 'primary.main', color: 'white', fontSize: '0.5rem', fontWeight: 900, px: 0.6, py: 0.2, borderRadius: 1, boxShadow: 2, letterSpacing: 0.5 }}>SOON</Box>
          )}
        </Box>
        <Typography variant="caption" sx={{ fontWeight: 700, textTransform: 'uppercase', fontSize: '0.65rem', letterSpacing: '0.05em', color: 'text.secondary' }}>{id}</Typography>
      </Stack>
    </Tooltip>
  );
};

export const SocialProof = () => (
  <Box sx={{ py: { xs: 6, md: 8 }, bgcolor: 'background.paper', borderTop: '1px solid', borderBottom: '1px solid', borderColor: 'divider' }}>
    <Container maxWidth="lg">
      <Stack spacing={4} sx={{ alignItems: 'center' }}>
        <Typography variant="overline" color="primary" sx={{ fontWeight: 800, letterSpacing: '0.2em' }}>Multi-Platform Native Support</Typography>
        <Stack direction="row" spacing={{ xs: 3, md: 5 }} sx={{ flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', rowGap: 3 }}>
          {activePlatforms.map(p => <PlatformItem key={p} id={p} />)}
          <Box sx={{ height: 30, width: '1px', bgcolor: 'divider', mx: 2, display: { xs: 'none', sm: 'block' } }} />
          {upcomingPlatforms.map(p => <PlatformItem key={p} id={p} isUpcoming />)}
          <RequestPlatformItem />
        </Stack>
      </Stack>
    </Container>
  </Box>
);
