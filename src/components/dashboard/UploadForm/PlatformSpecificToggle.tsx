'use client';

import React from 'react';
import { useUploadFormContext } from './UploadFormContext';

export const PlatformSpecificToggle: React.FC = () => {
  const { 
    aiTier, 
    selectedPlatforms, 
    isPlatformSpecific, 
    togglePlatformSpecific 
  } = useUploadFormContext();

  if (aiTier !== 'Manual' || selectedPlatforms.length <= 1) return null;

  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: '0.75rem', 
      padding: '0.75rem', 
      background: 'hsla(var(--muted)/0.2)', 
      borderRadius: '0.75rem', 
      border: '1px solid hsla(var(--border)/0.3)' 
    }}>
      <input 
        type="checkbox" 
        id="platform-specific-toggle"
        checked={isPlatformSpecific}
        onChange={(e) => togglePlatformSpecific(e.target.checked)}
        style={{ width: '1.25rem', height: '1.25rem', cursor: 'pointer', accentColor: 'hsl(var(--primary))' }}
      />
      <label htmlFor="platform-specific-toggle" style={{ 
        fontSize: '0.85rem', 
        fontWeight: 600, 
        cursor: 'pointer', 
        color: isPlatformSpecific ? 'hsl(var(--primary))' : 'hsl(var(--foreground))' 
      }}>
        Separate titles/descriptions per platform
      </label>
      <input type="hidden" name="isPlatformSpecific" value={String(isPlatformSpecific)} />
    </div>
  );
};
