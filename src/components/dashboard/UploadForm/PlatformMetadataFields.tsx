import React from 'react';
import { useUploadFormContext } from './UploadFormContext';
import { MetadataTemplates } from './MetadataTemplates';
import { AINudge } from '@/components/ui/AINudge';
import YouTubeIcon from '@mui/icons-material/YouTube';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import LanguageIcon from '@mui/icons-material/Language';
import UndoIcon from '@mui/icons-material/Undo';
import { PLATFORM_LIMITS } from '@/lib/core/constants';
import { containerStyle, labelStyle, inputStyle } from './PlatformMetadataFields.styles';
import { clearButtonStyle as globalClearStyle, undoButtonStyle } from './StandardMetadataFields.Title.styles';

const getPlatformIcon = (p: string) => {
  switch (p) {
    case 'youtube': return <YouTubeIcon sx={{ fontSize: 18, color: '#FF0000' }} />;
    case 'tiktok': return <MusicNoteIcon sx={{ fontSize: 18, color: 'white' }} />;
    case 'instagram': return <InstagramIcon sx={{ fontSize: 18, color: '#E4405F' }} />;
    case 'facebook': return <FacebookIcon sx={{ fontSize: 18, color: '#1877F2' }} />;
    default: return <LanguageIcon sx={{ fontSize: 18 }} />;
  }
};

export const PlatformMetadataFields: React.FC = () => {
  const { 
    isPlatformSpecific, selectedPlatforms, isUploading, platformTitles, 
    handlePlatformTitleChange, platformDescriptions, handlePlatformDescriptionChange, 
    appendDescription, aiTier, onTierChange,
    titleUndo, handleUndoTitle, handleClearPlatformTitle,
    descUndo, handleUndoDesc, handleClearPlatformDesc
  } = useUploadFormContext();

  if (!isPlatformSpecific) return null;

  return (
    <div style={containerStyle}>
      {selectedPlatforms.map(platform => {
        const limits = PLATFORM_LIMITS[platform] || PLATFORM_LIMITS.default;
        const titleVal = platformTitles[platform] || '', descVal = platformDescriptions[platform] || '';
        const isTitleOver = limits.title ? titleVal.length > limits.title : false, isDescOver = descVal.length > limits.description;
        
        const showTitleUndo = titleUndo?.platform === platform;
        const showDescUndo = descUndo?.platform === platform;

        return (
          <div key={platform} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid hsla(var(--border)/0.3)', paddingBottom: '0.5rem', marginBottom: '0.25rem' }}>
              {getPlatformIcon(platform)}
              <span style={labelStyle}>{platform} Details</span>
            </div>

            {/* Platform Title */}
            {limits.title && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'hsl(var(--muted-foreground))' }}>
                      {platform} Title
                    </label>
                    {aiTier === 'Manual' && (
                      <AINudge featureKey="title_generator" message="Try AI" tooltipText="Switch to Generate tier" onClick={() => onTierChange('Generate')} />
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ fontSize: '0.65rem', fontWeight: 600, color: isTitleOver ? 'hsl(var(--destructive))' : 'hsl(var(--muted-foreground))' }}>
                      {titleVal.length}/{limits.title}
                    </span>
                    {showTitleUndo && (
                      <button type="button" onClick={handleUndoTitle} style={undoButtonStyle}>
                        <UndoIcon sx={{ fontSize: 12 }} /> <span style={{ fontSize: '0.65rem' }}>Undo Clear</span>
                      </button>
                    )}
                  </div>
                </div>
                <div style={{ position: 'relative' }}>
                  <input 
                    type="text" 
                    placeholder={`Catchy ${platform} title...`} 
                    value={titleVal} 
                    onChange={(e) => handlePlatformTitleChange(platform, e.target.value)} 
                    style={{ ...inputStyle, paddingRight: '2.5rem', borderColor: isTitleOver ? 'hsl(var(--destructive))' : 'hsla(var(--border) / 0.5)' }} 
                  />
                  {titleVal && (
                    <button type="button" onClick={() => handleClearPlatformTitle(platform)} style={{ ...globalClearStyle, top: '50%' }}>
                      ✕
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Platform Description */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'hsl(var(--muted-foreground))' }}>
                    {platform} Description
                  </label>
                  {aiTier === 'Manual' && (
                    <AINudge featureKey="desc_generator" message="Try AI" tooltipText="Switch to Enrich tier" onClick={() => onTierChange('Enrich')} />
                  )}
                  {!isUploading && <MetadataTemplates onSelect={(val) => appendDescription(val, platform)} platform={platform} />}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ fontSize: '0.65rem', fontWeight: 600, color: isDescOver ? 'hsl(var(--destructive))' : 'hsl(var(--muted-foreground))' }}>
                    {descVal.length}/{limits.description}
                  </span>
                  {showDescUndo && (
                    <button type="button" onClick={handleUndoDesc} style={undoButtonStyle}>
                      <UndoIcon sx={{ fontSize: 12 }} /> <span style={{ fontSize: '0.65rem' }}>Undo Clear</span>
                    </button>
                  )}
                </div>
              </div>
              <div style={{ position: 'relative' }}>
                <textarea 
                  placeholder={`Specific ${platform} description...`} 
                  value={descVal} 
                  onChange={(e) => handlePlatformDescriptionChange(platform, e.target.value)} 
                  rows={3} 
                  style={{ ...inputStyle, resize: 'none', paddingRight: '2.5rem', borderColor: isDescOver ? 'hsl(var(--destructive))' : 'hsla(var(--border) / 0.5)' }} 
                />
                {descVal && (
                  <button type="button" onClick={() => handleClearPlatformDesc(platform)} style={{ ...globalClearStyle, top: '0.75rem', transform: 'none' }}>
                    ✕
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
