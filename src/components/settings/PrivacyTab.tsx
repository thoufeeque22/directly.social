"use client";

import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { GlassCard } from '@/components/ui/GlassCard';
import { requestDataExportAction, deleteAccountAction } from '@/app/actions/privacy';
import { signOut } from 'next-auth/react';
import { DeleteConfirmationDialog } from './PrivacyTab.DeleteDialog';
import { 
  DataExportSection, 
  PrivacyPolicySection, 
  DangerZoneSection 
} from './PrivacyTab.Sections';

export const PrivacyTab = () => {
  const [exportLoading, setExportLoading] = useState(false);
  const [exportMessage, setExportMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleRequestExport = async () => {
    setExportLoading(true);
    setExportMessage(null);
    try {
      const result = await requestDataExportAction() as { success: boolean, message?: string };
      if (result.success) {
        setExportMessage({ type: 'success', text: result.message || 'Export requested successfully.' });
      } else {
        setExportMessage({ type: 'error', text: 'Failed to request export.' });
      }
    } catch {
      setExportMessage({ type: 'error', text: 'An unexpected error occurred.' });
    } finally {
      setExportLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleteLoading(true);
    try {
      const result = await deleteAccountAction() as { success: boolean };
      if (result.success) {
        await signOut({ callbackUrl: '/' });
      } else {
        alert('Failed to delete account.');
        setDeleteLoading(false);
      }
    } catch {
      alert('An unexpected error occurred.');
      setDeleteLoading(false);
    }
  };

  return (
    <GlassCard style={{ padding: '2rem' }}>
      <Box>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: 'text.primary' }}>
          Privacy & Data Management
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4 }}>
          Manage your personal data, request exports, or delete your account in accordance with GDPR.
        </Typography>

        <DataExportSection 
          loading={exportLoading} 
          message={exportMessage} 
          onRequest={handleRequestExport} 
        />

        <PrivacyPolicySection />

        <DangerZoneSection onDelete={() => setDeleteDialogOpen(true)} />
      </Box>

      <DeleteConfirmationDialog 
        open={deleteDialogOpen}
        loading={deleteLoading}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteAccount}
      />
    </GlassCard>
  );
};
