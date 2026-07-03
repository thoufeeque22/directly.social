"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Box, Button, LinearProgress, Alert, Grid, Typography } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { BetterStackMonitor } from '@/lib/schemas/status';
import { StatusHero } from './StatusHero';
import { ServiceList } from './ServiceList';
import { SidebarPanels } from './SidebarPanels';
import { IncidentsTimeline } from './IncidentsTimeline';

export function StatusDashboard({ scenario }: { scenario: string | null }) {
  const [monitors, setMonitors] = useState<BetterStackMonitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState('');

  const fetchData = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    setError(null);
    try {
      const url = `/api/status${scenario ? `?scenario=${scenario}` : ''}`;
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`Failed to fetch status: ${res.statusText || 'Error'}`);
      }
      const data = await res.json();
      setMonitors(data.data);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      if (!isSilent) setLoading(false);
    }
  }, [scenario]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
    const interval = setInterval(() => fetchData(true), 60000);
    return () => clearInterval(interval);
  }, [fetchData]);

  if (loading && monitors.length === 0) {
    return (
      <Box sx={{ width: '100%', mt: 4 }}>
        <LinearProgress />
      </Box>
    );
  }

  return (
    <Box component="main" sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {error && (
        <Alert severity="error" sx={{ borderRadius: 2 }}>
          System Status Error: {error}
        </Alert>
      )}
      {!error && (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
            <Typography variant="body2" color="text.secondary" aria-live="polite" aria-atomic="true">
              {lastUpdated ? `Last Updated: ${lastUpdated}` : ''}
            </Typography>
            <Button variant="outlined" startIcon={<RefreshIcon />} onClick={() => fetchData()} disabled={loading} sx={{ borderRadius: 2 }}>
              Refresh
            </Button>
          </Box>
          <StatusHero monitors={monitors} />
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 8 }} component="section">
              <ServiceList monitors={monitors} />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }} component="section">
              <SidebarPanels monitors={monitors} />
            </Grid>
          </Grid>
          <Box component="section">
            <IncidentsTimeline />
          </Box>
        </>
      )}
    </Box>
  );
}
