'use client';

import React from 'react';
import { Theme } from '@mui/material/styles';
import {
  Box,
  Button,
  CircularProgress,
  Typography,
} from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import { DeleteConfirmationDialog } from './DeleteConfirmationDialog';

interface MediaActionsHUDProps {
  selectedIds: string[];
  isUploading: boolean;
  uploadStatus: string | null;
  onBulkDelete: () => void;
  onCancel: () => void;
}
const hudStyles = {
  position: 'fixed',
  bottom: '40px',
  left: '50%',
  transform: 'translateX(-50%)',
  width: 'max-content',
  minWidth: '400px',
  maxWidth: '90vw',
  bgcolor: 'background.paper',
  backdropFilter: 'blur(24px)',
  border: '1px solid',
  borderColor: 'primary.main',
  padding: '1rem 2rem',
  borderRadius: '1.5rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '2.5rem',
  boxShadow: (theme: Theme) => `0 30px 70px rgba(0,0,0,0.7), 0 0 0 1px ${theme.palette.primary.main}33`,
  zIndex: 9999,
  animation: 'slideUpHUD 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
};
export const MediaActionsHUD: React.FC<MediaActionsHUDProps> = ({
  selectedIds,
  isUploading,
  uploadStatus,
  onBulkDelete,
  onCancel,
}) => {
  const [dialogOpen, setDialogOpen] = React.useState(false);

  if (!isUploading && selectedIds.length === 0) {
    return null;
  }
  return (
    <>
      <Box sx={hudStyles}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {isUploading ? (
            <CloudUploadIcon color="primary" />
          ) : (
            <AutoAwesomeIcon color="primary" />
          )}
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            {isUploading
              ? uploadStatus
              : `${selectedIds.length} item${selectedIds.length === 1 ? '' : 's'} selected`}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          {!isUploading ? (
            <>
              <Button onClick={onCancel} color="inherit">
                Cancel
              </Button>
              <Button
                variant="contained"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => setDialogOpen(true)}
              >
                Delete Selected
              </Button>
            </>
          ) : (
            <CircularProgress size={24} />
          )}
        </Box>
      </Box>
      <DeleteConfirmationDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onConfirm={() => {
          onBulkDelete();
          setDialogOpen(false);
        }}
        message="Are you sure you want to delete the selected assets?"
      />
    </>
  );
};
