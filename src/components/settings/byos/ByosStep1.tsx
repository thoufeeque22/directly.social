import React, { useState } from 'react';
import { Box, Typography, Paper, Stack, Button } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DoneIcon from '@mui/icons-material/Done';
import { CORS_JSON } from './ByosWizardUtils';

export const ByosStep1 = () => {
  const [copied, setCopied] = useState(false);

  const handleCopyCors = async () => {
    try {
      await navigator.clipboard.writeText(CORS_JSON);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err: unknown) {
      console.error('Failed to copy text', err);
    }
  };

  return (
    <Box sx={{ mt: 3, mb: 2 }}>
      <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3 }}>
        To allow safe direct uploads from your web browser to the storage bucket, you must enable CORS rules.
      </Typography>
      <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, backgroundColor: 'rgba(0,0,0,0.02)', position: 'relative' }}>
        <Stack spacing={1.5} direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Recommended CORS JSON Rules</Typography>
          <Button variant="outlined" size="small" startIcon={copied ? <DoneIcon /> : <ContentCopyIcon />}
            onClick={handleCopyCors} sx={{ borderRadius: 2, textTransform: 'none' }}>
            {copied ? 'Copied' : 'Copy Rules'}
          </Button>
        </Stack>
        <pre style={{ margin: 0, padding: '12px', borderRadius: '8px', backgroundColor: '#1E1E1E', color: '#D4D4D4', fontSize: '0.85rem', overflowX: 'auto', fontFamily: 'monospace' }}>
          {CORS_JSON}
        </pre>
      </Paper>
      <Typography variant="body2" sx={{ color: 'text.secondary', mt: 3 }}>
        Copy the configuration above and paste it inside the <strong>CORS policy</strong> section in your bucket settings.
      </Typography>
    </Box>
  );
};
