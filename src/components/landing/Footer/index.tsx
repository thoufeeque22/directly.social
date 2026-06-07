'use client';

import React from 'react';
import { Box, Container, Typography, Grid, Stack, useTheme } from '@mui/material';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import { FooterColumn } from './FooterColumn';
import { FOOTER_COLUMNS } from './constants';

export const LandingFooter = () => {
  const theme = useTheme();

  return (
    <Box 
      component="footer" 
      sx={{ 
        py: 8, 
        borderTop: `1px solid ${theme.palette.divider}`, 
        bgcolor: 'background.paper' 
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} sx={{ mb: 8 }}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Stack spacing={3}>
              <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                <RocketLaunchIcon color="primary" />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>Directly Social</Typography>
              </Stack>
              <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 300 }}>
                The native social media client designed for privacy, speed, and total creator freedom.
              </Typography>
            </Stack>
          </Grid>
          
          {FOOTER_COLUMNS.map((column, index) => (
            <Grid key={index} size={{ xs: 6, md: 2 }}>
              <FooterColumn title={column.title} links={column.links} />
            </Grid>
          ))}
        </Grid>

        <Box sx={{ pt: 4, borderTop: `1px solid ${theme.palette.divider}`, textAlign: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            © {new Date().getFullYear()} Directly Social. All rights reserved. Built for the native web.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};
