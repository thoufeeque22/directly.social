import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlined';

interface SupportSuccessProps {
  onReset: () => void;
}

/**
 * Centered success card displayed after a successful support form submission.
 */
export const SupportSuccess: React.FC<SupportSuccessProps> = ({ onReset }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        py: 4,
      }}
    >
      <CheckCircleOutlineIcon
        color="success"
        data-testid="CheckCircleOutlineIcon"
        sx={{ fontSize: 60, mb: 2 }}
      />
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: 'text.primary' }}>
        Support Request Received
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3, maxWidth: 480 }}>
        Thank you for reaching out. We have successfully logged your request and our support team will respond to your registered email address within 24 hours.
      </Typography>
      <Button
        variant="outlined"
        color="primary"
        onClick={onReset}
      >
        Submit Another Request
      </Button>
    </Box>
  );
};
