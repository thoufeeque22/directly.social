'use client';

import { Box, Paper, Stack, Typography, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import YouTubeIcon from '@mui/icons-material/YouTube';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import InstagramIcon from '@mui/icons-material/Instagram';
import { StatItem } from './StatItem';
import { VibeSyncMockup } from './VibeSyncMockup';
import { BRAND } from '@/lib/core/brand';

export const DashboardMockup = () => {
  const theme = useTheme();
  
  return (
    <Box 
      component={motion.div}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      sx={{ width: '100%', maxWidth: 850, mt: 6, mx: 'auto' }}
    >
      <Paper
        elevation={24}
        sx={{
          borderRadius: 3,
          overflow: 'hidden',
          border: `1px solid ${theme.palette.divider}`,
          bgcolor: 'background.paper',
          boxShadow: `0 30px 60px -12px ${theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0.15)'}`
        }}
      >
        <Box sx={{ bgcolor: 'action.hover', px: 2, py: 1, borderBottom: `1px solid ${theme.palette.divider}` }}>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#ff5f56' }} />
            <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#ffbd2e' }} />
            <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#27c93f' }} />
            <Typography variant="caption" sx={{ ml: 2, color: 'text.secondary', fontWeight: 500, fontSize: '0.7rem' }}>Activity Hub — {BRAND.name}</Typography>
          </Stack>
        </Box>
        
        <Box sx={{ display: 'flex', height: 380 }}>
          <Box sx={{ width: { xs: 50, md: 180 }, bgcolor: 'action.hover', borderRight: `1px solid ${theme.palette.divider}`, p: 2 }}>
            <Stack spacing={2}>
              {[1, 2, 3, 4, 5].map((i) => (
                <Box key={i} sx={{ height: 10, bgcolor: 'divider', borderRadius: 1, width: i % 2 === 0 ? '70%' : '50%' }} />
              ))}
            </Stack>
          </Box>
          
          <Box sx={{ flexGrow: 1, p: { xs: 2, md: 3 }, bgcolor: 'background.default' }}>
            <Stack direction="row" spacing={3} sx={{ height: '100%' }}>
              <Paper elevation={0} sx={{ flex: 1, p: 2, border: `1px solid ${theme.palette.divider}`, borderRadius: 2, bgcolor: 'background.paper' }}>
                <Typography variant="caption" color="primary" sx={{ fontWeight: 800, textTransform: 'uppercase', mb: 2, display: 'block', letterSpacing: 1 }}>Publishing Status</Typography>
                <Stack direction="row" spacing={2} sx={{ mb: 3, alignItems: 'center' }}>
                  <Box sx={{ width: 40, height: 40, borderRadius: 1, bgcolor: 'divider', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Box sx={{ width: 24, height: 24, bgcolor: 'primary.main', borderRadius: '50%' }} />
                  </Box>
                  <Box sx={{ flexGrow: 1 }}>
                    <Box sx={{ height: 10, bgcolor: 'divider', borderRadius: 1, width: '60%', mb: 1 }} />
                    <Box sx={{ height: 8, bgcolor: 'divider', borderRadius: 1, width: '30%' }} />
                  </Box>
                  <Box 
                    component={motion.div}
                    animate={{ opacity: [1, 0.4, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    sx={{ px: 1, py: 0.2, borderRadius: 0.5, bgcolor: 'error.main', color: 'error.contrastText', fontSize: 8, fontWeight: 800 }}
                  >
                    LIVE
                  </Box>
                </Stack>
                
                <StatItem icon={<YouTubeIcon sx={{ color: '#FF0000', fontSize: 18 }} />} label="Shorts" color="#FF0000" progress="100%" delay={0.2} />
                <StatItem icon={<MusicNoteIcon sx={{ color: '#00F2EA', fontSize: 18 }} />} label="TikTok" color="#00F2EA" progress="100%" delay={0.5} />
                <StatItem icon={<InstagramIcon sx={{ color: '#E1306C', fontSize: 18 }} />} label="Reels" color="#E1306C" progress="100%" delay={0.8} />
              </Paper>
              <VibeSyncMockup />
            </Stack>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};
