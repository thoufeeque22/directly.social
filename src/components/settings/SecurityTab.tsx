'use client';

import React, { useState } from 'react';
import { Box, Typography, Button, Snackbar, Alert } from '@mui/material';
import { GlassCard } from '@/components/ui/GlassCard';
import { signOutOtherDevices } from '@/lib/supabase/auth-actions-server';

export const SecurityTab = () => {
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOutOtherDevices = async () => {
    setIsSigningOut(true);
    try {
      await signOutOtherDevices();
      setSnackbar({ open: true, message: 'Successfully logged out of other devices', severity: 'success' });
    } catch (e: unknown) {
      setSnackbar({ open: true, message: 'Failed to sign out of other devices', severity: 'error' });
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <GlassCard style={{ padding: '2rem' }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: 'text.primary' }}>Security</Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>Manage your account security and active sessions.</Typography>
      </Box>

      <Box sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>Session Management</Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
          Log out of all other active sessions across all your devices. Your current session will remain active.
        </Typography>
        <Button
          variant="contained"
          color="warning"
          onClick={handleSignOutOtherDevices}
          disabled={isSigningOut}
        >
          {isSigningOut ? 'Signing out...' : 'Log Out of All Devices'}
        </Button>
      </Box>

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </GlassCard>
  );
};
