import React from 'react';
import { Paper, Typography, Box, Divider, List, ListItem, Chip } from '@mui/material';

interface MaintenanceEvent {
  title: string;
  time: string;
  description: string;
}

const maintenanceEvents: MaintenanceEvent[] = [];

import { BetterStackMonitor } from '@/lib/schemas/status';

export function SidebarPanels({ monitors }: { monitors: BetterStackMonitor[] }) {
  // Shared filter logic
  const externalNames = ['YouTube', 'Meta', 'TikTok'];
  
  const coreMonitors = monitors.filter(m => {
    const name = m.attributes?.name || '';
    return !externalNames.some(ext => name.includes(ext));
  });
  
  const externalMonitors = monitors.filter(m => {
    const name = m.attributes?.name || '';
    return externalNames.some(ext => name.includes(ext));
  });

  const getAvg = (list: BetterStackMonitor[]) => {
    const valid = list.filter(m => m.attributes.uptime_percentage !== undefined && m.attributes.uptime_percentage !== null);
    if (valid.length === 0) return 100;
    return valid.reduce((acc, m) => acc + Number(m.attributes.uptime_percentage), 0) / valid.length;
  };

  const coreUptime = getAvg(coreMonitors);
  const externalUptime = getAvg(externalMonitors);
  
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>90-Day Uptime</Typography>
        <Divider sx={{ mb: 2 }} />
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>Directly Social Platform</Typography>
            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
              <Typography variant="h4" sx={{ fontWeight: 800, color: 'success.main' }}>{coreUptime.toFixed(2)}%</Typography>
            </Box>
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>Social Media Connections</Typography>
            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
              <Typography variant="h4" sx={{ fontWeight: 800, color: 'success.main' }}>{externalUptime.toFixed(2)}%</Typography>
            </Box>
          </Box>
        </Box>
      </Paper>

      <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Upcoming Maintenance</Typography>
        <Divider sx={{ mb: 2 }} />
        {maintenanceEvents.length === 0 ? (
          <Typography variant="body2" color="text.secondary">No upcoming maintenance scheduled.</Typography>
        ) : (
          <List disablePadding>
            {maintenanceEvents.map((event, idx) => (
              <ListItem key={idx} disableGutters sx={{ flexDirection: 'column', alignItems: 'flex-start', py: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mb: 0.5 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{event.title}</Typography>
                  <Chip label="Scheduled" size="small" color="info" variant="outlined" />
                </Box>
                <Typography variant="caption" color="primary" sx={{ mb: 1, fontWeight: 500 }}>{event.time}</Typography>
                <Typography variant="body2" color="text.secondary">{event.description}</Typography>
              </ListItem>
            ))}
          </List>
        )}
      </Paper>
    </Box>
  );
}
