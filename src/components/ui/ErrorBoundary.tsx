'use client';

import { useEffect } from 'react';
import { Button, Typography, Box } from '@mui/material';
import * as Sentry from '@sentry/nextjs';

interface ErrorBoundaryProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorBoundary({ error, reset }: ErrorBoundaryProps) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <Box
      data-testid="error-boundary-ui"
      sx={{
        p: 4,
        borderRadius: 2,
        backdropFilter: 'blur(10px)',
        bgcolor: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
      }}
    >
      <Typography variant="h5" color="error">
        Something went wrong
      </Typography>
      <Typography variant="body1" color="text.secondary">
        {error.message || 'An unexpected error occurred. Please try again later.'}
      </Typography>
      <Button
        variant="contained"
        onClick={reset}
        sx={{ mt: 2 }}
        data-testid="error-reset-button"
      >
        Try again
      </Button>
    </Box>
  );
}
