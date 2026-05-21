'use client';

import { Modal, Box, Typography, Button, List, ListItem, ListItemText } from '@mui/material';
import { markUpdateAsSeen } from '@/app/actions/whats-new';

interface Update {
  id: string;
  title: string;
  description: string;
}

export function WhatsNewModal({ open, onClose, updates, onUpdateSeen }: { 
  open: boolean; 
  onClose: () => void; 
  updates: Update[];
  onUpdateSeen: (id: string) => void;
}) {
  const handleClose = async (updateId: string) => {
    try {
      const result = await markUpdateAsSeen(updateId);
      if (!result.success) {
        console.warn('[WhatsNewModal] Failed to mark update as seen:', result.error);
      }
    } catch (error) {
      console.error('[WhatsNewModal] Error in markUpdateAsSeen:', error);
    } finally {
      // Always remove from local UI state to avoid stuck UI, even on error
      onUpdateSeen(updateId);
      if (updates.length <= 1) onClose();
    }
  };

  return (
    <Modal open={open} onClose={onClose} data-testid="whats-new-modal">
      <Box sx={{ p: 4, bgcolor: 'background.paper', m: 'auto', mt: 10, maxWidth: 400 }}>
        <Typography variant="h6">What&apos;s New</Typography>
        <List>
          {updates.map((update) => (
            <ListItem key={update.id} secondaryAction={
              <Button data-testid="whats-new-modal-close" onClick={() => handleClose(update.id)}>Got it</Button>
            }>
              <ListItemText primary={update.title} secondary={update.description} />
            </ListItem>
          ))}
        </List>
      </Box>
    </Modal>
  );
}
