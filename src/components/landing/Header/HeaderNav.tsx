import React from 'react';
import { Stack, Button } from '@mui/material';
import Link from 'next/link';

export const HeaderNav = () => {
  return (
    <Stack direction="row" spacing={1} sx={{ display: { xs: 'none', md: 'flex' }, flexGrow: 1, justifyContent: 'center' }}>
      <Button component={Link} href="/philosophy" color="inherit" sx={{ textTransform: 'none', fontWeight: 500 }}>Philosophy</Button>
      <Button component={Link} href="/#features" color="inherit" sx={{ textTransform: 'none', fontWeight: 500 }}>Features</Button>
      <Button component={Link} href="/#pricing" color="inherit" sx={{ textTransform: 'none', fontWeight: 500 }}>Pricing</Button>
      <Button component={Link} href="/docs" color="inherit" sx={{ textTransform: 'none', fontWeight: 500 }}>Docs</Button>
    </Stack>
  );
};
