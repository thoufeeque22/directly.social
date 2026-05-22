'use client';

import React from 'react';
import { Box, Typography, Button } from '@mui/material';

interface HeaderProps {
  showDismissAll: boolean;
  onDismissAll: () => void;
  onClose: () => void;
}

export function WhatsNewPopoverHeader({
  showDismissAll,
  onDismissAll,
  onClose,
}: HeaderProps) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'primary.main' }}>
        What&apos;s New
      </Typography>
      <Box sx={{ display: 'flex', gap: 1 }}>
        {showDismissAll && (
          <Button
            size="small"
            onClick={onDismissAll}
            sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' }, textTransform: 'none', fontSize: '0.75rem' }}
          >
            Dismiss All
          </Button>
        )}
        <Button
          size="small"
          onClick={onClose}
          data-testid="whats-new-modal-close"
          sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' }, textTransform: 'none', fontSize: '0.75rem' }}
        >
          Close
        </Button>
      </Box>
    </Box>
  );
}
