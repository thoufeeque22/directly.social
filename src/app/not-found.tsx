'use client';

import Link from 'next/link';
import { Typography, Box, Button } from '@mui/material';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import { GlassCard } from '@/components/ui/GlassCard';
import { useSession } from 'next-auth/react';

export default function NotFound() {
  const { status } = useSession();
  const isAuth = status === 'authenticated';

  return (
    <div style={{ 
      minHeight: '80vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <GlassCard style={{ maxWidth: '500px', width: '100%', padding: '3rem', textAlign: 'center' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <SearchOffIcon sx={{ fontSize: 64, color: 'text.secondary', opacity: 0.5 }} />
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Page Not Found
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', mb: 2 }}>
            The page you are looking for doesn&apos;t exist or has been moved.
          </Typography>
          
          <Button
            component={Link}
            href="/"
            variant="contained"
            fullWidth
            sx={{ 
              py: 1.5, 
              borderRadius: '0.75rem', 
              fontWeight: 600,
              textTransform: 'none',
              fontSize: '1rem'
            }}
          >
            {isAuth ? 'Return to Dashboard' : 'Back to Home'}
          </Button>
        </Box>
      </GlassCard>
    </div>
  );
}
