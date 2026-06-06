'use client';

import React from 'react';
import { Box, Container, Typography, Paper, Stack, Avatar, useTheme } from '@mui/material';

const testimonials = [
  {
    name: 'Sarah J.',
    role: 'Lifestyle Creator',
    content: 'Switching from Buffer to Directly saved me $40/month and my videos actually go live instantly. The AI tone shifter is magic.',
    avatar: 'S'
  },
  {
    name: 'Mike D.',
    role: 'Tech YouTuber',
    content: 'As a developer, I love that I can own my data and use my own API keys. No middleware means no security risks.',
    avatar: 'M'
  },
  {
    name: 'Elena R.',
    role: 'Social Media Manager',
    content: 'The unified inbox being local-first is a game changer for client privacy. Best social tool of 2025.',
    avatar: 'E'
  },
  {
    name: 'David W.',
    role: 'Growth Hacker',
    content: 'Direct API access means I never hit those weird rate limits or delays. My content goes viral while others are still uploading.',
    avatar: 'D'
  }
];

export const Testimonials = () => {
  const theme = useTheme();

  return (
    <Box sx={{ py: { xs: 8, md: 12 } }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography variant="h2" gutterBottom sx={{ fontWeight: 800 }}>
            The Wall of Love
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Join 1,000+ creators who took the native pill.
          </Typography>
        </Box>

        <Box 
          sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, 
            gap: 4 
          }}
        >
          {testimonials.map((t, i) => (
            <Paper 
              key={i} 
              elevation={0} 
              sx={{ 
                p: 4, 
                borderRadius: 4, 
                border: `1px solid ${theme.palette.divider}`,
                bgcolor: 'background.paper'
              }}
            >
              <Stack spacing={3}>
                <Typography variant="body1" sx={{ fontStyle: 'italic', fontSize: '1.1rem' }}>
                  &quot;{t.content}&quot;
                </Typography>
                <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                  <Avatar sx={{ bgcolor: 'primary.main' }}>{t.avatar}</Avatar>
                  <Box>
                    <Typography sx={{ fontWeight: 700 }}>{t.name}</Typography>
                    <Typography variant="body2" color="text.secondary">{t.role}</Typography>
                  </Box>
                </Stack>
              </Stack>
            </Paper>
          ))}
        </Box>
      </Container>
    </Box>
  );
};
