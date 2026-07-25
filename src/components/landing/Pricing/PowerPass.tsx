import React from 'react';
import { Box, Paper, Typography, Button, CircularProgress } from '@mui/material';
import { useCheckout } from './useCheckout';
import { PricingTier } from './PricingCard';

export const PowerPass = ({ powerPass }: { powerPass: PricingTier | undefined }) => {
  const { handleCheckout, isLoading } = useCheckout();

  if (!powerPass) return null;

  return (
    <Box sx={{ mb: 6, display: 'flex', justifyContent: 'center' }}>
      <Paper 
        elevation={0}
        sx={{ 
          p: { xs: 2, md: 3 }, 
          borderRadius: 4, 
          bgcolor: 'primary.50',
          border: '1px solid',
          borderColor: 'primary.200',
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: 'center',
          gap: 3
        }}
      >
        <Typography variant="body1" sx={{ fontWeight: 600, color: 'primary.900' }}>
          ⚡ Just need to schedule a batch today? Get a 24-Hour Power Pass for {powerPass.price}.
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          size="small"
          onClick={() => handleCheckout(powerPass.id || '')}
          disabled={isLoading === powerPass.id}
          sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700, whiteSpace: 'nowrap' }}
        >
          {isLoading === powerPass.id ? <CircularProgress size={20} color="inherit" /> : powerPass.cta}
        </Button>
      </Paper>
    </Box>
  );
};
