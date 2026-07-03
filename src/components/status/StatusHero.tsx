import React from 'react';
import { Paper, Box, Typography } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import BuildIcon from '@mui/icons-material/Build';
import { BetterStackMonitor } from '@/lib/schemas/status';

interface StatusHeroProps {
  monitors: BetterStackMonitor[];
}

export function StatusHero({ monitors }: StatusHeroProps) {
  let globalStatus: 'up' | 'degraded' | 'down' | 'maintenance' = 'up';

  if (monitors.some(m => m.attributes.status === 'down')) {
    globalStatus = 'down';
  } else if (monitors.some(m => m.attributes.status === 'degraded')) {
    globalStatus = 'degraded';
  } else if (monitors.some(m => m.attributes.status === 'maintenance')) {
    globalStatus = 'maintenance';
  }

  const config = {
    up: {
      title: 'All Systems Operational',
      subtitle: 'All core platforms and external APIs are operating normally.',
      bgColor: 'success.light',
      color: 'success.dark',
      icon: <CheckCircleIcon data-testid="CheckCircleIcon" sx={{ fontSize: 40, color: 'success.main' }} />,
    },
    degraded: {
      title: 'Degraded Performance',
      subtitle: 'Some integrations or platform services are experiencing issues. We are actively working to restore full functionality.',
      bgColor: 'warning.light',
      color: 'warning.dark',
      icon: <WarningIcon data-testid="WarningIcon" sx={{ fontSize: 40, color: 'warning.main' }} />,
    },
    down: {
      title: 'System Outage',
      subtitle: 'Major service disruption detected. Our engineering team is actively investigating. Most issues are resolved within 15-30 minutes.',
      bgColor: 'error.light',
      color: 'error.dark',
      icon: <ErrorIcon data-testid="ErrorIcon" sx={{ fontSize: 40, color: 'error.main' }} />,
    },
    maintenance: {
      title: 'Scheduled Maintenance',
      subtitle: 'Routine maintenance is currently in progress.',
      bgColor: 'info.light',
      color: 'info.dark',
      icon: <BuildIcon data-testid="BuildIcon" sx={{ fontSize: 40, color: 'info.main' }} />,
    },
  };

  const current = config[globalStatus];

  return (
    <Paper
      data-testid="status-hero"
      sx={{
        p: 3,
        display: 'flex',
        alignItems: 'center',
        gap: 3,
        borderRadius: 3,
        bgcolor: current.bgColor,
        color: current.color,
        border: '1px solid',
        borderColor: 'divider',
        boxShadow: 'none',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center' }}>{current.icon}</Box>
      <Box>
        <Typography variant="h5" sx={{ fontWeight: 700 }} gutterBottom>
          {current.title}
        </Typography>
        <Typography variant="body1">{current.subtitle}</Typography>
      </Box>
    </Paper>
  );
}
