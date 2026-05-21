'use client';

import { Popover, Box, Typography, Button, List, ListItem, ListItemText, Divider } from '@mui/material';
import { markUpdateAsSeen } from '@/app/actions/whats-new';
import { useWhatsNew } from '@/hooks/useWhatsNew';

export function WhatsNewPopover({ 
  anchorEl, 
  onClose 
}: { 
  anchorEl: HTMLElement | null; 
  onClose: () => void; 
}) {
  const { updates, setUpdates } = useWhatsNew();
  const open = Boolean(anchorEl);

  const handleClose = async (updateId: string) => {
    try {
      const result = await markUpdateAsSeen(updateId);
      if (!result.success) {
        console.warn('[WhatsNewPopover] Failed to mark update as seen:', result.error);
      }
    } catch (error) {
      console.error('[WhatsNewPopover] Error in markUpdateAsSeen:', error);
    } finally {
      // Always remove from local UI state to avoid stuck UI, even on error
      const remainingUpdates = updates.filter(u => u.id !== updateId);
      setUpdates(remainingUpdates);
      if (remainingUpdates.length === 0) onClose();
    }
  };

  const handleDismissAll = async () => {
    const currentUpdates = [...updates];
    onClose();
    setUpdates([]);
    // Then fire off all actions in background
    Promise.allSettled(currentUpdates.map(u => markUpdateAsSeen(u.id)));
  };

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
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
            maxHeight: '70vh'
          }
        }
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'primary.main' }}>
          What&apos;s New
        </Typography>
        {updates.length > 1 && (
          <Button 
            size="small" 
            onClick={handleDismissAll}
            sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' }, textTransform: 'none', fontSize: '0.75rem' }}
          >
            Dismiss All
          </Button>
        )}
      </Box>

      {updates.length === 0 ? (
        <Typography variant="body2" sx={{ color: 'text.secondary', py: 2, textAlign: 'center' }}>
          You&apos;re all caught up!
        </Typography>
      ) : (
        <List disablePadding>
          {updates.map((update, index) => (
            <div key={update.id}>
              <ListItem 
                sx={{ px: 0, py: 2 }}
                secondaryAction={
                  <Button 
                    variant="outlined"
                    size="small"
                    onClick={() => handleClose(update.id)}
                    sx={{ 
                      borderRadius: '0.5rem',
                      px: 1.5,
                      fontWeight: 600,
                      fontSize: '0.7rem',
                      textTransform: 'none'
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
      )}
    </Popover>
  );
}
