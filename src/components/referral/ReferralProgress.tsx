'use client';
import React from 'react';
import { Box, Typography, Stack, Paper, Button } from '@mui/material';
import { ClaimPrizeModal } from './ClaimPrizeModal';

interface Props {
  quotaRemaining: number;
  aiCredits: number;
  isFree: boolean;
  isLifetime: boolean;
  activeCount: number;
  progressPercent: number;
  isGrandPrize: boolean;
  grandPrizeReward: string;
  progressDesc: string;
  hasClaimed?: boolean;
}

export const ReferralProgress: React.FC<Props> = ({ 
  quotaRemaining, aiCredits, isFree, isLifetime, activeCount, progressPercent, isGrandPrize, grandPrizeReward, progressDesc, hasClaimed 
}) => {
  const [modalOpen, setModalOpen] = React.useState(false);
  return (
    <>
      <Stack direction="row" spacing={2}>
        <Paper variant="outlined" sx={{ flex: 1, p: 2, borderRadius: 2, textAlign: 'center', bgcolor: 'rgba(255,142,83,0.05)' }}>
          <Typography variant="h3" color="#FF6B6B" data-testid="extra-posts-quota" sx={{ fontWeight: 800 }}>
            +{isFree ? quotaRemaining : aiCredits}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
            {isFree ? 'Extra Free Posts' : 'AI Credits Earned'}
          </Typography>
        </Paper>

        <Paper variant="outlined" sx={{ flex: 1, p: 2, borderRadius: 2, textAlign: 'center', bgcolor: isGrandPrize ? 'rgba(76,175,80,0.1)' : 'background.default' }}>
          <Typography variant="h6" color={isGrandPrize ? 'success.main' : 'text.primary'} data-testid="grand-prize-status" sx={{ mt: 1, fontWeight: 700 }}>
            {isGrandPrize ? 'UNLOCKED' : 'LOCKED'}
          </Typography>
          <Typography variant="body2" color="text.secondary" data-testid="grand-prize-reward" sx={{ fontWeight: 500 }}>
            {grandPrizeReward}
          </Typography>
        </Paper>
      </Stack>

      <Box>
        {!hasClaimed && !isLifetime && (
          <>
            <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'flex-end', mb: 1 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                The Grand Prize Progress
              </Typography>
              <Typography variant="body2" color="primary.main" sx={{ fontWeight: 700 }}>
                {activeCount} / 5 Paid Squad
              </Typography>
            </Stack>
            {isGrandPrize ? (
              <Button 
                variant="contained" 
                fullWidth 
                size="large"
                onClick={() => setModalOpen(true)}
                sx={{ 
                  py: 2, 
                  fontWeight: 800, 
                  background: 'linear-gradient(90deg, #FF6B6B 0%, #FF8E53 100%)',
                  animation: 'pulse 2s infinite',
                  '@keyframes pulse': {
                    '0%': { boxShadow: '0 0 0 0 rgba(255, 107, 107, 0.4)' },
                    '70%': { boxShadow: '0 0 0 10px rgba(255, 107, 107, 0)' },
                    '100%': { boxShadow: '0 0 0 0 rgba(255, 107, 107, 0)' }
                  }
                }}
              >
                Claim Grand Prize
              </Button>
            ) : (
              <Box sx={{ width: '100%', height: 8, bgcolor: 'divider', borderRadius: 4, overflow: 'hidden' }}>
                <Box sx={{ 
                  width: `${progressPercent}%`, height: '100%', 
                  background: 'linear-gradient(90deg, #FF6B6B 0%, #FF8E53 100%)',
                  transition: 'width 1s ease-in-out'
                }} />
              </Box>
            )}
          </>
        )}
        <Typography variant="caption" color="text.secondary" data-testid="progress-desc" sx={{ display: 'block', mt: 1 }}>
          {progressDesc}
        </Typography>
      </Box>

      <ClaimPrizeModal 
        open={modalOpen} 
        onClose={() => setModalOpen(false)} 
        onSuccess={() => window.location.reload()} 
      />
    </>
  );
};
