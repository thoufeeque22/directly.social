'use client';

import React from 'react';
import { List, ListItem, ListItemText, Typography, Button, Divider } from '@mui/material';
import { Update } from './WhatsNewContext';

interface WhatsNewListProps {
  updates: Update[];
  onDismiss: (id: string) => void;
}

export function WhatsNewList({ updates, onDismiss }: WhatsNewListProps) {
  return (
    <List disablePadding data-testid="whats-new-list">
      {updates.map((update, index) => (
        <div key={update.id}>
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
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', pr: 7 }}>
                  {update.description}
                </Typography>
              }
            />
          </ListItem>
          {index < updates.length - 1 && (
            <Divider sx={{ borderColor: 'hsla(250, 30%, 25%, 0.1)' }} />
          )}
        </div>
      ))}
    </List>
  );
}
