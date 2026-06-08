'use client';

import React, { useEffect, useRef, useId } from 'react';
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
  const stableId = useId().replace(/:/g, '-');
  const mermaidId = `mermaid-${stableId}`;

  useEffect(() => {
    if (containerRef.current && chart) {
      // Clear previous content
      containerRef.current.innerHTML = '';
      
      mermaid.render(mermaidId, chart).then(({ svg }) => {
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
  }, [chart, mermaidId]);

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
