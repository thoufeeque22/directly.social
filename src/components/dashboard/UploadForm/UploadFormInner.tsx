import React from 'react';
import { AITierSelector } from './AITierSelector';
import { AIProviderSelector } from './AIProviderSelector';
import { PlatformSelection } from './PlatformSelection';
import { SchedulingSelector } from './SchedulingSelector';
import { MediaPicker } from './MediaPicker';
import { AIStyleSelector } from './AIStyleSelector';
import { useUploadFormContext } from './UploadFormContext';
import { UploadHeader } from './UploadHeader';
import { VideoSelection } from './VideoSelection';
import { StandardMetadataFields } from './StandardMetadataFields';
import { PlatformMetadataFields } from './PlatformMetadataFields';
import { PostComposerTabs } from './PostComposerTabs';
import { AIStrategyNotice } from './AIStrategyNotice';
import { UploadFormActions } from './UploadFormActions';
import { GlassCard } from '@/components/ui/GlassCard';

export const UploadFormInner: React.FC = () => {
  const {
    aiTier, onTierChange, aiProvider, onProviderChange,
    onSubmit, showGallery, setShowGallery, onGallerySelect,
    contentMode, onModeChange, customStyleText, onCustomStyleChange,
    accounts, preferences, selectedAccountIds, onToggleAccount,
    isScheduled, scheduledAt, onSchedulingChange, selectedPlatforms,
    overriddenPlatforms, platformTitles, platformDescriptions, platformHashtags, platformFirstComments, platformSchedules
  } = useUploadFormContext();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(new FormData(e.currentTarget));
  };

  return (
    <GlassCard id="create-post-section" style={{ padding: '2rem' }}>
      <UploadHeader />
      <form aria-label="Upload Form" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <VideoSelection />
        {showGallery && <MediaPicker onClose={() => setShowGallery(false)} onSelect={(a) => { onGallerySelect(a.fileId, a.fileName); setShowGallery(false); }} />}
        <AITierSelector selectedTier={aiTier} onChange={onTierChange} />
        {aiTier !== 'Manual' && <AIProviderSelector selectedProvider={aiProvider} onChange={onProviderChange} />}

        <PostComposerTabs>
          {(activeIndex) => {
            if (activeIndex === 0) {
              return <StandardMetadataFields />;
            }
            const platform = selectedPlatforms[activeIndex - 1];
            return <PlatformMetadataFields activePlatform={platform} />;
          }}
        </PostComposerTabs>

        {selectedPlatforms.map(platform => {
          if (!overriddenPlatforms.includes(platform)) return null;
          return (
            <React.Fragment key={`hidden-${platform}`}>
              <input type="hidden" name={`overridden_${platform}`} value="true" />
              <input type="hidden" name={`title_${platform}`} value={platformTitles[platform] || ''} />
              <input type="hidden" name={`description_${platform}`} value={platformDescriptions[platform] || ''} />
              <input type="hidden" name={`hashtags_${platform}`} value={platformHashtags[platform] || ''} />
              <input type="hidden" name={`first_comment_${platform}`} value={platformFirstComments[platform] || ''} />
              <input type="hidden" name={`scheduled_at_${platform}`} value={platformSchedules[platform] || ''} />
            </React.Fragment>
          );
        })}

        {aiTier !== 'Manual' && <AIStyleSelector contentMode={contentMode} onModeChange={onModeChange} customStyleText={customStyleText} onCustomStyleChange={onCustomStyleChange} />}
        <AIStrategyNotice />
        <PlatformSelection accounts={accounts} preferences={preferences} selectedAccountIds={selectedAccountIds} onToggleAccount={onToggleAccount} />
        <SchedulingSelector isScheduled={isScheduled} scheduledAt={scheduledAt} onChange={onSchedulingChange} />
        <UploadFormActions />
      </form>
    </GlassCard>
  );
};
