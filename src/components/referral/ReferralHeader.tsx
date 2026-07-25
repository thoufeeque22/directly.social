import React from 'react';
import Link from 'next/link';
import { Box, Typography, Stack } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { BRAND } from '@/lib/core/brand';

interface Props {
  isFree: boolean;
  isLifetime: boolean;
}

export function ReferralHeader({ isFree, isLifetime }: Props) {
  const grandPrizeNodes = isFree 
    ? (
      <>
        <Link href="/pricing" style={{ fontWeight: 700, color: 'inherit', textDecoration: 'underline', textDecorationStyle: 'dotted', textUnderlineOffset: '4px' }}>100% Free Cloud Pro</Link>
        {' '}or{' '}
        <Link href="/byok" style={{ fontWeight: 700, color: 'inherit', textDecoration: 'underline', textDecorationStyle: 'dotted', textUnderlineOffset: '4px' }}>Lifetime BYOK</Link>
      </>
    ) : (isLifetime ? (
      <Link href="/byok" style={{ fontWeight: 700, color: 'inherit', textDecoration: 'underline', textDecorationStyle: 'dotted', textUnderlineOffset: '4px' }}>Massive AI Credit Bonuses</Link>
    ) : (
      <>
        <Link href="/pricing" style={{ fontWeight: 700, color: 'inherit', textDecoration: 'underline', textDecorationStyle: 'dotted', textUnderlineOffset: '4px' }}>100% Free Subscription</Link>
        {' '}or{' '}
        <Link href="/byok" style={{ fontWeight: 700, color: 'inherit', textDecoration: 'underline', textDecorationStyle: 'dotted', textUnderlineOffset: '4px' }}>Lifetime BYOK</Link>
      </>
    ));

  return (
    <Box sx={{ 
      background: 'linear-gradient(135deg, rgba(255,107,107,0.1) 0%, rgba(255,142,83,0.1) 100%)',
      pt: 6, pb: 5, px: 4, position: 'relative'
    }}>
      <Stack spacing={2} sx={{ alignItems: 'center', textAlign: 'center' }}>
        <AutoAwesomeIcon sx={{ fontSize: 56, color: '#FF8E53', mb: 1 }} />
        <Typography variant="h3" sx={{ 
          fontWeight: 800,
          background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Give a Month, Get a Month
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '600px', fontWeight: 400 }}>
          Invite friends to {BRAND.name}. 
          Earn extra posts and unlock {grandPrizeNodes}.
        </Typography>
      </Stack>
    </Box>
  );
}
