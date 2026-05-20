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
    await markUpdateAsSeen(updateId);
    onUpdateSeen(updateId);
    if (updates.length <= 1) onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ p: 4, bgcolor: 'background.paper', m: 'auto', mt: 10, maxWidth: 400 }}>
        <Typography variant="h6">What's New</Typography>
        <List>
          {updates.map((update) => (
            <ListItem key={update.id} secondaryAction={
              <Button onClick={() => handleClose(update.id)}>Got it</Button>
            }>
              <ListItemText primary={update.title} secondary={update.description} />
            </ListItem>
          ))}
        </List>
      </Box>
    </Modal>
  );
}
