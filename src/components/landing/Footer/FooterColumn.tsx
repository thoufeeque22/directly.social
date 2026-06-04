'use client';

import React from 'react';
import { Stack, Typography } from '@mui/material';
import Link from 'next/link';
import { FooterLink } from './constants';

interface FooterColumnProps {
  title: string;
  links: FooterLink[];
}

export const FooterColumn = ({ title, links }: FooterColumnProps) => (
  <Stack spacing={2}>
    <Typography color="text.primary" sx={{ fontWeight: 700 }}>
      {title}
    </Typography>
    {links.map((link, i) => (
      <Typography
        key={i}
        component={Link}
        href={link.href}
        variant="body2"
        color="text.secondary"
        sx={{
          textDecoration: 'none',
          '&:hover': { color: 'primary.main' },
        }}
      >
        {link.label}
      </Typography>
    ))}
  </Stack>
);
