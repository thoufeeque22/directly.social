'use client';

import React from 'react';
import { Box, Typography, Card, CardContent, Button, Stack, useTheme } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import Link from 'next/link';

interface PricingTier {
  name: string;
  price: string;
  period?: string;
  description: string;
  features: readonly string[];
  cta: string;
  highlighted?: boolean;
  disabled?: boolean;
}

export const PricingCard = ({ tier }: { tier: PricingTier }) => {
  const theme = useTheme();
  const isAuthenticated = false; // Landing page is only rendered when logged out

  return (
    <Card 
      elevation={tier.highlighted ? 8 : 0}
      sx={{ 
        height: '100%', 
        borderRadius: 4, 
        border: tier.highlighted ? `2px solid ${theme.palette.primary.main}` : `1px solid ${theme.palette.divider}`,
        position: 'relative'
      }}
    >
      <CardContent sx={{ p: 5 }}>
        {tier.highlighted && (
          <Box 
            sx={{ 
              position: 'absolute', 
              top: 24, 
              right: 24, 
              px: 2, 
              py: 0.5, 
              bgcolor: 'primary.main', 
              color: 'white', 
              borderRadius: 1, 
              fontSize: 12, 
              fontWeight: 700 
            }}
          >
            RECOMMENDED
          </Box>
        )}
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 800 }}>
          {tier.name}
        </Typography>
        <Stack direction="row" spacing={1} sx={{ mb: 2, alignItems: 'baseline' }}>
          <Typography variant="h2" sx={{ fontWeight: 800 }}>{tier.price}</Typography>
          {tier.period && <Typography variant="h6" color="text.secondary">{tier.period}</Typography>}
        </Stack>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          {tier.description}
        </Typography>
        
        <Stack spacing={2} sx={{ mb: 4 }}>
          {tier.features.map((feature, i) => (
            <Stack key={i} direction="row" spacing={2} sx={{ alignItems: 'center' }}>
              <CheckIcon color="primary" fontSize="small" />
              <Typography variant="body2" sx={{ fontWeight: 500 }}>{feature}</Typography>
            </Stack>
          ))}
        </Stack>

        <Button 
          fullWidth 
          variant={tier.highlighted ? 'contained' : 'outlined'} 
          size="large"
          component={Link}
          href={tier.disabled ? '#' : (isAuthenticated ? '/' : '/login')}
          disabled={tier.disabled}
          sx={{ py: 1.5, borderRadius: 2, textTransform: 'none', fontWeight: 700, mb: 1 }}
        >
          {tier.disabled ? tier.cta : (isAuthenticated ? 'Go to Dashboard' : tier.cta)}
        </Button>
        
        <Button
          fullWidth
          variant="text"
          size="small"
          component={Link}
          href="#compare"
          sx={{ textTransform: 'none', color: 'text.secondary', fontWeight: 600 }}
        >
          View all features
        </Button>
      </CardContent>
    </Card>
  );
};
