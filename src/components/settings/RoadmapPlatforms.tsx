"use client";

import { Box, Typography, Chip, Button } from '@mui/material';
import { GlassCard } from '@/components/ui/GlassCard';
import { PlatformIcon } from '@/components/ui/PlatformIcon';
import { Platform } from '@/lib/core/constants';

export const RoadmapPlatforms = ({ platforms }: { platforms: Platform[] }) => (
  <Box>
    <Typography variant="h6" sx={{ mb: 2 }}>Roadmap / Coming Soon</Typography>
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
      {platforms.map((p) => (
        <GlassCard key={p.id} style={{ opacity: 0.6, filter: 'grayscale(1)', cursor: 'not-allowed' }}>
          <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <PlatformIcon platformId={p.icon} />
              <Typography variant="h6">{p.name}</Typography>
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
          <Button variant="contained" onClick={() => alert("Thanks! Request logged.")} sx={{ borderRadius: 2, textTransform: 'none' }}>
            Suggest Platform
          </Button>
        </Box>
      </GlassCard>
    </Box>
  </Box>
);
