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
  // Calculate average uptime from real monitors
  const validUptimes = monitors.filter(m => m.attributes.uptime_percentage !== undefined && m.attributes.uptime_percentage !== null);
  const avgUptime = validUptimes.length > 0 
    ? validUptimes.reduce((acc, m) => acc + Number(m.attributes.uptime_percentage), 0) / validUptimes.length 
    : 100;
  
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>90-Day Uptime</Typography>
        <Divider sx={{ mb: 2 }} />
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
          <Typography variant="h3" sx={{ fontWeight: 800, color: 'success.main' }}>{avgUptime.toFixed(2)}%</Typography>
          <Typography variant="body2" color="text.secondary">average uptime</Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Platform reliability and external API connectivity are tracked continuously.
        </Typography>
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
