'use client';

import React from 'react';
import { Box } from '@mui/material';
import { MermaidRenderer } from './MermaidRenderer';

/**
 * MermaidComponent acts as the Client Component wrapper for the Mermaid diagram renderer.
 * This satisfies Next.js requirements for dynamic imports.
 */
export default function MermaidComponent({ chart }: { chart: string }) {
  return (
    <Box sx={{ p: 2, textAlign: 'center', bgcolor: 'background.paper', borderRadius: 2 }}>
      <MermaidRenderer chart={chart} />
    </Box>
  );
}
