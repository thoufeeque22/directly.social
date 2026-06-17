'use client';

import React from 'react';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { useUploadFormContext } from './UploadFormContext';

export const AIStrategyNotice: React.FC = () => {
  const { aiTier, contentMode, aiProvider } = useUploadFormContext();

  if (aiTier === 'Manual') return null;

  return (
    <div 
      data-testid="ai-strategy-notice"
      style={{ 
        padding: '0.75rem', 
        borderRadius: '0.75rem', 
        background: 'hsla(var(--primary)/0.05)', 
        border: '1px solid hsla(var(--primary)/0.15)' 
      }}
    >
      <p style={{ 
        fontSize: '0.8rem', 
        color: 'hsl(var(--foreground))', 
        margin: 0, 
        display: 'flex', 
        alignItems: 'center', 
        gap: '0.5rem' 
      }}>
        <AutoAwesomeIcon sx={{ fontSize: 16, color: 'hsl(var(--primary))' }} />
        <span>
          <strong style={{ color: 'hsl(var(--primary))' }}>AI Strategy:</strong> {aiTier === 'Enrich' ? 'Refining draft' : 'Generating content'} in <strong style={{ color: 'hsl(var(--primary))' }}>{contentMode}</strong> style using <strong style={{ color: 'hsl(var(--primary))' }}>{aiProvider.charAt(0).toUpperCase() + aiProvider.slice(1)}</strong>.
        </span>
      </p>
    </div>
  );
};
