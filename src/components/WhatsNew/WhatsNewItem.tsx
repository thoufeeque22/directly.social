'use client';

import React from 'react';
import { ListItem, ListItemText, Typography, Button } from '@mui/material';
import { Update } from './types';

interface WhatsNewItemProps {
  update: Update;
  onDismiss: (id: string) => void;
}

export function WhatsNewItem({ update, onDismiss }: WhatsNewItemProps) {
  return (
    <ListItem
      sx={{ px: 0, py: 2 }}
      secondaryAction={
        <Button
          variant="outlined"
          size="small"
          onClick={() => onDismiss(update.id)}
          data-testid={`dismiss-${update.id}`}
          sx={{
            borderRadius: '0.5rem',
            px: 1.5,
            fontWeight: 600,
            fontSize: '0.7rem',
            textTransform: 'none',
          }}
        >
          Got it
        </Button>
      }
    >
      <ListItemText
        primary={
          <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.2 }}>
            {update.title}
          </Typography>
        }
        secondary={
          <Typography variant="caption" sx={{ color: 'text.secondary', pr: 7, display: 'block' }}>
            {update.description}
          </Typography>
        }
      />
    </ListItem>
  );
}
