'use client';

import React from 'react';
import { Box, Typography, Button, Modal, Paper } from '@mui/material';

interface LinkedInAuthBridgeModalProps {
  open: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

/**
 * Authorization Bridge Modal — required by the LinkedIn Marketing Developer Program.
 * Shown before redirecting the user to LinkedIn OAuth so they understand
 * what data will be accessed and stored (blueprint §4 Frontend).
 */
export const LinkedInAuthBridgeModal: React.FC<LinkedInAuthBridgeModalProps> = ({
  open,
  onConfirm,
  onClose,
}) => (
  <Modal
    open={open}
    onClose={onClose}
    aria-labelledby="linkedin-auth-bridge-title"
    data-testid="linkedin-auth-bridge-modal"
  >
    <Paper
      sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        p: 4,
        maxWidth: 480,
        width: '90vw',
        borderRadius: 2,
      }}
    >
      <Typography id="linkedin-auth-bridge-title" variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
        Connect Your LinkedIn Profile
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
        directly.social will request the following permissions from LinkedIn:
      </Typography>
      <Box component="ul" sx={{ pl: 2, mb: 2 }}>
        <li><Typography variant="body2">Read your basic profile information</Typography></li>
        <li><Typography variant="body2">Publish posts on your behalf</Typography></li>
      </Box>
      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
        Your access token is encrypted at rest (AES-256). You can revoke access
        at any time from LinkedIn settings or directly.social Settings.
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        <Button variant="outlined" onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={onConfirm}
          data-testid="linkedin-auth-bridge-confirm"
          sx={{ bgcolor: '#0A66C2', '&:hover': { bgcolor: '#004182' } }}
        >
          Continue to LinkedIn
        </Button>
      </Box>
    </Paper>
  </Modal>
);
