"use client";

import React from 'react';
import { 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogContentText, 
  DialogActions
} from '@mui/material';

interface DeleteConfirmationDialogProps {
  open: boolean;
  loading: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({
  open,
  loading,
  onClose,
  onConfirm
}) => {
  return (
    <Dialog
      open={open}
      onClose={() => !loading && onClose()}
    >
      <DialogTitle sx={{ fontWeight: 700 }}>Confirm Account Deletion</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you absolutely sure you want to delete your account? This action is permanent and all your data will be lost forever.
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button 
          onClick={onConfirm} 
          color="error" 
          variant="contained"
          disabled={loading}
        >
          {loading ? 'Deleting...' : 'Permanently Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
