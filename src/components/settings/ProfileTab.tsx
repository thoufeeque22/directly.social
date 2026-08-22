'use client';

import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Avatar } from '@mui/material';
import { GlassCard } from '@/components/ui/GlassCard';
import { getUserProfileAction } from '@/lib/actions/settings-profile';

export const ProfileTab = () => {
  const [user, setUser] = useState<{ name?: string | null; email?: string | null; image?: string | null } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    getUserProfileAction().then((res) => {
      if (!mounted) return;
      if (res.success && res.user) {
        setUser(res.user);
      }
      setIsLoading(false);
    });
    return () => { mounted = false; };
  }, []);

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
      </Box>
    </GlassCard>
  );
};
