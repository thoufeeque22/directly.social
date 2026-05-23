import React from 'react';
import { Paper, Stack, Box, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

interface Props {
  config: { provider: string; bucketName: string };
  onDelete: () => void;
  loading: boolean;
}

export const ByosExistingConfig = ({ config, onDelete, loading }: Props) => (
  <Paper variant="outlined" sx={{ p: 3, mb: 4, borderRadius: 3, backgroundColor: 'rgba(0,0,0,0.01)' }}>
    <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
      <Box sx={{ typography: 'subtitle2', fontWeight: 600 }}>
        Active Storage: {config.provider} ({config.bucketName})
      </Box>
      <Button variant="outlined" color="error" size="small" startIcon={<DeleteIcon />} onClick={onDelete} disabled={loading} sx={{ borderRadius: 2 }}>
        Disconnect
      </Button>
    </Stack>
  </Paper>
);
