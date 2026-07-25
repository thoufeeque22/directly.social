import React from 'react';
import { Typography } from '@mui/material';
import { BRAND } from '@/lib/core/brand';

export const ReferralTermsLegalDetails = () => (
  <>
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
  </>
);
