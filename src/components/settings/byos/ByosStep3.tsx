import React from 'react';
import { Box, Typography, Paper, Stack, CircularProgress, Alert, AlertTitle, Button } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';

interface Props {
  validationStage: 'idle' | 'checking' | 'success' | 'failed';
  checklist: { decrypt: string; bucket: string; permissions: string };
  error: string | null;
  success: boolean;
  loading: boolean;
  onSave: () => void;
}

const CheckItem = ({ status, label }: { status: string; label: string }) => (
  <Stack spacing={1.5} direction="row" sx={{ alignItems: 'center' }}>
    {status === 'loading' && <CircularProgress size={16} />}
    {status === 'success' && <CheckCircleIcon color="success" sx={{ fontSize: 18 }} />}
    {status === 'failed' && <ErrorIcon color="error" sx={{ fontSize: 18 }} />}
    {status === 'pending' && <Box sx={{ width: 18, height: 18, borderRadius: '50%', border: '1px solid #CCC' }} />}
    <Typography variant="body2">{label}</Typography>
  </Stack>
);

export const ByosStep3 = ({ validationStage, checklist, error, success, loading, onSave }: Props) => (
  <Box sx={{ mt: 3, mb: 2 }}>
    <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4 }}>
      Click validation button to verify bucket parameters and finalize setup.
    </Typography>
    {validationStage !== 'idle' && (
      <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, mb: 4, backgroundColor: 'rgba(0,0,0,0.01)' }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>Active Health Check Status</Typography>
        <Stack spacing={2}>
          <CheckItem status={checklist.decrypt} label="Encrypt credentials and authorize local database write" />
          <CheckItem status={checklist.bucket} label="Validate Bucket name, Region endpoints, and active authentication" />
          <CheckItem status={checklist.permissions} label="Perform pre-flight listing to verify multipart capabilities" />
        </Stack>
      </Paper>
    )}
    {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}><AlertTitle>Validation Failed</AlertTitle>{error}</Alert>}
    {success && <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}><AlertTitle>Connection Active</AlertTitle>BYOS setup complete and active.</Alert>}
    <Button fullWidth variant="contained" onClick={onSave} disabled={loading} sx={{ py: 1.5, borderRadius: 2, fontWeight: 600, textTransform: 'none' }}>
      {loading ? <CircularProgress size={24} color="inherit" /> : 'Run Active Connection Checks & Save'}
    </Button>
  </Box>
);
