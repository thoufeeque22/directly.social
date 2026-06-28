'use client';

import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Snackbar, Alert } from '@mui/material';
import { getSubscriptionTierAction } from '@/lib/actions/settings';

export const BillingSection: React.FC = () => {
  const [tier, setTier] = useState<string>('FREE_STARTER');
  const [isManaging, setIsManaging] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    async function loadTier() {
      const result = await getSubscriptionTierAction();
      if (result.success && result.tier) {
        setTier(result.tier);
      }
    }
    loadTier();
  }, []);

  const handleManage = async () => {
    setIsManaging(true);
    try {
      const res = await fetch('/api/stripe/portal', { method: 'POST' });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setSnackbar({ open: true, message: 'Could not open billing portal', severity: 'error' });
      }
    } catch {
      setSnackbar({ open: true, message: 'Could not open billing portal', severity: 'error' });
    } finally {
      setIsManaging(false);
    }
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}>
        Subscription & Billing
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
        View pricing tiers, upgrade your plan, or manage your subscription.
      </Typography>
      
      {tier === 'FREE_STARTER' || tier === 'FREE_HACKER' ? (
        <Button
          variant="contained"
          color="primary"
          href="/pricing"
          sx={{ textTransform: 'none', fontWeight: 600 }}
        >
          View Plans & Upgrade
        </Button>
      ) : (
        <Button
          variant="contained"
          color="secondary"
          disabled={isManaging}
          onClick={handleManage}
          sx={{ textTransform: 'none', fontWeight: 600 }}
        >
          {isManaging ? 'Loading...' : 'Manage Subscription'}
        </Button>
      )}

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};
