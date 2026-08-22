'use client';

import React, { useState, useEffect } from 'react';
import useSWR from 'swr';
import { Box, Typography, CircularProgress, Avatar, TextField, Snackbar, Alert, Button } from '@mui/material';
import { GlassCard } from '@/components/ui/GlassCard';
import { getUserProfileAction, updateUserProfileAction } from '@/lib/actions/settings-profile';

const fetcher = async () => {
  try {
    const res = await getUserProfileAction();
    if (!res.success) return null;
    return res.user;
  } catch {
    return null;
  }
};

export const ProfileTab = () => {
  const { data: user, isLoading, mutate } = useSWR('userProfile', fetcher);
  const [personalNotes, setPersonalNotes] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    if (user?.personalNotes !== undefined) {
      setPersonalNotes(user.personalNotes || '');
    }
  }, [user]);

  const handleSaveNotes = async () => {
    setIsSaving(true);
    try {
      const res = await updateUserProfileAction({ personalNotes });
      if (res.success) {
        setSnackbar({ open: true, message: 'Notes saved successfully', severity: 'success' });
        mutate();
      } else {
        setSnackbar({ open: true, message: res.error || 'Failed to save notes', severity: 'error' });
      }
    } catch {
      setSnackbar({ open: true, message: 'Failed to save notes', severity: 'error' });
    }
    setIsSaving(false);
  };

  if (isLoading) return <CircularProgress />;

  return (
    <GlassCard style={{ padding: '2rem' }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: 'text.primary' }}>Profile Settings</Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>Your personal information.</Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar src={user?.image || undefined} alt={user?.name || 'User'} sx={{ width: 64, height: 64 }} />
          <Box>
            <Typography variant="h6">{user?.name || 'No name provided'}</Typography>
            <Typography variant="body2" color="text.secondary">{user?.email || 'No email provided'}</Typography>
          </Box>
        </Box>

        <Box sx={{ mt: 2 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>Personal Workspace Notes</Typography>
          <TextField
            fullWidth
            multiline
            minRows={4}
            variant="outlined"
            placeholder="Your private scratchpad..."
            value={personalNotes}
            onChange={(e) => setPersonalNotes(e.target.value)}
          />
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="contained" onClick={handleSaveNotes} disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Notes'}
            </Button>
          </Box>
        </Box>
      </Box>
      
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </GlassCard>
  );
};
