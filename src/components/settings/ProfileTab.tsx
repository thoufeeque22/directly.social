'use client';

import React, { useState, useEffect, useCallback } from 'react';
import useSWR from 'swr';
import { Box, Typography, CircularProgress, Avatar, TextField, Snackbar, Alert, Button, Divider, Tooltip, Badge } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
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
  const [name, setName] = useState('');
  const [personalNotes, setPersonalNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false, message: '', severity: 'success'
  });

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setPersonalNotes(user.personalNotes || '');
    }
  }, [user]);

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    try {
      const res = await updateUserProfileAction({ name, personalNotes });
      if (res.success) {
        setSnackbar({ open: true, message: 'Profile updated successfully', severity: 'success' });
        mutate();
      } else {
        setSnackbar({ open: true, message: res.error || 'Failed to update profile', severity: 'error' });
      }
    } catch {
      setSnackbar({ open: true, message: 'Failed to update profile', severity: 'error' });
    }
    setIsSaving(false);
  }, [name, personalNotes, mutate]);

  if (isLoading) return <CircularProgress />;

  return (
    <GlassCard style={{ padding: '2rem' }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: 'text.primary' }}>Profile Settings</Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>Manage your personal information.</Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Tooltip title="Custom avatar upload coming soon!" arrow placement="right">
          <Badge
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            badgeContent={<EditIcon sx={{ fontSize: 16, color: 'text.secondary' }} />}
            sx={{ width: 'fit-content', cursor: 'pointer' }}
          >
            <Avatar src={user?.image || undefined} alt={user?.name || 'User'} sx={{ width: 72, height: 72 }} />
          </Badge>
        </Tooltip>

        <TextField
          label="Display Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          helperText="This is how your name appears across the app."
          slotProps={{ htmlInput: { maxLength: 100 } }}
        />

        <Divider />

        <Box>
          <Typography variant="h6" sx={{ mb: 1 }}>Personal Workspace Notes</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            A private scratchpad only visible to you.
          </Typography>
          <TextField
            fullWidth
            multiline
            minRows={4}
            variant="outlined"
            placeholder="Jot down reminders, content ideas, or anything you need..."
            value={personalNotes}
            onChange={(e) => setPersonalNotes(e.target.value)}
            helperText={`${personalNotes.length}/2000 characters`}
            error={personalNotes.length > 2000}
            slotProps={{ htmlInput: { maxLength: 2000 } }}
          />
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="contained" onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Profile'}
          </Button>
        </Box>
      </Box>
      
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </GlassCard>
  );
};
