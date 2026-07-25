"use client";

import React from 'react';
import { signIn } from 'next-auth/react';
import { Box, Typography } from '@mui/material';
import { useAccounts } from '@/hooks/useAccounts';
import { PlatformCard } from '@/components/settings/PlatformCard';
import { RoadmapPlatforms } from '@/components/settings/RoadmapPlatforms';
import { usePlatforms } from '@/hooks/usePlatforms';

export const DestinationsTab = () => {
  const { accounts, preferences, togglePlatform, disconnectAccount } = useAccounts();
  const { platforms } = usePlatforms();

  const active = platforms.filter(p => p.status === 'active');
  const upcoming = platforms.filter(p => p.status === 'coming-soon');
  const isEnabled = (id: string) => preferences.some(p => p.platformId === id && p.isEnabled);

  const handleDisconnect = async (id: string) => {
    if (confirm('Disconnect account?')) {
      try { await disconnectAccount(id); } catch { alert('Failed to disconnect.'); }
    }
  };

  const handleToggle = async (id: string, _: string, status: boolean, canToggle: boolean) => {
    try {
      if (!canToggle && !status) return alert("Distribution temporarily disabled for this platform.");
      await togglePlatform(id, status);
    } catch { alert('Failed to update settings.'); }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Box>
        <Typography variant="h6" sx={{ mb: 2 }}>Connected Platforms</Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
          {active.map((p) => (
            <PlatformCard key={p.id} platform={p} isEnabled={isEnabled(p.id)} onToggle={(id, prov, status) => handleToggle(id, prov, status, p.canToggle)} accounts={accounts} onConnect={() => signIn(p.provider)} onDisconnect={handleDisconnect} isLocked={p.isLocked} />
          ))}
        </Box>
      </Box>
      <RoadmapPlatforms platforms={upcoming} />
    </Box>
  );
};
