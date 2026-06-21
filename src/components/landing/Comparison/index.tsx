'use client';

import React from 'react';
import { Box, Container, Typography, Grid, Paper, Stack } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import { comparisonBad, comparisonGood } from '../data-secondary';
import { BRAND } from '@/lib/core/brand';

const ComparisonColumn = ({ title, items, type }: { title: string, items: string[], type: 'bad' | 'good' }) => {
  const isGood = type === 'good';
  
  return (
    <Paper 
      elevation={0}
      sx={{ 
        p: 4, 
        height: '100%',
        borderRadius: 4,
        border: '1px solid',
        borderColor: isGood ? 'success.main' : 'error.main',
        bgcolor: isGood ? 'hsla(145, 70%, 50%, 0.05)' : 'hsla(0, 70%, 50%, 0.05)',
        color: 'text.primary'
      }}
    >
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 4, color: isGood ? 'success.main' : 'error.main' }}>
        {title}
      </Typography>
      <Stack spacing={3}>
        {items.map((item, i) => (
          <Stack key={i} direction="row" spacing={2} sx={{ alignItems: 'flex-start' }}>
            {isGood ? 
              <CheckIcon sx={{ color: 'success.main', mt: 0.2 }} /> : 
              <CloseIcon sx={{ color: 'error.main', mt: 0.2 }} />
            }
            <Typography variant="body1" sx={{ fontWeight: 500, color: 'text.secondary' }}>
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
          <Typography variant="h2" sx={{ fontWeight: 800, mb: 3 }}>
            Break the Cycle
          </Typography>
          <Typography variant="h6" color="text.primary" sx={{ maxWidth: 750, mx: 'auto', fontWeight: 500, opacity: 0.9 }}>
            Why creators are switching to the Native Freedom of <strong>{BRAND.name}</strong>.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 6 }}>
            <ComparisonColumn 
              title={comparisonBad.title}
              type="bad"
              items={comparisonBad.items}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <ComparisonColumn 
              title={comparisonGood.title}
              type="good"
              items={comparisonGood.items}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};
