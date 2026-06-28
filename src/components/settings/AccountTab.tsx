'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Box, Typography, Button, Divider, Snackbar, Alert } from '@mui/material';
import { GlassCard } from '@/components/ui/GlassCard';
import { DeleteAccountModal } from './DeleteAccountModal';
import { useDeleteAccount } from '@/hooks/useDeleteAccount';
import { BillingSection } from './BillingSection';

export const AccountTab: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { deleteAccount, isDeleting } = useDeleteAccount();
  const searchParams = useSearchParams();
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    if (searchParams?.get('success') === 'true') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSnackbar({ open: true, message: 'Subscription successfully updated! Welcome aboard.', severity: 'success' });
      // Remove success from URL without reload
      window.history.replaceState({}, '', '/settings?tab=account');
    }
  }, [searchParams]);

  const handleDeleteAccount = async () => {
    const success = await deleteAccount();
    if (!success) {
      setSnackbar({ open: true, message: 'An error occurred while deleting your account', severity: 'error' });
      setIsModalOpen(false);
    }
  };

  return (
    <GlassCard style={{ padding: '2rem' }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: 'text.primary' }}>
          Account Settings
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          Manage your personal profile and account security.
        </Typography>
      </Box>

      {/* Billing Section */}
      <BillingSection />

      <Divider sx={{ my: 4 }} />

      <Box sx={{ p: 3, border: '1px solid', borderColor: 'error.main', borderRadius: 2, bgcolor: 'error.main' + '0a' }}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: 'error.main', mb: 1 }}>
          Danger Zone
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
          Permanently delete your account and all associated data. This action is irreversible.
        </Typography>
        <Button
          variant="outlined"
          color="error"
          onClick={() => setIsModalOpen(true)}
        >
          Delete Account
        </Button>
      </Box>

      <DeleteAccountModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDeleteAccount}
        isDeleting={isDeleting}
      />
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </GlassCard>
  );
};
