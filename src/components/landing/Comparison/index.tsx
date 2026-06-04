'use client';

import React from 'react';
import { Box, Container, Typography, Grid, Paper, Stack } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';

const ComparisonColumn = ({ title, items, type }: { title: string, items: string[], type: 'bad' | 'good' }) => {
  const isGood = type === 'good';
  
  return (
    <Paper 
      elevation={0}
      sx={{ 
        p: 4, 
        height: '100%',
        borderRadius: 4,
        border: '2px solid',
        borderColor: isGood ? 'success.light' : 'error.light',
        bgcolor: isGood ? 'success.main' : 'error.main',
        opacity: isGood ? 1 : 0.8,
        color: 'white'
      }}
    >
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 4 }}>
        {title}
      </Typography>
      <Stack spacing={3}>
        {items.map((item, i) => (
          <Stack key={i} direction="row" spacing={2} sx={{ alignItems: 'flex-start' }}>
            {isGood ? <CheckIcon /> : <CloseIcon />}
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {item}
            </Typography>
          </Stack>
        ))}
      </Stack>
    </Paper>
  );
};

export const Comparison = () => {
  return (
    <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: 'background.default' }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography variant="h2" gutterBottom sx={{ fontWeight: 800 }}>
            Break the Cycle
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Why creators are switching to the Native Freedom of Directly.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 6 }}>
            <ComparisonColumn 
              title="Legacy Middlemen"
              type="bad"
              items={[
                "Monthly subscription fees ($50+/mo)",
                "They own your distribution keys",
                "Your content is stored on their servers",
                "Limited to their 'approved' platforms",
                "Slow API proxies and delays"
              ]}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <ComparisonColumn 
              title="Native Freedom"
              type="good"
              items={[
                "Zero platform fees (Free Core)",
                "You own your distribution keys",
                "Content stays in your local vault",
                "Native API access for peak speed",
                "Connect anything with Direct Access"
              ]}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};
