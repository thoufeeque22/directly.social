'use client';

import dynamic from 'next/dynamic';
import 'swagger-ui-react/swagger-ui.css';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { CircularProgress, Box, Typography } from '@mui/material';

const SwaggerUI = dynamic(() => import('swagger-ui-react'), { 
  ssr: false,
  loading: () => (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
      <CircularProgress />
    </Box>
  )
});

export default function ApiDocsPage() {
  const { data: session, status } = useSession();

  // Production Protection: Only ADMINs can view docs in production
  if (process.env.NODE_ENV === 'production') {
    if (status === 'loading') return null;
    if (session?.user?.role !== 'ADMIN') {
      redirect('/');
    }
  }

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
      <Box sx={{ maxWidth: 1200, mx: 'auto', px: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          API Documentation
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          Interactive OpenAPI explorer for Social Studio App Route Handlers.
        </Typography>
        <Box sx={{ bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1, overflow: 'hidden' }}>
          <SwaggerUI url="/api/openapi.json" />
        </Box>
      </Box>
    </Box>
  );
}
