"use client";

import React, { useEffect, useState } from "react";
import { Box, Container, Typography, Grid, CircularProgress, Alert, Paper } from "@mui/material";
import { Heading } from "@/components/ui/Heading";
import { BillingCard, BillingInfo } from "./BillingCard";
import { BillingAlertBanner } from "./BillingAlertBanner";
import { FeatureAdoptionChart } from "./FeatureAdoptionChart";
import { PlatformHealthChart } from "./PlatformHealthChart";
import { SYSTEM_METRICS, FEATURE_LABELS } from "@/lib/core/metrics";

interface Metric { id: string; name: string; value: number; timestamp: string; }

export function AnalyticsContent() {
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [billing, setBilling] = useState<BillingInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const [aRes, bRes] = await Promise.all([fetch("/api/admin/analytics"), fetch("/api/admin/billing")]);
        if (!aRes.ok || !bRes.ok) throw new Error("Unauthorized or fetch failed");
        const aData = await aRes.json();
        const bData = await bRes.json();
        setMetrics(aData.metrics || []);
        setBilling(bData.billingProviders || []);
      } catch (err: any) { setError(err.message); } finally { setLoading(false); }
    }
    fetchDashboard();
  }, []);

  if (loading) return <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh" }}><CircularProgress /></Box>;
  if (error) return <Container maxWidth="lg" sx={{ mt: 4 }}><Alert severity="error">{error}</Alert></Container>;

  return (
    <Container maxWidth="xl" sx={{ py: 4 }} data-testid="admin-analytics-dashboard">
      <BillingAlertBanner billing={billing} />
      <Box sx={{ mb: 4 }}><Heading level={1}>Developer Analytics</Heading>
        <Typography variant="body1" color="text.secondary">Monitor system health and performance</Typography>
      </Box>

      <Grid container spacing={3}>
        {billing.length > 0 && <Grid sx={{ width: '100%' }}>
          <Typography variant="h6" gutterBottom sx={{ color: "primary.main", fontWeight: "bold", mb: 2 }}>API Billing Status</Typography>
          <Grid container spacing={2}>{billing.map(b => <Grid sx={{ width: { xs: '100%', sm: '50%', md: '25%' } }} key={b.id}><BillingCard billing={b} /></Grid>)}</Grid>
        </Grid>}

        <Grid sx={{ width: { xs: '100%', md: '66.66%' } }}>
          <FeatureAdoptionChart metrics={metrics} featureNames={Object.values(SYSTEM_METRICS.USAGE)} featureLabels={FEATURE_LABELS} />
        </Grid>
        <Grid sx={{ width: { xs: '100%', md: '33.33%' } }}>
          <PlatformHealthChart metrics={metrics} />
        </Grid>

        <Grid sx={{ width: '100%' }}><Grid container spacing={2}>
          {[
            { label: 'Total AI Requests', val: metrics.filter(m => m.name === SYSTEM_METRICS.USAGE.AI_CHATBOT).reduce((s, m) => s + m.value, 0) },
            { label: 'Total Scheduled Posts', val: metrics.filter(m => m.name === SYSTEM_METRICS.USAGE.CALENDAR).reduce((s, m) => s + m.value, 0) },
            { label: 'API Consumption (Google)', val: metrics.filter(m => m.name === SYSTEM_METRICS.CONSUMPTION.GOOGLE).reduce((s, m) => s + m.value, 0) },
            { label: 'Sentry Events', val: metrics.filter(m => m.name === SYSTEM_METRICS.CONSUMPTION.SENTRY).reduce((s, m) => s + m.value, 0) },
          ].map((item, idx) => (
            <Grid sx={{ width: { xs: '100%', sm: '50%', md: '25%' } }} key={idx}>
              <Paper elevation={0} sx={{ p: 2, borderRadius: 2, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', textAlign: 'center' }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: "bold", textTransform: 'uppercase' }}>{item.label}</Typography>
                <Typography variant="h4" color="primary" sx={{ fontWeight: "bold" }}>{item.val.toLocaleString()}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid></Grid>
      </Grid>
    </Container>
  );
}
