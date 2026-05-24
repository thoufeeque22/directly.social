'use client';

import React from 'react';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { useUploadFormContext } from './UploadFormContext';

export const AIStrategyNotice: React.FC = () => {
  const { aiTier, contentMode } = useUploadFormContext();

  if (aiTier === 'Manual') return null;

  return (
    <div style={{ 
      padding: '0.75rem', 
      borderRadius: '0.75rem', 
      background: 'hsla(var(--primary)/0.05)', 
      border: '1px solid hsla(var(--primary)/0.15)' 
    }}>
      <p style={{ 
        fontSize: '0.8rem', 
        color: 'hsl(var(--primary))', 
        margin: 0, 
        display: 'flex', 
        alignItems: 'center', 
        gap: '0.5rem' 
      }}>
        <AutoAwesomeIcon sx={{ fontSize: 16 }} />
        <span>
          <strong>AI Strategy:</strong> {aiTier === 'Enrich' ? 'Refining draft' : 'Generating content'} in <strong>{contentMode}</strong> style.
        </span>
      </p>
    </div>
  );
};
