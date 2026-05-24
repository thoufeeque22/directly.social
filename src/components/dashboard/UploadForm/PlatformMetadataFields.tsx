'use client';

import React from 'react';
import { useUploadFormContext } from './UploadFormContext';
import { MetadataTemplates } from './MetadataTemplates';
import YouTubeIcon from '@mui/icons-material/YouTube';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import LanguageIcon from '@mui/icons-material/Language';

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
  const { isPlatformSpecific, selectedPlatforms, isUploading, platformTitles, handlePlatformTitleChange, platformDescriptions, handlePlatformDescriptionChange, appendDescription } = useUploadFormContext();
  if (!isPlatformSpecific) return null;

  return (
    <div style={containerStyle}>
      {selectedPlatforms.map(platform => (
        <div key={platform} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {getPlatformIcon(platform)}
              <span style={labelStyle}>{platform} Details</span>
            </div>
            {!isUploading && <MetadataTemplates onSelect={(val) => appendDescription(val, platform)} currentContent={platformDescriptions[platform] || ''} />}
          </div>
          <input type="text" placeholder={`${platform} title...`} value={platformTitles[platform] || ''} onChange={(e) => handlePlatformTitleChange(platform, e.target.value)} required style={inputStyle} />
          <textarea placeholder={`${platform} description...`} value={platformDescriptions[platform] || ''} onChange={(e) => handlePlatformDescriptionChange(platform, e.target.value)} rows={2} style={inputStyle} />
        </div>
      ))}
    </div>
  );
};

const containerStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '1rem', background: 'hsla(var(--muted)/0.1)', borderRadius: '1rem', border: '1px solid hsla(var(--border)/0.3)' };
const labelStyle: React.CSSProperties = { fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', color: 'hsl(var(--primary))' };
const inputStyle: React.CSSProperties = { background: 'hsla(var(--muted) / 0.3)', padding: '0.75rem 1rem', borderRadius: '0.75rem', border: '1px solid hsla(var(--border) / 0.5)', color: 'white', width: '100%' };
