'use client';

import { Modal, Box, Typography, Button, List, ListItem, ListItemText, Divider } from '@mui/material';
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

  const handleDismissAll = async () => {
    // Optimistically clear all in UI
    const currentUpdates = [...updates];
    onClose();
    // Then fire off all actions in background
    Promise.allSettled(currentUpdates.map(u => markUpdateAsSeen(u.id)));
  };

  return (
    <Modal 
      open={open} 
      onClose={onClose} 
      data-testid="whats-new-modal"
      sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <Box sx={{ 
        p: 4, 
        bgcolor: 'hsl(250, 30%, 10%)', // Opaque background
        borderRadius: '1.25rem',
        border: '1px solid hsla(250, 30%, 30%, 0.3)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        maxWidth: 500,
        width: '90%',
        maxHeight: '80vh',
        overflowY: 'auto',
        outline: 'none'
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
            What&apos;s New
          </Typography>
          {updates.length > 1 && (
            <Button 
              size="small" 
              onClick={handleDismissAll}
              sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' }, textTransform: 'none' }}
            >
              Dismiss All
            </Button>
          )}
        </Box>
        <List disablePadding>
          {updates.map((update, index) => (
            <div key={update.id}>
              <ListItem 
                sx={{ px: 0, py: 2.5 }}
                secondaryAction={
                  <Button 
                    variant="contained"
                    size="small"
                    data-testid="whats-new-modal-close" 
                    onClick={() => handleClose(update.id)}
                    sx={{ 
                      borderRadius: '0.75rem',
                      px: 2,
                      fontWeight: 600,
                      boxShadow: 'none',
                      '&:hover': { boxShadow: '0 4px 12px hsla(250, 80%, 60%, 0.3)' }
                    }}
                  >
                    Got it
                  </Button>
                }
              >
                <ListItemText 
                  primary={
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                      {update.title}
                    </Typography>
                  } 
                  secondary={
                    <Typography variant="body2" sx={{ color: 'text.secondary', pr: 8 }}>
                      {update.description}
                    </Typography>
                  } 
                />
              </ListItem>
              {index < updates.length - 1 && (
                <Divider sx={{ borderColor: 'hsla(250, 30%, 25%, 0.2)' }} />
              )}
            </div>
          ))}
        </List>
      </Box>
    </Modal>
  );
}
