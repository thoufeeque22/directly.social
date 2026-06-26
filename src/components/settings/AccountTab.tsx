'use client';

import React, { useState } from 'react';
import { Box, Typography, Button, Divider } from '@mui/material';
import { GlassCard } from '@/components/ui/GlassCard';
import { DeleteAccountModal } from './DeleteAccountModal';
import { signOut } from 'next-auth/react';

export const AccountTab: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch('/api/settings/delete-account', {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Failed to delete account');
      }

      alert('Account deleted successfully');
      await signOut({ callbackUrl: '/' });
    } catch (error) {
      console.error(error);
      alert('An error occurred while deleting your account');
      setIsDeleting(false);
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

      {/* Additional account settings can be added here in the future */}

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
    </GlassCard>
  );
};
