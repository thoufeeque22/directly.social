'use client';

import React from 'react';
import { List, Divider } from '@mui/material';
import { Update } from './WhatsNewContext';
import { WhatsNewItem } from './WhatsNewItem';

interface WhatsNewListProps {
  updates: Update[];
  onDismiss: (id: string) => void;
}

export function WhatsNewList({ updates, onDismiss }: WhatsNewListProps) {
  return (
    <List disablePadding data-testid="whats-new-list">
      {updates.map((update, index) => (
        <React.Fragment key={update.id}>
          <WhatsNewItem update={update} onDismiss={onDismiss} />
          {index < updates.length - 1 && (
            <Divider sx={{ borderColor: 'divider', opacity: 0.2 }} />
          )}
        </React.Fragment>
      ))}
    </List>
  );
}
