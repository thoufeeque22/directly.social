/* eslint-disable max-lines */
import React from 'react';
import { Typography, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { BRAND } from '@/lib/core/brand';

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
        Rewards are issued based on the Referrer&apos;s active subscription tier at the time the referred user completes a Qualified Action or Payment:
      </Typography>
      <TableContainer component={Paper} variant="outlined" sx={{ mt: 2 }}>
        <Table aria-label="referral rewards table">
          <TableHead>
            <TableRow sx={{ backgroundColor: 'action.hover' }}>
              <TableCell sx={{ fontWeight: 'bold' }}>Referrer Tier</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Qualified Sign-Up Reward</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Qualified Purchase Reward</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Free</TableCell>
              <TableCell>Permanent +1 Extra Post Quota</TableCell>
              <TableCell>Additional +1 Extra Post Quota</TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Paid</TableCell>
              <TableCell>+50 AI Credits</TableCell>
              <TableCell>$10 Stripe Account Credit</TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Lifetime</TableCell>
              <TableCell>+50 AI Credits</TableCell>
              <TableCell>+1,000 AI Credits</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </section>

    <section>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>4. Grand Prizes</Typography>
      <Typography variant="body1" gutterBottom>
        In addition to the tiered rewards, referrers who accumulate a total of 5 <strong>Qualified Purchases</strong> unlock incredible permanent bonuses:
      </Typography>
      <ul>
        <li><Typography variant="body1"><strong>Lifetime Unlock:</strong> Any referrer who reaches 5 total Qualified Purchases over the lifetime of their account will automatically be upgraded to a Lifetime Deal, granting permanent free access to the platform.</Typography></li>
        <li><Typography variant="body1"><strong>Subscription Discount:</strong> Any referrer who maintains 5 <em>currently active</em> paid referrals will automatically receive a 100% off coupon applied to their own monthly subscription.</Typography></li>
      </ul>
    </section>

    <section>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>5. No Cash Value & Anti-Fraud</Typography>
      <Typography variant="body1" gutterBottom>
        Stripe credits and AI Credits have no real-world cash value and cannot be withdrawn or transferred. Self-referrals, creating fake accounts, or gaming the system will result in immediate permanent account termination and forfeiture of all rewards.
      </Typography>
    </section>
    <section>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>6. Refunds & Chargebacks</Typography>
      <Typography variant="body1" gutterBottom>
        If a referred user requests a refund or initiates a chargeback for their Qualifying Purchase, any rewards granted to the Referrer associated with that purchase (including Stripe Account Credits, AI Credits, and Grand Prize progress) will be immediately revoked and clawed back from the Referrer&apos;s account.
      </Typography>
    </section>

    <section>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>7. Right to Modify or Terminate</Typography>
      <Typography variant="body1" gutterBottom>
        We reserve the right to modify the reward amounts, change the qualifying actions, or suspend or terminate the Referral Program entirely at any time and for any reason, without prior notice.
      </Typography>
    </section>

    <section>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>8. Tax Liability</Typography>
      <Typography variant="body1" gutterBottom>
        Referrers are solely responsible for any and all tax liabilities associated with receiving rewards under this Program.
      </Typography>
    </section>

    <section>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>9. Relationship of Parties</Typography>
      <Typography variant="body1" gutterBottom>
        Participation in the Referral Program does not constitute an employment, agency, or partnership relationship between you and {BRAND.name}. Referrers have no authority to bind {BRAND.name} to any agreements or make representations on our behalf.
      </Typography>
    </section>

    <section>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>10. Limitation of Liability</Typography>
      <Typography variant="body1" gutterBottom>
        {BRAND.name} shall not be liable for any technical failures, bugs, or inability to accurately track referral links due to ad-blockers, cookie restrictions, or user error. Rewards are granted on a best-effort basis.
      </Typography>
    </section>
  </Stack>
);
