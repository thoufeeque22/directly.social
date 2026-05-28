/* eslint-disable max-lines */
import React, { useMemo } from 'react';
import { Box, Typography, Accordion, AccordionSummary, AccordionDetails, Switch, Badge } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { GlassCard } from '@/components/ui/GlassCard';
import { ConnectionSection } from '@/components/settings/ConnectionSection';
import { ByokWizard } from '@/components/byok/ByokWizard';
import { Account } from '@/lib/core/types';

import { PlatformIcon } from '@/components/ui/PlatformIcon';

interface PlatformCardProps {
  platform: { id: string; name: string; icon: string; provider: string; color: string };
  isEnabled: boolean;
  onToggle: (platformId: string, provider: string, currentStatus: boolean) => Promise<void>;
  accounts: Account[];
  onDisconnect: (accountId: string) => void;
  onConnect: () => void;
}

export const PlatformCard: React.FC<PlatformCardProps> = ({
  platform,
  isEnabled,
  onToggle,
  accounts,
  onDisconnect,
  onConnect,
}) => {
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
        <Switch 
          checked={isEnabled} 
          onChange={() => onToggle(platform.id, platform.provider, isEnabled)}
          aria-label={`Toggle ${platform.name}`}
        />
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
                onConnect={onConnect}
                onDisconnect={onDisconnect}
                accounts={accounts}
                platformLabel={platform.name}
              />
            </Box>
            <Box sx={{ borderTop: '1px solid rgba(255,255,255,0.1)', pt: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>Advanced Settings (BYOK)</Typography>
              <ByokWizard platform={platform.id} />
            </Box>
          </AccordionDetails>
        </Accordion>
      )}
    </GlassCard>
  );
};
