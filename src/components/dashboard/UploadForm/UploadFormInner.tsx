import React from 'react';
import { AITierSelector } from './AITierSelector';
import { PlatformSelection } from './PlatformSelection';
import { SchedulingSelector } from './SchedulingSelector';
import { MediaPicker } from './MediaPicker';
import { AIStyleSelector } from './AIStyleSelector';
import { useUploadFormContext } from './UploadFormContext';
import { UploadHeader } from './UploadHeader';
import { VideoSelection } from './VideoSelection';
import { PlatformSpecificToggle } from './PlatformSpecificToggle';
import { StandardMetadataFields } from './StandardMetadataFields';
import { PlatformMetadataFields } from './PlatformMetadataFields';
import { AIStrategyNotice } from './AIStrategyNotice';
import { UploadFormActions } from './UploadFormActions';
import { GlassCard } from '@/components/ui/GlassCard';

export const UploadFormInner: React.FC = () => {
  const {
    aiTier, onTierChange, onSubmit, showGallery, setShowGallery, onGallerySelect,
    contentMode, onModeChange, customStyleText, onCustomStyleChange,
    accounts, preferences, selectedAccountIds, onToggleAccount,
    isScheduled, scheduledAt, onSchedulingChange
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
        <PlatformSpecificToggle />
        <StandardMetadataFields />
        <PlatformMetadataFields />
        {aiTier !== 'Manual' && <AIStyleSelector contentMode={contentMode} onModeChange={onModeChange} customStyleText={customStyleText} onCustomStyleChange={onCustomStyleChange} />}
        <AIStrategyNotice />
        <PlatformSelection accounts={accounts} preferences={preferences} selectedAccountIds={selectedAccountIds} onToggleAccount={onToggleAccount} />
        <SchedulingSelector isScheduled={isScheduled} scheduledAt={scheduledAt} onChange={onSchedulingChange} />
        <UploadFormActions />
      </form>
    </GlassCard>
  );
};
