'use client';

import * as React from 'react';
import MuiBreadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import Box from '@mui/material/Box';
import { BRAND } from '@/lib/core/brand';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

export interface BreadcrumbItem {
  name: string;
  url?: string; // If no url, it's the current page
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  // Generate JSON-LD Schema
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      ...(item.url ? { item: `${BRAND.url}${item.url}` } : {}),
    })),
  };

  return (
    <Box sx={{ mb: 3 }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <MuiBreadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        aria-label="breadcrumb"
        sx={{
          '& .MuiBreadcrumbs-separator': {
            color: 'text.secondary',
            mx: 0.5,
          },
        }}
      >
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return isLast || !item.url ? (
            <Typography
              key={index}
              variant="body2"
              color="text.primary"
              sx={{ fontWeight: 500 }}
            >
              {item.name}
            </Typography>
          ) : (
            <Link
              key={index}
              href={item.url}
              style={{ textDecoration: 'none' }}
              passHref
            >
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  '&:hover': {
                    color: 'primary.main',
                    textDecoration: 'underline',
                  },
                }}
              >
                {item.name}
              </Typography>
            </Link>
          );
        })}
      </MuiBreadcrumbs>
    </Box>
  );
}
