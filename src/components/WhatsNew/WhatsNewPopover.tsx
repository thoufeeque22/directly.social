'use client';

import React from 'react';
import { Popover, Box, CircularProgress } from '@mui/material';
import { useWhatsNew } from './WhatsNewContext';
import { WhatsNewList } from './WhatsNewList';
import { WhatsNewHistoryList } from './WhatsNewHistoryList';
import { WhatsNewPopoverHeader } from './WhatsNewPopoverHeader';
import { useWhatsNewPopover } from './useWhatsNewPopover';
import { popoverPaperSx } from './PopoverStyles';

export function WhatsNewPopover({ anchorEl, onClose }: { anchorEl: HTMLElement | null; onClose: () => void }) {
  const { updates, setUpdates } = useWhatsNew();
  const { localUpdates, setLocalUpdates, historicalUpdates, loading } =
    useWhatsNewPopover(Boolean(anchorEl), updates, setUpdates);
  const dismiss = (id: string) => setLocalUpdates((p) => p.filter((u) => u.id !== id));

  return (
    <Popover
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      slotProps={{ paper: { sx: popoverPaperSx } }}
    >
      <Box data-testid="whats-new-modal">
        <WhatsNewPopoverHeader
          showDismissAll={localUpdates.length > 1}
          onDismissAll={() => setLocalUpdates([])}
          onClose={onClose}
        />
        {localUpdates.length > 0 ? (
          <WhatsNewList updates={localUpdates} onDismiss={dismiss} />
        ) : loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}><CircularProgress size={24} /></Box>
        ) : (
          <WhatsNewHistoryList updates={historicalUpdates} />
        )}
      </Box>
    </Popover>
  );
}
