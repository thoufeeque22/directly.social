/* eslint-disable max-lines */
import React from 'react';
import { Typography, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { BRAND } from '@/lib/core/brand';
import { ReferralTermsLegalDetails } from './ReferralTermsLegalDetails';

export const ReferralTermsContent = () => (
  <Stack spacing={4} sx={{ mt: 4 }}>
    <section>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>1. The Program</Typography>
      <Typography variant="body1" gutterBottom>
        The {BRAND.name} Referral Program allows users to earn rewards by inviting others to use the Service.
      </Typography>
    </section>
    
    <section>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>2. Qualified Actions</Typography>
      <Typography variant="body1" gutterBottom>
        Rewards are triggered by two distinct actions:
      </Typography>
      <ul>
        <li><Typography variant="body1"><strong>Qualified Sign-Up:</strong> The referred user creates a new account using the referral link AND links at least one authorized third-party social media account to their profile.</Typography></li>
        <li><Typography variant="body1"><strong>Qualified Purchase:</strong> The referred user successfully purchases a paid subscription plan.</Typography></li>
      </ul>
    </section>

    <section>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>3. Tiered Rewards</Typography>
      <Typography variant="body1" gutterBottom>
        The &quot;Give a Month, Get a Month&quot; program offers symmetric rewards for both the Referrer and the Referred User:
      </Typography>
      <TableContainer component={Paper} variant="outlined" sx={{ mt: 2 }}>
        <Table aria-label="referral rewards table">
          <TableHead>
            <TableRow sx={{ backgroundColor: 'action.hover' }}>
              <TableCell sx={{ fontWeight: 'bold' }}>Referrer Tier</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Qualified Sign-Up Reward (Both Users)</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Qualified Purchase Reward (Both Users)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Free</TableCell>
              <TableCell>+1 Extra Post Quota</TableCell>
              <TableCell>1 Free Month of Pro</TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Paid</TableCell>
              <TableCell>+50 AI Credits (Referrer), +1 Post Quota (Referred)</TableCell>
              <TableCell>1 Free Month of Pro</TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Lifetime</TableCell>
              <TableCell>+50 AI Credits (Referrer), +1 Post Quota (Referred)</TableCell>
              <TableCell>+1,000 AI Credits (Referrer), 1 Free Month (Referred)</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </section>

    <section>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>4. Grand Prizes</Typography>
      <Typography variant="body1" gutterBottom>
        In addition to the 1-for-1 tiered rewards, referrers who accumulate a total of 5 <strong>Qualified Purchases</strong> unlock incredible permanent bonuses:
      </Typography>
      <ul>
        <li><Typography variant="body1"><strong>Lifetime Unlock:</strong> Any referrer who reaches 5 total Qualified Purchases over the lifetime of their account will automatically be upgraded to a Lifetime Deal, granting permanent free access to the platform.</Typography></li>
      </ul>
    </section>

    <ReferralTermsLegalDetails />
  </Stack>
);
