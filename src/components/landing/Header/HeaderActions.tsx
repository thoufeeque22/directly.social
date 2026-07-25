import React from 'react';
import { Stack, Button, Typography, Box, useTheme } from '@mui/material';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export const HeaderActions = () => {
  const theme = useTheme();
  const { status } = useSession();
  const isAuthenticated = status === 'authenticated';

  return (
    <Stack direction="row" spacing={{ xs: 1, sm: 3 }} sx={{ alignItems: 'center', flexShrink: 0 }}>
      {isAuthenticated ? (
        <Button
          component="a"
          href="/"
          variant="contained"
          color="primary"
          sx={{ borderRadius: 2, px: { xs: 2, sm: 3 }, textTransform: 'none', fontWeight: 600 }}
        >
          Dashboard
        </Button>
      ) : (
        <>
          <Box component="a" href="/login" style={{ textDecoration: 'none', color: theme.palette.text.primary, display: 'block' }}>
            <Typography sx={{ 
              fontWeight: 600, 
              fontSize: '0.9rem', 
              '&:hover': { color: 'primary.main' }, 
              display: { xs: 'none', sm: 'block' },
              '.returning-user &': { display: 'none !important' }
            }}>
              Login
            </Typography>
          </Box>
          <Button
            component="a"
            href="/login"
            variant="contained"
            color="primary"
            sx={{ borderRadius: 2, px: { xs: 1.5, sm: 3 }, textTransform: 'none', fontWeight: 600 }}
          >
            <Box component="span" sx={{ display: 'inline', '.returning-user &': { display: 'none !important' } }}>
              Get Started
            </Box>
            <Box component="span" sx={{ display: 'none', '.returning-user &': { display: 'inline !important' } }}>
              Login
            </Box>
          </Button>
        </>
      )}
    </Stack>
  );
};
