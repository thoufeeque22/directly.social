'use client';

import React from 'react';
import { useUploadFormContext } from './UploadFormContext';
import { MetadataTemplates } from './MetadataTemplates';
import YouTubeIcon from '@mui/icons-material/YouTube';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import LanguageIcon from '@mui/icons-material/Language';

export const PlatformMetadataFields: React.FC = () => {
  const {
    isPlatformSpecific, selectedPlatforms, isUploading,
    platformTitles, handlePlatformTitleChange,
    platformDescriptions, handlePlatformDescriptionChange,
    appendDescription
  } = useUploadFormContext();

  if (!isPlatformSpecific) return null;

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'youtube': return <YouTubeIcon sx={{ fontSize: 18, color: '#FF0000' }} />;
      case 'tiktok': return <MusicNoteIcon sx={{ fontSize: 18, color: 'white' }} />;
      case 'instagram': return <InstagramIcon sx={{ fontSize: 18, color: '#E4405F' }} />;
      case 'facebook': return <FacebookIcon sx={{ fontSize: 18, color: '#1877F2' }} />;
      default: return <LanguageIcon sx={{ fontSize: 18 }} />;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '1rem', background: 'hsla(var(--muted)/0.1)', borderRadius: '1rem', border: '1px solid hsla(var(--border)/0.3)' }}>
      {selectedPlatforms.map(platform => (
        <div key={platform} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ display: 'flex', alignItems: 'center' }}>
                {getPlatformIcon(platform)}
              </span>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'hsl(var(--primary))' }}>
                {platform} Details
              </span>
            </div>
            {!isUploading && (
              <MetadataTemplates 
                onSelect={(val) => appendDescription(val, platform)} 
                currentContent={platformDescriptions[platform] || ''} 
              />
            )}
          </div>
          
          <input 
            type="text"
            name={`title_${platform}`}
            placeholder={`${platform.charAt(0).toUpperCase() + platform.slice(1)} title...`}
            value={platformTitles[platform] || ''}
            onChange={(e) => handlePlatformTitleChange(platform, e.target.value)}
            required
            style={{ background: 'hsla(var(--muted) / 0.3)', padding: '0.75rem 1rem', borderRadius: '0.75rem', border: '1px solid hsla(var(--border) / 0.5)', color: 'white', width: '100%' }}
          />
          
          <textarea 
            name={`description_${platform}`}
            placeholder={`${platform.charAt(0).toUpperCase() + platform.slice(1)} description...`}
            value={platformDescriptions[platform] || ''}
            onChange={(e) => handlePlatformDescriptionChange(platform, e.target.value)}
            rows={2}
            style={{ background: 'hsla(var(--muted) / 0.3)', padding: '0.75rem 1rem', borderRadius: '0.75rem', border: '1px solid hsla(var(--border) / 0.5)', color: 'white', width: '100%', resize: 'none' }}
          />
        </div>
      ))}
    </div>
  );
};
