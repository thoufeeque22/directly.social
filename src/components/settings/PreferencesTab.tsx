'use client';
import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Snackbar, Alert, CircularProgress, FormControlLabel, Switch, Select, FormControl, InputLabel } from '@mui/material';
import { GlassCard } from '@/components/ui/GlassCard';
import { getUserPreferencesAction, updateUserPreferencesAction } from '@/lib/actions/settings-preferences';

const TIMEZONES = ['UTC', 'America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles', 'Europe/London', 'Europe/Paris', 'Asia/Tokyo', 'Australia/Sydney'];

export const PreferencesTab = () => {
  const [prefs, setPrefs] = useState({ timezone: 'UTC', emailNotifications: true, inAppNotifications: true, pushNotifications: false });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    let mounted = true;
    getUserPreferencesAction().then((res) => {
      if (!mounted) return;
      if (res.success && res.preference) {
        setPrefs({
          timezone: res.preference.timezone,
          emailNotifications: res.preference.emailNotifications,
          inAppNotifications: res.preference.inAppNotifications,
          pushNotifications: res.preference.pushNotifications,
        });
      }
      setIsLoading(false);
    });
    return () => { mounted = false; };
  }, []);

  const handleChange = (field: keyof typeof prefs, value: string | boolean) => setPrefs(p => ({ ...p, [field]: value }));

  const handleSave = async () => {
    setIsSaving(true);
    const res = await updateUserPreferencesAction(prefs);
    setIsSaving(false);
    if (res.success) setSnackbar({ open: true, message: 'Preferences updated successfully', severity: 'success' });
    else setSnackbar({ open: true, message: res.error || 'Failed to update preferences', severity: 'error' });
  };

  if (isLoading) return <CircularProgress />;

  return (
    <GlassCard style={{ padding: '2rem' }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>Preferences</Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>Customize your experience and notifications.</Typography>
      </Box>

      <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <FormControl fullWidth>
          <InputLabel id="timezone-label">Timezone</InputLabel>
          <Select labelId="timezone-label" name="timezone" value={prefs.timezone} onChange={(e) => handleChange('timezone', e.target.value as string)} label="Timezone" native>
            {TIMEZONES.map(tz => (<option key={tz} value={tz}>{tz}</option>))}
          </Select>
        </FormControl>

        <Box>
          <Typography variant="h6" sx={{ mb: 2 }}>Notifications</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <FormControlLabel control={<Switch name="emailNotifications" checked={prefs.emailNotifications} onChange={(e) => handleChange('emailNotifications', e.target.checked)} />} label="Email Notifications" />
            <FormControlLabel control={<Switch checked={prefs.inAppNotifications} onChange={(e) => handleChange('inAppNotifications', e.target.checked)} />} label="In-App Notifications" />
            <FormControlLabel control={<Switch checked={prefs.pushNotifications} onChange={(e) => handleChange('pushNotifications', e.target.checked)} />} label="Push Notifications" />
          </Box>
        </Box>

        <Box>
          <Button variant="contained" onClick={handleSave} disabled={isSaving}>{isSaving ? 'Saving...' : 'Save Preferences'}</Button>
        </Box>
      </Box>
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </GlassCard>
  );
};
