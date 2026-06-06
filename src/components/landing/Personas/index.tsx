'use client';

import React, { useState } from 'react';
import { Box, Container, Typography, Stack, ToggleButton, ToggleButtonGroup, Paper, useTheme, Grid } from '@mui/material';
import BrushIcon from '@mui/icons-material/Brush';
import CodeIcon from '@mui/icons-material/Code';

const personas = {
  creator: {
    title: 'For the Native Creator',
    description: 'Focus on your craft, not the tech. Directly handles the complexity of platform APIs so you can publish everywhere with one click.',
    benefits: [
      'One-click distribution to TikTok, IG, YT',
      'AI Vibe Sync for automated tone shifting',
      'Trending music discovery and sound-check',
      'Privacy-first local media vault'
    ]
  },
  developer: {
    title: 'For the Self-Hoster & Dev',
    description: 'Tired of closed SaaS ecosystems? Directly is open-core, extensible, and designed for those who want to own their infrastructure.',
    benefits: [
      'By-Your-Own-Key (BYOK) architecture',
      'Self-hostable or Local-only execution',
      'Extensible platform adapter system',
      'Zero-latency direct API integration'
    ]
  }
};

export const Personas = () => {
  const [view, setView] = useState<'creator' | 'developer'>('creator');
  const theme = useTheme();
  const content = personas[view];

  return (
    <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: 'action.hover' }}>
      <Container maxWidth="lg">
        <Stack spacing={6} sx={{ alignItems: 'center' }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h3" gutterBottom sx={{ fontWeight: 800 }}>
              Built for Every Workflow
            </Typography>
            <ToggleButtonGroup
              value={view}
              exclusive
              onChange={(_, v) => v && setView(v)}
              sx={{ mt: 3, bgcolor: 'background.paper' }}
            >
              <ToggleButton value="creator" sx={{ px: 4, py: 1.5, textTransform: 'none' }}>
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                  <BrushIcon />
                  <Typography sx={{ fontWeight: 600 }}>Creators</Typography>
                </Stack>
              </ToggleButton>
              <ToggleButton value="developer" sx={{ px: 4, py: 1.5, textTransform: 'none' }}>
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                  <CodeIcon />
                  <Typography sx={{ fontWeight: 600 }}>Developers</Typography>
                </Stack>
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>

          <Paper elevation={0} sx={{ p: { xs: 4, md: 8 }, borderRadius: 4, border: `1px solid ${theme.palette.divider}`, width: '100%', maxWidth: 900 }}>
            <Grid container spacing={6} sx={{ alignItems: 'center' }}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 800 }}>
                  {content.title}
                </Typography>
                <Typography variant="h6" color="text.secondary" sx={{ mb: 4, fontWeight: 400 }}>
                  {content.description}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Stack spacing={2}>
                  {content.benefits.map((benefit, i) => (
                    <Paper key={i} elevation={0} sx={{ p: 2, bgcolor: 'background.default', border: `1px solid ${theme.palette.divider}`, borderRadius: 2 }}>
                      <Typography sx={{ fontWeight: 600 }}>{benefit}</Typography>
                    </Paper>
                  ))}
                </Stack>
              </Grid>
            </Grid>
          </Paper>
        </Stack>
      </Container>
    </Box>
  );
};
