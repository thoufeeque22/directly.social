import React from 'react';
import { PlatformTitleField } from './PlatformMetadataItem.Title';
import { PlatformDescriptionField } from './PlatformMetadataItem.Description';
import { PlatformHashtagsField } from './PlatformMetadataItem.Hashtags';
import { PlatformFirstCommentField } from './PlatformMetadataItem.FirstComment';
import { PlatformScheduleField } from './PlatformMetadataItem.Schedule';
import { PlatformHeader } from './PlatformMetadataItem.Header';
import { AITier } from '@/lib/core/constants';

interface PlatformMetadataItemProps {
  platform: string; isUploading: boolean; aiTier: string; titleVal: string; descVal: string;
  hashtagVal: string; commentVal: string; scheduleVal: string;
  showTitleUndo: boolean; showDescUndo: boolean;
  handlePlatformTitleChange: (p: string, v: string) => void;
  handlePlatformDescriptionChange: (p: string, v: string) => void;
  handlePlatformHashtagChange: (p: string, v: string) => void;
  handlePlatformFirstCommentChange: (p: string, v: string) => void;
  handlePlatformScheduleChange: (p: string, v: string) => void;
  handleClearPlatformTitle: (p: string) => void;
  handleClearPlatformDesc: (p: string) => void;
  handleUndoTitle: () => void; handleUndoDesc: () => void;
  onTierChange: (t: AITier) => void; appendDescription: (v: string, p: string) => void; onReset: (p: string) => void;
}

export const PlatformMetadataItem: React.FC<PlatformMetadataItemProps> = (props) => {
  const { platform } = props;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <input type="hidden" name={`overridden_${platform}`} value="true" />
      <PlatformHeader platform={platform} onReset={props.onReset} />
      <PlatformTitleField 
        platform={platform} aiTier={props.aiTier} value={props.titleVal} showUndo={props.showTitleUndo}
        onChange={props.handlePlatformTitleChange} onClear={props.handleClearPlatformTitle} onUndo={props.handleUndoTitle} onTierChange={props.onTierChange}
      />
      <PlatformDescriptionField 
        platform={platform} isUploading={props.isUploading} aiTier={props.aiTier} value={props.descVal} showUndo={props.showDescUndo}
        onChange={props.handlePlatformDescriptionChange} onClear={props.handleClearPlatformDesc} onUndo={props.handleUndoDesc} onTierChange={props.onTierChange} appendDescription={props.appendDescription}
      />
      <PlatformHashtagsField platform={platform} value={props.hashtagVal} onChange={props.handlePlatformHashtagChange} />
      <PlatformFirstCommentField platform={platform} value={props.commentVal} onChange={props.handlePlatformFirstCommentChange} />
      <PlatformScheduleField platform={platform} value={props.scheduleVal} onChange={props.handlePlatformScheduleChange} />
    </div>
  );
};
