'use client';
import React, { useState } from 'react';
import { Box, Typography, Paper, Button } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface Props {
  referralUrl: string;
}

export const ReferralCopier: React.FC<Props> = ({ referralUrl }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!referralUrl) return;
    navigator.clipboard.writeText(referralUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Box>
      <Typography variant="subtitle2" gutterBottom color="text.primary" sx={{ fontWeight: 600 }}>
        Your Unique Invite Link
      </Typography>
      <Paper 
        variant="outlined" 
        sx={{ 
          p: 0.5, pl: 2, display: 'flex', alignItems: 'center', 
          borderRadius: 2, borderColor: 'divider', bgcolor: 'background.default'
        }}
      >
        <Typography 
          variant="body2" 
          data-testid="referral-link-text"
          sx={{ flex: 1, fontFamily: 'monospace', color: referralUrl ? 'text.primary' : 'text.disabled', overflow: 'hidden', textOverflow: 'ellipsis' }}
        >
          {referralUrl || 'Loading your unique link...'}
        </Typography>
        <Button 
          variant="contained" 
          disableElevation
          onClick={handleCopy}
          disabled={!referralUrl}
          startIcon={copied ? <CheckCircleIcon /> : <ContentCopyIcon />}
          sx={{ 
            borderRadius: 1.5, textTransform: 'none', fontWeight: 600,
            bgcolor: copied ? 'success.main' : 'primary.main'
          }}
        >
          {copied ? 'Copied' : 'Copy'}
        </Button>
      </Paper>
    </Box>
  );
};
