'use client';

import React, { useState } from 'react';
import { Box, Typography, Button, Snackbar, Alert } from '@mui/material';
import { GlassCard } from '@/components/ui/GlassCard';
import { triggerDataExportAction } from '@/lib/actions/settings-export';

export const PrivacyTab = () => {
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });
  const [isExporting, setIsExporting] = useState(false);

  const [lastExport, setLastExport] = useState(0);

  const handleExportData = async () => {
    if (Date.now() - lastExport < 10000) {
      setSnackbar({ open: true, message: 'Please wait before requesting another export', severity: 'error' });
      return;
    }
    setLastExport(Date.now());
    setIsExporting(true);
    try {
      const res = await triggerDataExportAction();
      if (res.success) {
        setLastExport(Date.now());
        setSnackbar({ open: true, message: 'Data export started. You will receive an email shortly.', severity: 'success' });
      } else {
        setSnackbar({ open: true, message: ('error' in res ? res.error : 'Failed to start data export') as string, severity: 'error' });
      }
    } catch (e: unknown) {
      setSnackbar({ open: true, message: 'Failed to start data export', severity: 'error' });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <GlassCard style={{ padding: '2rem' }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: 'text.primary' }}>Privacy</Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>Manage your data and privacy settings.</Typography>
      </Box>

      <Box sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>Data Portability</Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
          Request a copy of your profile, posts, templates, and connected destination settings. We will process your data and deliver a secure, time-limited download link to your registered email address.
        </Typography>
        <Button
          variant="contained"
          onClick={handleExportData}
          disabled={isExporting}
        >
          {isExporting ? 'Starting Export...' : 'Export Data'}
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
