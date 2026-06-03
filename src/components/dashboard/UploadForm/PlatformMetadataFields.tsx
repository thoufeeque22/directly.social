import React from 'react';
import { useUploadFormContext } from './UploadFormContext';
import { containerStyle } from './PlatformMetadataFields.styles';
import { PlatformMetadataItem } from './PlatformMetadataItem';

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
      {selectedPlatforms.map(platform => (
        <PlatformMetadataItem
          key={platform}
          platform={platform}
          isUploading={isUploading}
          aiTier={aiTier}
          titleVal={platformTitles[platform] || ''}
          descVal={platformDescriptions[platform] || ''}
          showTitleUndo={titleUndo?.platform === platform}
          showDescUndo={descUndo?.platform === platform}
          handlePlatformTitleChange={handlePlatformTitleChange}
          handlePlatformDescriptionChange={handlePlatformDescriptionChange}
          handleClearPlatformTitle={handleClearPlatformTitle}
          handleClearPlatformDesc={handleClearPlatformDesc}
          handleUndoTitle={handleUndoTitle}
          handleUndoDesc={handleUndoDesc}
          onTierChange={onTierChange}
          appendDescription={appendDescription}
        />
      ))}
    </div>
  );
};