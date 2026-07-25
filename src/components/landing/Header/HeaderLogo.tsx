import React from 'react';
import { Box, Stack, Typography } from '@mui/material';
import Link from 'next/link';
import Image from 'next/image';
import { BRAND } from '@/lib/core/brand';
import { usePathname } from 'next/navigation';

export const HeaderLogo = () => {
  const pathname = usePathname();

  const handleLogoClick = (e: React.MouseEvent) => {
    if (pathname === '/') {
      e.preventDefault();
      // Most reliable way to scroll to top across all browsers
      window.scrollTo({ top: 0, behavior: 'smooth' });
      // Fallback for some mobile browsers
      document.documentElement.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <Box sx={{ flexShrink: 0 }}>
      <Link href="/" onClick={handleLogoClick} style={{ textDecoration: 'none', color: 'inherit' }}>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <Image src="/brand-logo.png" alt={BRAND.name} width={28} height={28} style={{ borderRadius: '6px' }} />
          <Typography variant="h6" component="div" sx={{ fontWeight: 700 }}>
            {BRAND.name}
          </Typography>
        </Stack>
      </Link>
    </Box>
  );
};
