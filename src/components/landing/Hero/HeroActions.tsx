'use client';

import React from 'react';
import { Button, Stack } from '@mui/material';
import Link from 'next/link';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import DashboardIcon from '@mui/icons-material/Dashboard';

import { useSession } from '@/lib/supabase/next-auth-react-shim';

export const HeroActions = () => {
  const { status } = useSession();
  const isAuthenticated = status === 'authenticated';

  return (
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ width: { xs: '100%', sm: 'auto' } }}>
      {isAuthenticated ? (
        <Button
          component="a"
          href="/login"
          variant="contained"
          size="large"
          startIcon={<DashboardIcon />}
          sx={{ py: 1.5, px: 4, borderRadius: 2, fontSize: '1.1rem', textTransform: 'none' }}
        >
          Go to Dashboard
        </Button>
      ) : (
        <Button
          component="a"
          href="/login"
          variant="contained"
          size="large"
          startIcon={<RocketLaunchIcon />}
          sx={{ py: 1.5, px: 4, borderRadius: 2, fontSize: '1.1rem', textTransform: 'none' }}
        >
          Get Started for Free
        </Button>
      )}
      <Button
        component={Link}
        href="/#features"
        variant="outlined"
        size="large"
        sx={{ py: 1.5, px: 4, borderRadius: 2, fontSize: '1.1rem', textTransform: 'none' }}
      >
        Explore Features
      </Button>
    </Stack>
  );
};
