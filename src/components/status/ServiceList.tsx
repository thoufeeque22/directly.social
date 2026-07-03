"use client";

import React from 'react';
import { Paper, Typography, Box, List, ListItemButton, ListItemText, Tooltip, IconButton, Divider, Collapse } from '@mui/material';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import HelpCenterIcon from '@mui/icons-material/HelpCenter';
import { BetterStackMonitor } from '@/lib/schemas/status';
import { ServiceListItem, statusMap } from './ServiceListItem';

interface ServiceListProps {
  monitors: BetterStackMonitor[];
}

export function ServiceList({ monitors }: ServiceListProps) {
  const [coreExpanded, setCoreExpanded] = React.useState(false);

  const externalNames = ['TikTok Publishing API', 'Meta Graph API', 'YouTube Data API', 'TikTok API', 'Meta API', 'YouTube API'];
  const core = monitors.filter(m => {
    const name = m.attributes?.name || '';
    if (name.includes('directly-social.vercel.app')) return false; // Hide from UI
    return !externalNames.some(ext => name.includes(ext));
  });
  const external = monitors.filter(m => {
    const name = m.attributes?.name || '';
    return externalNames.some(ext => name.includes(ext));
  });

  // Calculate aggregate status for core services
  const coreStatusWeight = {
    down: 4,
    degraded: 3,
    maintenance: 2,
    paused: 1,
    up: 0,
  };
  
  const aggregateCoreStatus = core.reduce((worst, m) => {
    const s = m.attributes.status as keyof typeof coreStatusWeight;
    const currentWeight = coreStatusWeight[s] || 0;
    const worstWeight = coreStatusWeight[worst as keyof typeof coreStatusWeight] || 0;
    return currentWeight > worstWeight ? s : worst;
  }, 'up');

  const coreAggregateCfg = statusMap[aggregateCoreStatus as keyof typeof statusMap] || statusMap.paused;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Paper sx={{ p: 2, borderRadius: 3, border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
        <List disablePadding>
          <ListItemButton 
            onClick={() => setCoreExpanded(!coreExpanded)}
            sx={{ py: 1.5, px: 2, borderRadius: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', '&:hover': { bgcolor: 'action.hover' } }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <ListItemText primary={<Typography variant="h6" sx={{ fontWeight: 700 }}>Directly Social App Functionality</Typography>} />
              {coreExpanded ? <ExpandLess color="action" /> : <ExpandMore color="action" />}
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {coreAggregateCfg.icon}
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>{coreAggregateCfg.label}</Typography>
            </Box>
          </ListItemButton>
          <Collapse in={coreExpanded} timeout="auto" unmountOnExit>
            <List component="div" disablePadding sx={{ pl: 4, bgcolor: 'background.default', borderRadius: 2, mx: 2, mb: 2 }}>
              {core.map(m => <ServiceListItem key={m.id} monitor={m} />)}
            </List>
          </Collapse>
        </List>
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
        <List disablePadding>{external.map(m => <ServiceListItem key={m.id} monitor={m} isExternal />)}</List>
      </Paper>
    </Box>
  );
}
