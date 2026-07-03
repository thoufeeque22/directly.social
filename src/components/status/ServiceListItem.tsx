import React from 'react';
import { ListItem, ListItemText, Typography, Box, Tooltip } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import BuildIcon from '@mui/icons-material/Build';
import HelpCenterIcon from '@mui/icons-material/HelpCenter';
import { BetterStackMonitor } from '@/lib/schemas/status';

export const statusMap = {
  up: { label: 'Operational', icon: <CheckCircleIcon sx={{ color: 'success.main' }} /> },
  degraded: { label: 'Degraded Performance', icon: <WarningIcon sx={{ color: 'warning.main' }} /> },
  down: { label: 'Service Outage', icon: <ErrorIcon sx={{ color: 'error.main' }} /> },
  maintenance: { label: 'Under Maintenance', icon: <BuildIcon sx={{ color: 'info.main' }} /> },
  paused: { label: 'Paused', icon: <HelpCenterIcon sx={{ color: 'text.secondary' }} /> },
};

export const extTooltips: Record<string, string> = {
  'TikTok Publishing API': 'TikTok API health for video publishing and analytics retrieval.',
  'Meta Graph API': 'Meta Graph API health for account connections and posting.',
  'YouTube Data API': 'YouTube Data API health for video uploads and channel metrics syncing.',
};

export const friendlyNames: Record<string, string> = {
  'directly-social.vercel.app': 'Website & Dashboard',
  'Core API Gateway': 'Platform Services',
  'Primary Database': 'Data & Media Storage',
  'YouTube Data API': 'YouTube Connection',
  'Meta Graph API': 'Facebook & Instagram Connection',
  'TikTok Publishing API': 'TikTok Connection',
};

interface ServiceListItemProps {
  monitor: BetterStackMonitor;
  isExternal?: boolean;
}

export function ServiceListItem({ monitor: m, isExternal = false }: ServiceListItemProps) {
  const status = m.attributes.status;
  const cfg = statusMap[status as keyof typeof statusMap] || statusMap.paused;
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
      <Tooltip title={extTooltips[m.attributes.name]} arrow enterDelay={100} leaveDelay={200}>
        <Box component="div">{itemContent}</Box>
      </Tooltip>
    );
  }
  return <>{itemContent}</>;
}
