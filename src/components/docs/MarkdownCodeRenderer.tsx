'use client';

import dynamic from 'next/dynamic';
import { Box } from '@mui/material';

// Lazily load MermaidRenderer to avoid adding mermaid to the main client bundle
const MermaidComponent = dynamic(() => import('./MermaidComponent'), {
  ssr: false,
  loading: () => <Box sx={{ p: 2, textAlign: 'center', color: 'text.secondary' }}>Loading diagram...</Box>
});

export default MermaidComponent;
