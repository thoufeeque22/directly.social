'use client';
/* eslint-disable max-lines */
import React from 'react';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import RefreshIcon from '@mui/icons-material/Refresh';
import UploadIcon from '@mui/icons-material/Upload';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import { useUploadFormContext } from './UploadFormContext';
import { primaryButtonStyle, secondaryButtonStyle, skipReviewButtonStyle } from './UploadFormActions.styles';
import { checkCacheValidity } from './UploadFormContext.utils';

export const UploadFormActions: React.FC = () => {
  const { 
    isUploading, aiTier, contentMode, hasCachedPreviews, onResumeReview, onTierChange,
    title, description, selectedPlatforms
  } = useUploadFormContext();

  const isCacheValid = React.useMemo(() => {
    if (!hasCachedPreviews) return false;
    try {
      const savedContext = localStorage.getItem('SS_AI_PREVIEWS_CONTEXT');
      if (!savedContext) return false;
      return checkCacheValidity(
        { title, description, platforms: selectedPlatforms, aiTier, contentMode },
        JSON.parse(savedContext)
      );
    } catch (e) {
      return false;
    }
  }, [hasCachedPreviews, title, description, selectedPlatforms, aiTier, contentMode]);

  const handleSkipReview = (e: React.MouseEvent<HTMLButtonElement>) => {
    const form = (e.currentTarget.closest('form') as HTMLFormElement);
    const hidden = document.createElement('input');
    hidden.type = 'hidden'; hidden.name = 'skipReview'; hidden.value = 'true';
    form.appendChild(hidden);
    form.requestSubmit();
    setTimeout(() => hidden.remove(), 100);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem' }}>
      <div style={{ display: 'flex', gap: '1rem' }}>
        {isCacheValid && !isUploading && (
          <button type="button" onClick={onResumeReview} style={secondaryButtonStyle}>
            <SkipNextIcon sx={{ fontSize: 18 }} /> Resume Review
          </button>
        )}
        {aiTier === 'Manual' && !isUploading && (
          <button type="button" onClick={() => React.startTransition(() => { onTierChange('Enrich'); })} style={secondaryButtonStyle}>
            <AutoAwesomeIcon sx={{ fontSize: 18 }} /> Polish with AI
          </button>
        )}
        <button type="submit" disabled={isUploading} style={{ 
          ...primaryButtonStyle, flex: (isCacheValid || (aiTier === 'Manual' && !isUploading)) ? 1.2 : 1,
          cursor: isUploading ? 'not-allowed' : 'pointer' 
        }}>
          {isUploading ? <UploadIcon className="animate-pulse" /> : (aiTier !== 'Manual' ? (isCacheValid ? <RefreshIcon /> : <AutoAwesomeIcon />) : <RocketLaunchIcon />)}
          {isUploading ? 'Launching...' : (aiTier !== 'Manual' ? (isCacheValid ? 'Regenerate Strategy' : 'Review AI Strategy') : 'Post Video')}
        </button>
      </div>
      {aiTier !== 'Manual' && !isUploading && (
        <button type="button" onClick={handleSkipReview} style={skipReviewButtonStyle}>
          <RocketLaunchIcon sx={{ fontSize: 16 }} /> Skip Review & Post Directly
        </button>
      )}
    </div>
  );
};
