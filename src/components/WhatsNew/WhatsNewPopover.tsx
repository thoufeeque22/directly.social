'use client';

import React, { useEffect, useState } from 'react';
import { Popover, Box, Typography, Button, CircularProgress } from '@mui/material';
import { markUpdateAsSeen } from '@/app/actions/whats-new';
import { getRecentUpdates } from '@/app/actions/whats-new-history';
import { useWhatsNew, Update } from './WhatsNewContext';
import { WhatsNewList } from './WhatsNewList';
import { WhatsNewHistoryList } from './WhatsNewHistoryList';

export function WhatsNewPopover({
  anchorEl,
  onClose,
}: {
  anchorEl: HTMLElement | null;
  onClose: () => void;
}) {
  const { updates, setUpdates } = useWhatsNew();
  const [localUpdates, setLocalUpdates] = useState<Update[]>([]);
  const [historicalUpdates, setHistoricalUpdates] = useState<Update[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const open = Boolean(anchorEl);

  useEffect(() => {
    if (open) {
      if (updates.length > 0) {
        const unread = [...updates];
        const timer = setTimeout(() => {
          setLocalUpdates(unread);
          setUpdates([]);
        }, 0);
        Promise.allSettled(unread.map((u) => markUpdateAsSeen(u.id)));
        return () => clearTimeout(timer);
      } else {
        setLoadingHistory(true);
        getRecentUpdates(5)
          .then((history) => {
            setHistoricalUpdates(history);
          })
          .catch((err) => {
            console.error('[WhatsNewPopover] Error fetching history:', err);
          })
          .finally(() => {
            setLoadingHistory(false);
          });
      }
    }
  }, [open, updates, setUpdates]);

  const handleDismissSingle = (id: string) => {
    setLocalUpdates((prev) => prev.filter((u) => u.id !== id));
  };

  const handleDismissAll = () => {
    setLocalUpdates([]);
  };

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      data-testid="whats-new-modal"
      slotProps={{
        paper: {
          sx: {
            mt: 1.5,
            p: 3,
            bgcolor: 'hsl(250, 30%, 10%)',
            borderRadius: '1rem',
            border: '1px solid hsla(250, 30%, 30%, 0.3)',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
            maxWidth: 400,
            width: 'calc(100vw - 32px)',
            overflowY: 'auto',
            maxHeight: '70vh',
          },
        },
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'primary.main' }}>
          What&apos;s New
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {localUpdates.length > 1 && (
            <Button
              size="small"
              onClick={handleDismissAll}
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

      {localUpdates.length > 0 ? (
        <WhatsNewList updates={localUpdates} onDismiss={handleDismissSingle} />
      ) : loadingHistory ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
          <CircularProgress size={24} />
        </Box>
      ) : (
        <WhatsNewHistoryList updates={historicalUpdates} />
      )}
    </Popover>
  );
}
