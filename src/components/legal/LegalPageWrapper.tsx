import React from 'react';
import { Box, Container, Typography, Link, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export function LegalPageWrapper({
  children,
  title
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 8 }}>
      <Container maxWidth="md">
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button 
            component={Link} 
            href="/" 
            startIcon={<ArrowBackIcon />}
            sx={{ textDecoration: 'none' }}
          >
            Back to Home
          </Button>
          <Typography variant="h5" fontWeight={700} color="primary">
            {title}
          </Typography>
        </Box>
        {children}
        <Box sx={{ mt: 8, pt: 4, borderTop: '1px solid', borderColor: 'divider', textAlign: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            © {new Date().getFullYear()} Directly Social. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
