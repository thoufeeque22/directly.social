'use client';

import React from 'react';
import { Box, Typography, Stack, Paper, useTheme } from '@mui/material';
import Link from 'next/link';

interface DocLink {
  label: string;
  href: string;
}

interface DocCategory {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  links: DocLink[];
}

export const DocCategoryCard = ({ cat }: { cat: DocCategory }) => {
  const theme = useTheme();
  return (
    <Paper 
      id={cat.id}
      elevation={0}
      sx={{ 
        p: 4, 
        height: '100%', 
        borderRadius: 3, 
        border: `1px solid ${theme.palette.divider}`,
        bgcolor: 'background.paper',
        transition: 'transform 0.2s',
        '&:hover': { transform: 'translateY(-4px)' }
      }}
    >
      <Box sx={{ mb: 2 }}>{cat.icon}</Box>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>{cat.title}</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3, lineHeight: 1.6 }}>
        {cat.description}
      </Typography>
      <Stack spacing={1.5}>
        {cat.links.map((link, i) => (
          <Typography 
            key={i} 
            component={Link}
            href={link.href}
            variant="body2" 
            sx={{ 
              color: 'primary.main', 
              fontWeight: 600, 
              textDecoration: 'none',
              display: 'block',
              '&:hover': { textDecoration: 'underline' }
            }}
          >
            {link.label} →
          </Typography>
        ))}
      </Stack>
    </Paper>
  );
};
