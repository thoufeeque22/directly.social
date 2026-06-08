'use client';

import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';
import { Box } from '@mui/material';

// Initialize mermaid
mermaid.initialize({
  startOnLoad: true,
  theme: 'default',
  securityLevel: 'loose',
  fontFamily: 'inherit',
});

interface MermaidRendererProps {
  chart: string;
}

export const MermaidRenderer: React.FC<MermaidRendererProps> = ({ chart }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current && chart) {
      // Clear previous content
      containerRef.current.innerHTML = '';
      
      const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
      
      mermaid.render(id, chart).then(({ svg }) => {
        if (containerRef.current) {
          containerRef.current.innerHTML = svg;
        }
      }).catch((err) => {
        console.error('Mermaid rendering failed:', err);
        if (containerRef.current) {
          containerRef.current.innerHTML = `<pre>Error rendering diagram: ${err.message}</pre>`;
        }
      });
    }
  }, [chart]);

  return (
    <Box 
      ref={containerRef} 
      sx={{ 
        my: 4, 
        display: 'flex', 
        justifyContent: 'center',
        '& svg': {
          maxWidth: '100%',
          height: 'auto',
        }
      }} 
    />
  );
};
