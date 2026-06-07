'use client';

import React, { useState } from 'react';
import { Box, Container, Typography, Stack, ToggleButton, ToggleButtonGroup, Paper, useTheme, Grid } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import BrushIcon from '@mui/icons-material/Brush';
import CodeIcon from '@mui/icons-material/Code';
import { personas } from '../data-secondary';

export const Personas = () => {
  const [view, setView] = useState<'creator' | 'developer'>('creator');
  const theme = useTheme();
  const content = personas[view];

  return (
    <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: 'action.hover' }}>
      <Container maxWidth="lg">
        <Stack spacing={6} sx={{ alignItems: 'center' }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="overline" color="primary" sx={{ fontWeight: 800, letterSpacing: '0.2em' }}>
              Your Workflow
            </Typography>
            <Typography variant="h2" sx={{ mt: 2, mb: 3, fontWeight: 800 }}>
              Built for Every Workflow
            </Typography>
            <ToggleButtonGroup
              value={view}
              exclusive
              onChange={(_, v) => v && setView(v)}
              sx={{ mt: 2, bgcolor: 'background.paper', borderRadius: 3, p: 0.5 }}
            >
              <ToggleButton value="creator" sx={{ px: { xs: 3, md: 5 }, py: 1.5, textTransform: 'none', borderRadius: '10px !important', border: 'none', '&.Mui-selected': { bgcolor: 'primary.main', color: 'primary.foreground' } }}>
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                  <BrushIcon fontSize="small" />
                  <Typography sx={{ fontWeight: 600 }}>Creators</Typography>
                </Stack>
              </ToggleButton>
              <ToggleButton value="developer" sx={{ px: { xs: 3, md: 5 }, py: 1.5, textTransform: 'none', borderRadius: '10px !important', border: 'none', '&.Mui-selected': { bgcolor: 'primary.main', color: 'primary.foreground' } }}>
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                  <CodeIcon fontSize="small" />
                  <Typography sx={{ fontWeight: 600 }}>Developers</Typography>
                </Stack>
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>

          <Paper elevation={0} sx={{ p: { xs: 4, md: 8 }, borderRadius: 4, border: `1px solid ${theme.palette.divider}`, width: '100%', maxWidth: 900, overflow: 'hidden' }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={view}
                initial={{ opacity: 0, x: view === 'creator' ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: view === 'creator' ? 20 : -20 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
              >
                <Grid container spacing={6} sx={{ alignItems: 'center' }}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="h4" sx={{ fontWeight: 800, mb: 2 }}>
                      {content.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 4, lineHeight: 1.7 }}>
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
              </motion.div>
            </AnimatePresence>
          </Paper>
        </Stack>
      </Container>
    </Box>
  );
};
