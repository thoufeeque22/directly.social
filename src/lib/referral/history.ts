/* eslint-disable @typescript-eslint/no-explicit-any */
export function computeReferralHistory(referrals: any[]) {
  return referrals.map((ref: any) => {
    const isPaid = ref.billingProfile && ref.billingProfile.subscriptionTier !== 'FREE_STARTER';
    const isActive = ref.billingProfile?.subscriptionStatus === 'ACTIVE';
    
    let status = 'Free';
    if (isPaid) {
      status = isActive ? 'Active' : 'Churned';
    }
    
    const obfuscated = ref.email ? `${ref.email[0]}***@${ref.email.split('@')[1]}` : 'Unknown';
    
    return { email: obfuscated, status };
  });
}
