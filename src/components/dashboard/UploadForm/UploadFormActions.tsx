/* eslint-disable react-hooks/set-state-in-effect */
'use client';
import React from 'react';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import RefreshIcon from '@mui/icons-material/Refresh';
import UploadIcon from '@mui/icons-material/Upload';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { useUploadFormContext } from './UploadFormContext';
import { primaryButtonStyle, secondaryButtonStyle, skipReviewButtonStyle } from './UploadFormActions.styles';
import { checkCacheValidity } from './UploadFormContext.utils';

export const UploadFormActions: React.FC = () => {
  const { 
    isUploading, aiTier, contentMode, hasCachedPreviews, onResumeReview, onTierChange,
    title, description, selectedPlatforms, draftFileName, genAITermsAccepted
  } = useUploadFormContext();

  const [isCacheValid, setIsCacheValid] = React.useState(false);
  const [localConsent, setLocalConsent] = React.useState(false);
  const needsConsent = !genAITermsAccepted && aiTier !== 'Manual';

  React.useEffect(() => {
    if (!hasCachedPreviews) {
      setIsCacheValid(false);
      return;
    }
    try {
      const savedContext = localStorage.getItem('SS_AI_PREVIEWS_CONTEXT');
      if (!savedContext) {
        setIsCacheValid(false);
        return;
      }
      setIsCacheValid(
        checkCacheValidity(
          { title, description, platforms: selectedPlatforms, aiTier, contentMode },
          JSON.parse(savedContext)
        )
      );
    } catch {
      setIsCacheValid(false);
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
      {draftFileName === 'demo-video.mp4' && (
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start', padding: '0.75rem', background: 'hsla(var(--primary) / 0.1)', color: 'hsl(var(--primary))', borderRadius: '0.5rem', fontSize: '0.85rem', lineHeight: 1.4 }}>
          <InfoOutlinedIcon sx={{ fontSize: 18, mt: '2px' }} />
          <span><strong>Heads up:</strong> If you proceed to publish, this demo video will actually be posted to your connected social media platforms!</span>
        </div>
      )}
      {needsConsent && (
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', padding: '1rem', background: 'hsla(var(--foreground) / 0.05)', borderRadius: '0.5rem', marginTop: '0.5rem' }}>
          <input 
            type="checkbox" 
            id="ai-consent" 
            name="aiConsent"
            value="true"
            checked={localConsent} 
            onChange={(e) => setLocalConsent(e.target.checked)} 
            style={{ width: '1.25rem', height: '1.25rem', accentColor: 'hsl(var(--primary))' }} 
          />
          <label htmlFor="ai-consent" style={{ fontSize: '0.9rem', color: 'hsl(var(--foreground) / 0.8)', cursor: 'pointer', userSelect: 'none' }}>
            I consent to having my video processed by third-party AI providers in accordance with the <a href="/privacy" target="_blank" rel="noopener noreferrer" style={{ color: 'hsl(var(--primary))', textDecoration: 'underline' }}>Privacy Policy</a>.
          </label>
        </div>
      )}
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
        <button type="submit" disabled={isUploading || (needsConsent && !localConsent)} style={{ 
          ...primaryButtonStyle, flex: (isCacheValid || (aiTier === 'Manual' && !isUploading)) ? 1.2 : 1,
          cursor: isUploading || (needsConsent && !localConsent) ? 'not-allowed' : 'pointer',
          opacity: isUploading || (needsConsent && !localConsent) ? 0.6 : 1,
        }}>
          {isUploading ? <UploadIcon className="animate-pulse" /> : (aiTier !== 'Manual' ? (isCacheValid ? <RefreshIcon /> : <AutoAwesomeIcon />) : <RocketLaunchIcon />)}
          {isUploading ? 'Launching...' : (aiTier !== 'Manual' ? (isCacheValid ? 'Regenerate Strategy' : 'Review AI Strategy') : 'Post Video')}
        </button>
      </div>
      {aiTier !== 'Manual' && !isUploading && (
        <button type="button" onClick={handleSkipReview} disabled={needsConsent && !localConsent} style={{
          ...skipReviewButtonStyle,
          cursor: (needsConsent && !localConsent) ? 'not-allowed' : 'pointer',
          opacity: (needsConsent && !localConsent) ? 0.6 : 1,
        }}>
          <RocketLaunchIcon sx={{ fontSize: 16 }} /> Skip Review & Post Directly
        </button>
      )}
    </div>
  );
};
