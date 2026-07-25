'use client';

import React, { useState } from 'react';
import { Box, Typography, Button, Chip, Badge } from '@mui/material';
import { GlassCard } from '@/components/ui/GlassCard';
import { LinkedInAuthBridgeModal } from './LinkedInAuthBridgeModal';

interface LinkedInIntegrationCardProps {
  userId: string;
  isConnected: boolean;
  accountName?: string | null;
  onDisconnect: () => void;
}

/**
 * Pro/Enterprise Tier LinkedIn Integration Card.
 * Shows connection status and triggers the Authorization Bridge modal
 * before redirecting to LinkedIn OAuth (blueprint §4 Frontend).
 */
export const LinkedInIntegrationCard: React.FC<LinkedInIntegrationCardProps> = ({
  userId: _userId,
  isConnected,
  accountName,
  onDisconnect,
}) => {
  const [modalOpen, setModalOpen] = useState(false);

  const handleConnectConfirm = async () => {
    const res = await fetch('/api/linkedin/oauth/start');
    if (!res.ok) return;
    const data = (await res.json()) as { url?: string };
    if (data.url) globalThis.location.href = data.url;
  };

  return (
    <>
      <GlassCard
        data-testid="integration-card-linkedin"
        style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
      >
        <Box sx={{ p: 2, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>LinkedIn</Typography>
              <Badge
                variant="dot"
                sx={{ '& .MuiBadge-badge': { bgcolor: isConnected ? '#4caf50' : '#757575' } }}
              />
            </Box>
            <Chip
              label={isConnected ? 'Connected' : 'Not Connected'}
              size="small"
              color={isConnected ? 'success' : 'default'}
            />
          </Box>
          {isConnected && accountName && (
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
              {accountName}
            </Typography>
          )}
        </Box>
        <Box sx={{ p: 2 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
            Publish and schedule posts on your LinkedIn Member Profile.
          </Typography>
          {isConnected ? (
            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={onDisconnect}
              data-testid="linkedin-disconnect-btn"
              sx={{ textTransform: 'none' }}
            >
              Disconnect
            </Button>
          ) : (
            <Button
              variant="contained"
              size="small"
              onClick={() => setModalOpen(true)}
              data-testid="linkedin-connect-btn"
              sx={{ bgcolor: '#0A66C2', '&:hover': { bgcolor: '#004182' }, textTransform: 'none' }}
            >
              Connect LinkedIn
            </Button>
          )}
        </Box>
      </GlassCard>
      <LinkedInAuthBridgeModal
        open={modalOpen}
        onConfirm={handleConnectConfirm}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
};
