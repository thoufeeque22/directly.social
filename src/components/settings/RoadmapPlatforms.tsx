"use client";

import React from 'react';
import { Box, Typography, Chip } from '@mui/material';
import { GlassCard } from '@/components/ui/GlassCard';
import { PlatformIcon } from '@/components/ui/PlatformIcon';
import { Platform } from '@/lib/core/constants';

interface RoadmapPlatformsProps {
  platforms: Platform[];
}

export const RoadmapPlatforms: React.FC<RoadmapPlatformsProps> = ({ platforms }) => {
  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>Roadmap / Coming Soon</Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
        {platforms.map((platform) => (
          <GlassCard key={platform.id} style={{ opacity: 0.6, filter: 'grayscale(1)', cursor: 'not-allowed' }}>
            <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <PlatformIcon platformId={platform.icon} />
                <Typography variant="h6">{platform.name}</Typography>
              </Box>
              <Chip label="Coming Soon" size="small" />
            </Box>
          </GlassCard>
        ))}
        
        <GlassCard style={{ border: '2px dashed var(--mui-palette-divider)' }}>
          <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%' }}>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Something else?</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>Suggest a platform you&apos;d like to see next.</Typography>
            </Box>
            <button 
              onClick={() => alert("Thanks! We've logged your request for a new integration.")}
              style={{ 
                padding: '8px 16px', 
                borderRadius: '8px', 
                border: 'none', 
                background: 'hsl(var(--primary))', 
                color: 'white',
                cursor: 'pointer'
              }}
            >
              Suggest Platform
            </button>
          </Box>
        </GlassCard>
      </Box>
    </Box>
  );
};
