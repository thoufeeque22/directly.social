'use client';
import React from 'react';
import { 
  Typography, Stack, Dialog, DialogContent, 
  Box, IconButton, Divider 
} from '@mui/material';
import { BRAND } from '@/lib/core/brand';
import CloseIcon from '@mui/icons-material/Close';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { ReferralCopier } from './ReferralCopier';
import { ReferralSquad } from './ReferralSquad';
import { ReferralProgress } from './ReferralProgress';

interface ReferralModalProps {
  open: boolean;
  onClose: () => void;
  referralUrl: string;
  activeCount: number;
  quotaRemaining: number;
  history: Array<{ email: string; status: string }>;
  subscriptionTier: string;
}

export const ReferralModal: React.FC<ReferralModalProps> = ({ 
  open, onClose, referralUrl, activeCount, quotaRemaining, history, subscriptionTier 
}) => {
  const progressPercent = Math.min((activeCount / 5) * 100, 100);
  const isGrandPrize = activeCount >= 5;

  const isFree = subscriptionTier.startsWith('FREE_');
  const isCloudPro = subscriptionTier === 'CLOUD_PRO';
  
  const grandPrizeTitle = isFree 
    ? '100% Free Cloud Pro or Lifetime BYOK' 
    : (isCloudPro ? '100% Free Cloud Pro' : 'Lifetime BYOK');
    
  const grandPrizeReward = isFree 
    ? 'Lifetime BYOK or Cloud Pro'
    : (isCloudPro ? 'Cloud Pro Access' : 'Lifetime BYOK');

  const progressDesc = isFree
    ? 'Get 5 total referrals for Lifetime BYOK, or maintain 5 active to keep Cloud Pro free forever.'
    : (isCloudPro
        ? 'Maintain 5 active paid referrals to keep your Cloud Pro subscription 100% free forever.'
        : 'Get 5 total paid referrals to unlock Lifetime BYOK forever.');

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: 3,
          backgroundImage: 'none',
          bgcolor: 'background.paper',
          overflow: 'hidden'
        }
      }}
    >
      <Box sx={{ 
        background: 'linear-gradient(135deg, rgba(255,107,107,0.1) 0%, rgba(255,142,83,0.1) 100%)',
        pt: 4, pb: 3, px: 4, position: 'relative'
      }}>
        <IconButton 
          onClick={onClose} 
          sx={{ position: 'absolute', right: 8, top: 8, color: 'text.secondary' }}
        >
          <CloseIcon />
        </IconButton>
        
        <Stack spacing={1} sx={{ alignItems: 'center', textAlign: 'center' }}>
          <AutoAwesomeIcon sx={{ fontSize: 48, color: '#FF8E53', mb: 1 }} />
          <Typography variant="h4" sx={{ 
            fontWeight: 800,
            background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Give a Month, Get a Month
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Invite friends to {BRAND.name}. 
            Earn extra posts and unlock <strong style={{ fontWeight: 700 }}>{grandPrizeTitle}</strong>.
          </Typography>
        </Stack>
      </Box>

      <DialogContent sx={{ p: 4 }}>
        <Stack spacing={4}>
          <ReferralCopier referralUrl={referralUrl} />

          {isFree && (
            <Box sx={{ p: 2, bgcolor: 'action.hover', borderRadius: 2, border: '1px solid', borderColor: 'primary.light' }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main', mb: 1 }}>
                🚀 Pro Tip: Upgrade to Creator Pro
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Upgrade before sharing your link to earn $10 in real statement credits per referral instead of post quota!
              </Typography>
              <Typography variant="body2">
                <a href="/pricing" style={{ color: 'inherit', fontWeight: 'bold' }}>Upgrade Now &rarr;</a>
              </Typography>
            </Box>
          )}

          <ReferralProgress 
            quotaRemaining={quotaRemaining}
            activeCount={activeCount}
            progressPercent={progressPercent}
            isGrandPrize={isGrandPrize}
            grandPrizeReward={grandPrizeReward}
            progressDesc={progressDesc}
          />

          <Divider />

          <ReferralSquad history={history} />
          
          <Typography variant="caption" color="text.secondary" align="center" sx={{ display: 'block', pt: 1 }}>
            By sharing your link, you agree to our <a href="/referral-terms" style={{ color: 'inherit' }}>Referral Program Terms</a>.
          </Typography>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};
