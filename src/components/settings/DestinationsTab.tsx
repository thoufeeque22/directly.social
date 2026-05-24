"use client";

import React, { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { Box, Typography } from '@mui/material';
import { useAccounts } from '@/hooks/useAccounts';
import { PlatformCard } from '@/components/settings/PlatformCard';
import { RoadmapPlatforms } from '@/components/settings/RoadmapPlatforms';
import { PLATFORMS, Platform } from '@/lib/core/constants';

export const DestinationsTab = () => {
  const { accounts, preferences, togglePlatform, disconnectAccount } = useAccounts();
  const [apiPlatforms, setApiPlatforms] = useState<Platform[]>([...PLATFORMS]);

  useEffect(() => {
    fetch('/api/platforms').then(res => res.json()).then(setApiPlatforms).catch(console.error);
  }, []);

  const active = apiPlatforms.filter(p => p.status === 'active');
  const upcoming = apiPlatforms.filter(p => p.status === 'coming-soon');
  const isEnabled = (id: string) => preferences.some(p => p.platformId === id && p.isEnabled);

  const handleDisconnect = async (id: string) => {
    if (confirm('Disconnect account?')) {
      try { await disconnectAccount(id); } catch { alert('Failed to disconnect.'); }
    }
  };

  const handleToggle = async (id: string, _: string, status: boolean) => {
    try {
      if (id === 'tiktok' && !status) return alert("TikTok distribution temporarily disabled.");
      await togglePlatform(id, status);
    } catch { alert('Failed to update settings.'); }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Box>
        <Typography variant="h6" sx={{ mb: 2 }}>Connected Platforms</Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
          {active.map((p) => (
            <PlatformCard key={p.id} platform={p} isEnabled={isEnabled(p.id)} onToggle={handleToggle} accounts={accounts} onConnect={() => signIn(p.provider)} onDisconnect={handleDisconnect} />
          ))}
        </Box>
      </Box>
      <RoadmapPlatforms platforms={upcoming} />
    </Box>
  );
};
