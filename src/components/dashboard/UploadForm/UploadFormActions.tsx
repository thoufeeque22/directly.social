'use client';

import React from 'react';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import RefreshIcon from '@mui/icons-material/Refresh';
import UploadIcon from '@mui/icons-material/Upload';
import { useUploadFormContext } from './UploadFormContext';

export const UploadFormActions: React.FC = () => {
  const { 
    isUploading, aiTier, hasCachedPreviews, onResumeReview, onTierChange 
  } = useUploadFormContext();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem' }}>
      <div style={{ display: 'flex', gap: '1rem' }}>
        {hasCachedPreviews && !isUploading && (
          <button
            type="button"
            onClick={onResumeReview}
            style={secondaryButtonStyle}
          >
            <span>⏭️</span> Continue Reviewing
          </button>
        )}

        {aiTier === 'Manual' && !isUploading && (
          <button
            type="button"
            onClick={() => onTierChange('Enrich')}
            style={secondaryButtonStyle}
          >
            <AutoAwesomeIcon sx={{ fontSize: 18 }} /> Polish with AI
          </button>
        )}

        <button 
          type="submit" 
          disabled={isUploading}
          style={{ 
            ...primaryButtonStyle,
            flex: (hasCachedPreviews || (aiTier === 'Manual' && !isUploading)) ? 1.2 : 1,
            cursor: isUploading ? 'not-allowed' : 'pointer', 
          }}
        >
          {isUploading ? <UploadIcon className="animate-pulse" /> : (aiTier !== 'Manual' ? (hasCachedPreviews ? <RefreshIcon /> : <AutoAwesomeIcon />) : <RocketLaunchIcon />)}
          {isUploading ? 'Launching...' : (aiTier !== 'Manual' ? (hasCachedPreviews ? 'Regenerate Strategy' : 'Review AI Strategy') : 'Post Video')}
        </button>
      </div>

      {aiTier !== 'Manual' && !isUploading && (
        <button
          type="button"
          onClick={handleSkipReview}
          style={skipReviewButtonStyle}
        >
          <RocketLaunchIcon sx={{ fontSize: 16 }} /> Skip Review & Post Directly
        </button>
      )}
    </div>
  );
};

const handleSkipReview = (e: React.MouseEvent<HTMLButtonElement>) => {
  const form = (e.currentTarget.closest('form') as HTMLFormElement);
  const hidden = document.createElement('input');
  hidden.type = 'hidden';
  hidden.name = 'skipReview';
  hidden.value = 'true';
  form.appendChild(hidden);
  form.requestSubmit();
  setTimeout(() => hidden.remove(), 100);
};

const primaryButtonStyle: React.CSSProperties = {
  background: 'hsl(var(--primary))', 
  color: 'white', 
  border: 'none', 
  padding: '1rem', 
  borderRadius: '0.75rem', 
  fontWeight: 700, 
  boxShadow: '0 4px 12px hsla(var(--primary) / 0.2)', 
  fontSize: '1rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.5rem'
};

const secondaryButtonStyle: React.CSSProperties = {
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.5rem',
  padding: '1rem',
  borderRadius: '0.75rem',
  background: 'linear-gradient(135deg, hsla(var(--primary) / 0.1), hsla(var(--primary) / 0.05))',
  border: '1px solid hsla(var(--primary) / 0.3)',
  color: 'hsl(var(--primary))',
  fontWeight: 700,
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  fontSize: '0.9rem'
};

const skipReviewButtonStyle: React.CSSProperties = {
  background: 'transparent', 
  border: '1px solid hsla(var(--border)/0.5)', 
  color: 'hsl(var(--muted-foreground))', 
  padding: '0.75rem', 
  borderRadius: '0.75rem', 
  fontSize: '0.85rem', 
  cursor: 'pointer', 
  display: 'flex', 
  alignItems: 'center', 
  justifyContent: 'center', 
  gap: '0.5rem'
};
