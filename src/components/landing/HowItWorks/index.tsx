'use client';

import React from 'react';
import { Box, Container, Typography, Grid, Paper, Stack, useTheme } from '@mui/material';
import { howItWorksSteps } from '../data';

export const HowItWorks = () => {
  const theme = useTheme();

  return (
    <Box id="how-it-works" sx={{ py: { xs: 8, md: 12 }, bgcolor: 'background.paper', position: 'relative', overflow: 'hidden' }}>
      {/* Subtle Glow */}
      <Box 
        sx={{ 
          position: 'absolute', 
          bottom: '-20%', 
          right: '-10%', 
          width: '50%', 
          height: '50%', 
          background: 'radial-gradient(circle, hsla(var(--primary), 0.05) 0%, transparent 70%)', 
          filter: 'blur(80px)',
          zIndex: 0,
          pointerEvents: 'none'
        }} 
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography variant="overline" color="primary" sx={{ letterSpacing: '0.1em', fontWeight: 700 }}>
            The Workflow
          </Typography>
          <Typography variant="h2" sx={{ mt: 2, mb: 3, fontWeight: 800 }}>
            How Native Publishing Works
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto' }}>
            Three simple steps to take back control of your distribution.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {howItWorksSteps.map((step, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Paper 
                elevation={0}
                sx={{ 
                  p: 4, 
                  height: '100%', 
                  borderRadius: 3, 
                  bgcolor: 'background.default',
                  border: `1px solid ${theme.palette.divider}`,
                  position: 'relative'
                }}
              >
                <Typography 
                  variant="h1" 
                  sx={{ 
                    position: 'absolute', 
                    top: -20, 
                    right: 20, 
                    fontSize: '6rem', 
                    fontWeight: 900, 
                    color: 'primary.main', 
                    opacity: 0.05,
                    userSelect: 'none'
                  }}
                >
                  {step.step}
                </Typography>
                <Stack spacing={2}>
                  <Box 
                    sx={{ 
                      width: 40, 
                      height: 40, 
                      borderRadius: '50%', 
                      bgcolor: 'primary.main', 
                      color: 'primary.foreground',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '1.2rem'
                    }}
                  >
                    {step.step}
                  </Box>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    {step.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                    {step.description}
                  </Typography>
                </Stack>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};
