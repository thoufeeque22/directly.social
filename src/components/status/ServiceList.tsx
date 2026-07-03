import React from 'react';
import { Paper, Typography, Box, List, ListItem, ListItemText, Tooltip, IconButton, Divider } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import BuildIcon from '@mui/icons-material/Build';
import HelpCenterIcon from '@mui/icons-material/HelpCenter';
import { BetterStackMonitor } from '@/lib/schemas/status';

interface ServiceListProps {
  monitors: BetterStackMonitor[];
}

const statusMap = {
  up: { label: 'Operational', icon: <CheckCircleIcon sx={{ color: 'success.main' }} /> },
  degraded: { label: 'Degraded Performance', icon: <WarningIcon sx={{ color: 'warning.main' }} /> },
  down: { label: 'Service Outage', icon: <ErrorIcon sx={{ color: 'error.main' }} /> },
  maintenance: { label: 'Under Maintenance', icon: <BuildIcon sx={{ color: 'info.main' }} /> },
  paused: { label: 'Paused', icon: <HelpCenterIcon sx={{ color: 'text.secondary' }} /> },
};

const extTooltips: Record<string, string> = {
  'TikTok Publishing API': 'TikTok API health for video publishing and analytics retrieval.',
  'Meta Graph API': 'Meta Graph API health for account connections and posting.',
  'YouTube Data API': 'YouTube Data API health for video uploads and channel metrics syncing.',
};

const friendlyNames: Record<string, string> = {
  'directly-social.vercel.app': 'Website & Dashboard',
  'Core API Gateway': 'Internal Services',
  'Primary Database': 'Data Storage',
  'YouTube Data API': 'YouTube Connection',
  'Meta Graph API': 'Facebook & Instagram Connection',
  'TikTok Publishing API': 'TikTok Connection',
};

export function ServiceList({ monitors }: ServiceListProps) {
  const externalNames = ['TikTok Publishing API', 'Meta Graph API', 'YouTube Data API', 'TikTok API', 'Meta API', 'YouTube API'];
  const core = monitors.filter(m => {
    const name = m.attributes?.name || '';
    return !externalNames.some(ext => name.includes(ext));
  });
  const external = monitors.filter(m => {
    const name = m.attributes?.name || '';
    return externalNames.some(ext => name.includes(ext));
  });

  const renderItem = (m: BetterStackMonitor, isExternal = false) => {
    const status = m.attributes.status;
    const cfg = statusMap[status] || statusMap.paused;
    const itemContent = (
      <ListItem sx={{ py: 1.5, px: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', '&:hover': { bgcolor: 'action.hover' } }}>
        <ListItemText primary={<Typography variant="body2" sx={{ fontWeight: 500 }}>{friendlyNames[m.attributes.name] || m.attributes.name}</Typography>} />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {cfg.icon}
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>{cfg.label}</Typography>
        </Box>
      </ListItem>
    );

    if (isExternal && extTooltips[m.attributes.name]) {
      return (
        <Tooltip key={m.id} title={extTooltips[m.attributes.name]} arrow enterDelay={100} leaveDelay={200}>
          <Box component="div">{itemContent}</Box>
        </Tooltip>
      );
    }
    return <React.Fragment key={m.id}>{itemContent}</React.Fragment>;
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Directly Social Platform</Typography>
        <Divider />
        <List disablePadding>{core.map(m => renderItem(m))}</List>
      </Paper>
      <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>Social Media Connections</Typography>
          <Tooltip title="Real-time connectivity and response status of external platform integrations monitored via BetterStack." arrow>
            <IconButton size="small" aria-label="More information about external APIs" tabIndex={0}>
              <HelpCenterIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
        <Divider />
        <List disablePadding>{external.map(m => renderItem(m, true))}</List>
      </Paper>
    </Box>
  );
}
