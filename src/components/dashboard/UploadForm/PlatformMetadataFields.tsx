/* eslint-disable max-lines */
'use client';

import React from 'react';
import { useUploadFormContext } from './UploadFormContext';
import { MetadataTemplates } from './MetadataTemplates';
import YouTubeIcon from '@mui/icons-material/YouTube';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import LanguageIcon from '@mui/icons-material/Language';
import { PLATFORM_LIMITS } from '@/lib/core/constants';

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
    isPlatformSpecific, selectedPlatforms, isUploading, 
    platformTitles, handlePlatformTitleChange, 
    platformDescriptions, handlePlatformDescriptionChange, appendDescription 
  } = useUploadFormContext();
  
  if (!isPlatformSpecific) return null;

  return (
    <div style={containerStyle}>
      {selectedPlatforms.map(platform => {
        const limits = PLATFORM_LIMITS[platform] || { description: 2000 };
        const titleVal = platformTitles[platform] || '';
        const descVal = platformDescriptions[platform] || '';
        
        const isTitleOver = limits.title ? titleVal.length > limits.title : false;
        const isDescOver = descVal.length > limits.description;

        return (
          <div key={platform} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {getPlatformIcon(platform)}
                <span style={labelStyle}>{platform} Details</span>
              </div>
              {!isUploading && <MetadataTemplates onSelect={(val) => appendDescription(val, platform)} currentContent={descVal} />}
            </div>
            
            {limits.title && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <span style={{ fontSize: '0.65rem', fontWeight: 600, color: isTitleOver ? 'hsl(var(--destructive))' : 'hsl(var(--muted-foreground))' }}>
                    {titleVal.length}/{limits.title}
                  </span>
                </div>
                <input 
                  type="text" 
                  placeholder={`${platform} title (optional)...`} 
                  value={titleVal} 
                  onChange={(e) => handlePlatformTitleChange(platform, e.target.value)} 
                  style={{ 
                    ...inputStyle, 
                    borderColor: isTitleOver ? 'hsl(var(--destructive))' : 'hsla(var(--border) / 0.5)' 
                  }} 
                />
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <span style={{ fontSize: '0.65rem', fontWeight: 600, color: isDescOver ? 'hsl(var(--destructive))' : 'hsl(var(--muted-foreground))' }}>
                  {descVal.length}/{limits.description}
                </span>
              </div>
              <textarea 
                placeholder={`${platform} description (optional)...`} 
                value={descVal} 
                onChange={(e) => handlePlatformDescriptionChange(platform, e.target.value)} 
                rows={2} 
                style={{ 
                  ...inputStyle, 
                  borderColor: isDescOver ? 'hsl(var(--destructive))' : 'hsla(var(--border) / 0.5)' 
                }} 
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

const containerStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '1.25rem', background: 'hsla(var(--muted)/0.1)', borderRadius: '1rem', border: '1px solid hsla(var(--border)/0.3)' };
const labelStyle: React.CSSProperties = { fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', color: 'hsl(var(--primary))' };
const inputStyle: React.CSSProperties = { background: 'hsla(var(--muted) / 0.3)', padding: '0.75rem 1rem', borderRadius: '0.75rem', border: '1px solid hsla(var(--border) / 0.5)', color: 'white', width: '100%', outline: 'none', transition: 'border-color 0.2s', fontSize: '0.9rem' };
