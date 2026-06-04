'use client';

import React from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, useTheme } from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';
import PsychologyIcon from '@mui/icons-material/Psychology';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import AllInclusiveIcon from '@mui/icons-material/AllInclusive';

const features = [
  {
    title: 'Native & Privacy-First',
    description: 'Direct API access with no middleware. Your data stays in your local vault, giving you absolute control.',
    icon: <SecurityIcon fontSize="large" color="primary" />,
  },
  {
    title: 'Global Vibe Sync',
    description: 'AI-powered tone shifting that adapts your content to the specific vibe of each platform and region.',
    icon: <PsychologyIcon fontSize="large" color="primary" />,
  },
  {
    title: 'Sound-Check',
    description: 'Algorithmic boost via native trend scanning. Find and sync the trending music that drives reach.',
    icon: <LibraryMusicIcon fontSize="large" color="primary" />,
  },
  {
    title: 'Unified Local Inbox',
    description: 'Cross-platform engagement managed entirely on your machine. No shared servers, no data leaks.',
    icon: <AllInclusiveIcon fontSize="large" color="primary" />,
  },
];

export const Features = () => {
  const theme = useTheme();

  return (
    <Box id="features" sx={{ py: { xs: 8, md: 12 } }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography variant="overline" color="primary" sx={{ letterSpacing: '0.1em', fontWeight: 700 }}>
            Core Magic
          </Typography>
          <Typography variant="h2" sx={{ mt: 2, mb: 3, fontWeight: 800 }}>
            The SaaS Tax is Over
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto' }}>
            Stop paying for middlemen to hold your data. Directly connects you to the platforms you love.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
              <Card 
                elevation={0} 
                sx={{ 
                  height: '100%', 
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 3,
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: theme.shadows[4],
                    borderColor: 'primary.main',
                  }
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};
