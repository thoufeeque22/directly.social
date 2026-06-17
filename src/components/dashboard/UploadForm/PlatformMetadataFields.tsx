import React from 'react';
import { useUploadFormContext } from './UploadFormContext';
import { containerStyle } from './PlatformMetadataFields.styles';
import { PlatformMetadataItem } from './PlatformMetadataItem';

interface PlatformMetadataFieldsProps {
  activePlatform?: string;
}

export const PlatformMetadataFields: React.FC<PlatformMetadataFieldsProps> = ({ activePlatform }) => {
  const { 
    selectedPlatforms, isUploading, platformTitles, 
    handlePlatformTitleChange, platformDescriptions, handlePlatformDescriptionChange, 
    platformHashtags, handlePlatformHashtagChange,
    platformFirstComments, handlePlatformFirstCommentChange,
    platformSchedules, handlePlatformScheduleChange,
    appendDescription, aiTier, onTierChange,
    titleUndo, handleUndoTitle, handleClearPlatformTitle,
    descUndo, handleUndoDesc, handleClearPlatformDesc,
    overriddenPlatforms, togglePlatformOverride, resetToGlobal
  } = useUploadFormContext();

  const platformsToRender = activePlatform 
    ? [activePlatform] 
    : selectedPlatforms.filter(p => overriddenPlatforms.includes(p));

  if (platformsToRender.length === 0) return null;

  return (
    <div style={containerStyle}>
      {platformsToRender.map(platform => {
        const isOverridden = overriddenPlatforms.includes(platform);
        
        if (!isOverridden && activePlatform) {
           return (
             <div key={platform} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '2rem', textAlign: 'center' }}>
               <p style={{ color: 'hsl(var(--muted-foreground))' }}>This platform is currently using global settings.</p>
               <button 
                 type="button"
                 onClick={() => togglePlatformOverride(platform, true)}
                 style={{ 
                   padding: '0.5rem 1rem', 
                   borderRadius: '0.5rem', 
                   background: 'hsl(var(--primary))', 
                   color: 'hsl(var(--primary-foreground))',
                   border: 'none',
                   cursor: 'pointer'
                 }}
               >
                 Customize for {platform}
               </button>
             </div>
           );
        }

        return (
          <PlatformMetadataItem
            key={platform}
            platform={platform}
            isUploading={isUploading}
            aiTier={aiTier}
            titleVal={platformTitles[platform] || ''}
            descVal={platformDescriptions[platform] || ''}
            hashtagVal={platformHashtags[platform] || ''}
            commentVal={platformFirstComments[platform] || ''}
            scheduleVal={platformSchedules[platform] || ''}
            showTitleUndo={titleUndo?.platform === platform}
            showDescUndo={descUndo?.platform === platform}
            handlePlatformTitleChange={handlePlatformTitleChange}
            handlePlatformDescriptionChange={handlePlatformDescriptionChange}
            handlePlatformHashtagChange={handlePlatformHashtagChange}
            handlePlatformFirstCommentChange={handlePlatformFirstCommentChange}
            handlePlatformScheduleChange={handlePlatformScheduleChange}
            handleClearPlatformTitle={handleClearPlatformTitle}
            handleClearPlatformDesc={handleClearPlatformDesc}
            handleUndoTitle={handleUndoTitle}
            handleUndoDesc={handleUndoDesc}
            onTierChange={onTierChange}
            appendDescription={appendDescription}
            onReset={resetToGlobal}
          />
        );
      })}
    </div>
  );
};