'use client';

import React from 'react';
import { List, ListItem, ListItemText, Typography, Divider } from '@mui/material';
import { Update } from './WhatsNewContext';

interface WhatsNewActivityListProps {
  updates: Update[];
}

export function WhatsNewActivityList({ updates }: WhatsNewActivityListProps) {
  if (updates.length === 0) {
    return (
      <Typography variant="body2" sx={{ color: 'text.secondary', py: 2, textAlign: 'center' }}>
        You&apos;re all caught up! No recent updates.
      </Typography>
    );
  }

  return (
    <List disablePadding data-testid="whats-new-activity-list">
      {updates.map((update, index) => (
        <div key={update.id} style={{ opacity: 0.65 }}>
          <ListItem sx={{ px: 0, py: 1.5 }}>
            <ListItemText
              primary={
                <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                  {update.title}
                </Typography>
              }
              secondary={
                <Typography variant="caption" sx={{ color: 'text.disabled', display: 'block' }}>
                  {update.description}
                </Typography>
              }
            />
          </ListItem>
          {index < updates.length - 1 && (
            <Divider sx={{ borderColor: 'hsla(250, 30%, 25%, 0.05)' }} />
          )}
        </div>
      ))}
    </List>
  );
}
