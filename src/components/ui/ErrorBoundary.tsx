'use client';

import { useEffect } from 'react';
import { Button, Typography, Box } from '@mui/material';
import ErrorOutlinedIcon from '@mui/icons-material/ErrorOutlined';
import * as Sentry from '@sentry/nextjs';
import { GlassCard } from './GlassCard';

interface ErrorBoundaryProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorBoundary({ error, reset }: ErrorBoundaryProps) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <GlassCard style={{ maxWidth: '500px', width: '100%', padding: '3rem', textAlign: 'center' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        <ErrorOutlinedIcon sx={{ fontSize: 64, color: 'error.main', opacity: 0.8 }} />
        <Typography variant="h5" sx={{ fontWeight: 600, color: 'error.main' }}>
          Something went wrong
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', mb: 2 }}>
          {error.message || 'An unexpected error occurred. Please try again later.'}
        </Typography>
        <Button
          variant="contained"
          onClick={reset}
          fullWidth
          sx={{ 
            py: 1.5, 
            borderRadius: '0.75rem', 
            fontWeight: 600,
            textTransform: 'none',
            fontSize: '1rem'
          }}
          data-testid="error-reset-button"
        >
          Try again
        </Button>
      </Box>
    </GlassCard>
  );
}
