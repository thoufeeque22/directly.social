'use client';

import React, { useState } from 'react';
import useSWR from 'swr';
import { Box, Typography, Snackbar, Alert, CircularProgress, FormControlLabel, Switch, Select, FormControl, InputLabel } from '@mui/material';
import { GlassCard } from '@/components/ui/GlassCard';
import { getUserPreferencesAction, updateUserPreferencesAction } from '@/lib/actions/settings-preferences';

const TIMEZONES = [
  { value: 'UTC', label: '(GMT) UTC' },
  ...Intl.supportedValuesOf('timeZone').map(tz => {
    const formatter = new Intl.DateTimeFormat('en', { timeZone: tz, timeZoneName: 'longOffset' });
    const parts = formatter.formatToParts(new Date());
    const offset = parts.find(p => p.type === 'timeZoneName')?.value || 'GMT';
    return { value: tz, label: `(${offset}) ${tz}` };
  })
];

const fetcher = async () => {
  try {
    const res = await getUserPreferencesAction();
    if (!res || !res.success) {
      console.warn('Failed to fetch preferences', res?.error);
      return null; // return null to use defaults
    }
    return res.preference;
  } catch (err: unknown) {
    console.warn('Error fetching preferences:', err);
    return null;
  }
};

export const PreferencesTab = () => {
  const { data: preference, error, isLoading, mutate } = useSWR('userPreferences', fetcher);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });

  const handleChange = async (field: string, value: string | boolean) => {
    if (preference === undefined) return; // Still loading
    
    const newPrefs = {
      ...(preference || {}),
      timezone: preference?.timezone || 'UTC',
      emailNotifications: preference?.emailNotifications ?? true,
      inAppNotifications: preference?.inAppNotifications ?? true,
      pushNotifications: preference?.pushNotifications ?? false,
      [field]: value
    };
    
    mutate(newPrefs as typeof preference, false);
    
    const res = await updateUserPreferencesAction(newPrefs);
    if (res.success && res.preference) {
      setSnackbar({ open: true, message: 'Preferences updated successfully', severity: 'success' });
      mutate(res.preference, false);
    } else {
      setSnackbar({ open: true, message: res.error || 'Failed to update preferences', severity: 'error' });
      mutate();
    }
  };

  if (isLoading) return <CircularProgress />;
  if (error) return <Typography color="error">Failed to load preferences: {error.message}</Typography>;

  return (
    <GlassCard style={{ padding: '2rem' }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>Preferences</Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>Customize your experience and notifications.</Typography>
      </Box>

      <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <FormControl fullWidth>
          <InputLabel id="timezone-label">Timezone</InputLabel>
          <Select 
            labelId="timezone-label" 
            name="timezone" 
            value={preference?.timezone || 'UTC'} 
            onChange={(e) => handleChange('timezone', e.target.value as string)} 
            label="Timezone" 
            native
          >
            {TIMEZONES.map(tz => (<option key={tz.value} value={tz.value}>{tz.label}</option>))}
          </Select>
        </FormControl>

        <Box>
          <Typography variant="h6" sx={{ mb: 2 }}>Notifications</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <FormControlLabel 
              control={<Switch name="emailNotifications" checked={preference?.emailNotifications ?? true} onChange={(e) => handleChange('emailNotifications', e.target.checked)} />} 
              label="Email Notifications" 
            />
            <FormControlLabel 
              control={<Switch checked={preference?.inAppNotifications ?? true} onChange={(e) => handleChange('inAppNotifications', e.target.checked)} />} 
              label="In-App Notifications" 
            />
            <FormControlLabel 
              control={<Switch checked={preference?.pushNotifications ?? false} onChange={(e) => handleChange('pushNotifications', e.target.checked)} />} 
              label="Push Notifications" 
            />
          </Box>
        </Box>
      </Box>
      
      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </GlassCard>
  );
};
