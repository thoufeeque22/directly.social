import React from 'react';
import { Metadata } from 'next';
import { Container, Box, Typography } from '@mui/material';
import { StatusDashboard } from '@/components/status/StatusDashboard';
import { BRAND } from '@/lib/core/brand';

export const metadata: Metadata = {
  title: `System Status | ${BRAND.name}`,
  description: `Real-time operational health and status dashboard for ${BRAND.name} services and external APIs.`,
};

interface PageProps {
  searchParams: Promise<{ scenario?: string }>;
}

export default async function StatusPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const scenario = resolvedParams.scenario || null;

  return (
    <Box sx={{ py: 8, bgcolor: 'background.default', minHeight: '100vh' }}>
      <Container maxWidth="lg">
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 800, mb: 4 }}>
          System Status
        </Typography>
        <StatusDashboard scenario={scenario} />
      </Container>
    </Box>
  );
}
