/* eslint-disable max-lines */
import React, { useMemo } from 'react';
import { Box, Typography, Accordion, AccordionSummary, AccordionDetails, Switch, Badge, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LockIcon from '@mui/icons-material/Lock';
import { GlassCard } from '@/components/ui/GlassCard';
import { ConnectionSection } from '@/components/settings/ConnectionSection';
import { PlatformByokWizard } from '@/components/byok/PlatformByokWizard';
import { Account } from '@/lib/core/types';

import { PlatformIcon } from '@/components/ui/PlatformIcon';

interface PlatformCardProps {
  platform: { id: string; name: string; icon: string; provider: string; color: string };
  isEnabled: boolean;
  onToggle: (platformId: string, currentStatus: boolean) => Promise<void>;
  accounts: Account[];
  onDisconnect: (accountId: string) => void;
  onConnect: () => void;
  isLocked?: boolean;
}

export const PlatformCard: React.FC<PlatformCardProps> = ({
  platform,
  isEnabled,
  onToggle,
  accounts,
  onDisconnect,
  onConnect,
  isLocked,
}) => {
  const [bridgeOpen, setBridgeOpen] = React.useState(false);
  const isConnected = useMemo(() => 
    accounts.some(acc => acc.provider === platform.provider), 
    [accounts, platform.provider]
  );

  const brandColor = platform.color || 'hsl(var(--primary))';

  return (
    <GlassCard 
      data-testid={`platform-card-${platform.id}`}
      style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
    >
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <PlatformIcon platformId={platform.icon} sx={{ color: brandColor }} />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>{platform.name}</Typography>
            <Badge 
              variant="dot" 
              color={isConnected ? "success" : "default"} 
              sx={{ '& .MuiBadge-badge': { backgroundColor: isConnected ? '#4caf50' : '#757575' } }}
            />
          </Box>
        </Box>
        {isLocked ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LockIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
            <Typography variant="caption" color="text.secondary">PRO</Typography>
          </Box>
        ) : (
          <Switch 
            checked={isEnabled} 
            onChange={() => onToggle(platform.id, isEnabled)}
            aria-label={`Toggle ${platform.name}`}
          />
        )}
      </Box>

      {isEnabled && (
        <Accordion sx={{ bgcolor: 'transparent', boxShadow: 'none' }} defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>Configuration</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ mb: 3 }}>
              <ConnectionSection
                title="Account Connection"
                subtitle={`Manage ${platform.name} connections.`}
                icon={<PlatformIcon platformId={platform.icon} sx={{ color: brandColor }} />}
                provider={platform.provider}
                color={brandColor}
                onConnect={() => {
                  if (platform.id === 'linkedin') setBridgeOpen(true);
                  else onConnect();
                }}
                onDisconnect={onDisconnect}
                accounts={accounts}
                platformLabel={platform.name}
              />
            </Box>
            <Box sx={{ borderTop: '1px solid rgba(255,255,255,0.1)', pt: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>Advanced Settings (BYOK)</Typography>
              <PlatformByokWizard platform={platform.id} />
            </Box>
          </AccordionDetails>
        </Accordion>
      )}

      <Dialog open={bridgeOpen} onClose={() => setBridgeOpen(false)}>
        <DialogTitle>Connect LinkedIn</DialogTitle>
        <DialogContent>
          <Typography>You are about to connect your LinkedIn Profile for content scheduling. We strictly follow LinkedIn&apos;s Developer Program rules. Your data will be wiped immediately upon token revocation.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBridgeOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => { setBridgeOpen(false); onConnect(); }}>Continue</Button>
        </DialogActions>
      </Dialog>
    </GlassCard>
  );
};
