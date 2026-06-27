'use client';

import React, { useState } from 'react';
import { Box, Typography, Button, Divider, Snackbar, Alert } from '@mui/material';
import { GlassCard } from '@/components/ui/GlassCard';
import { DeleteAccountModal } from './DeleteAccountModal';
import { useDeleteAccount } from '@/hooks/useDeleteAccount';

export const AccountTab: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { deleteAccount, isDeleting } = useDeleteAccount();
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });

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
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}>
          Subscription & Billing
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
          View pricing tiers, upgrade your plan, or manage your subscription.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          href="/pricing"
          sx={{ textTransform: 'none', fontWeight: 600 }}
        >
          View Plans & Upgrade
        </Button>
      </Box>

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
