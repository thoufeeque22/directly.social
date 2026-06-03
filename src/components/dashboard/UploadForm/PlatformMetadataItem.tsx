import React from 'react';
import LanguageIcon from '@mui/icons-material/Language';
import YouTubeIcon from '@mui/icons-material/YouTube';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import { labelStyle } from './PlatformMetadataFields.styles';
import { PlatformTitleField } from './PlatformMetadataItem.Title';
import { PlatformDescriptionField } from './PlatformMetadataItem.Description';
import { AITier } from '@/lib/core/constants';

const getPlatformIcon = (p: string) => {
  switch (p) {
    case 'youtube': return <YouTubeIcon sx={{ fontSize: 18, color: '#FF0000' }} />;
    case 'tiktok': return <MusicNoteIcon sx={{ fontSize: 18, color: 'white' }} />;
    case 'instagram': return <InstagramIcon sx={{ fontSize: 18, color: '#E4405F' }} />;
    case 'facebook': return <FacebookIcon sx={{ fontSize: 18, color: '#1877F2' }} />;
    default: return <LanguageIcon sx={{ fontSize: 18 }} />;
  }
};

interface PlatformMetadataItemProps {
  platform: string;
  isUploading: boolean;
  aiTier: string;
  titleVal: string;
  descVal: string;
  showTitleUndo: boolean;
  showDescUndo: boolean;
  handlePlatformTitleChange: (p: string, v: string) => void;
  handlePlatformDescriptionChange: (p: string, v: string) => void;
  handleClearPlatformTitle: (p: string) => void;
  handleClearPlatformDesc: (p: string) => void;
  handleUndoTitle: () => void;
  handleUndoDesc: () => void;
  onTierChange: (t: AITier) => void;
  appendDescription: (v: string, p: string) => void;
}

export const PlatformMetadataItem: React.FC<PlatformMetadataItemProps> = (props) => {
  const { platform } = props;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid hsla(var(--border)/0.3)', paddingBottom: '0.5rem', marginBottom: '0.25rem' }}>
        {getPlatformIcon(platform)}
        <span style={labelStyle}>{platform} Details</span>
      </div>

      <PlatformTitleField 
        platform={platform}
        aiTier={props.aiTier}
        value={props.titleVal}
        showUndo={props.showTitleUndo}
        onChange={props.handlePlatformTitleChange}
        onClear={props.handleClearPlatformTitle}
        onUndo={props.handleUndoTitle}
        onTierChange={props.onTierChange}
      />

      <PlatformDescriptionField 
        platform={platform}
        isUploading={props.isUploading}
        aiTier={props.aiTier}
        value={props.descVal}
        showUndo={props.showDescUndo}
        onChange={props.handlePlatformDescriptionChange}
        onClear={props.handleClearPlatformDesc}
        onUndo={props.handleUndoDesc}
        onTierChange={props.onTierChange}
        appendDescription={props.appendDescription}
      />
    </div>
  );
};