interface ReferralItem {
  billingProfile?: {
    subscriptionTier?: string;
    subscriptionStatus?: string;
  } | null;
  email?: string | null;
}

export function computeReferralHistory(referrals: ReferralItem[]) {
  return referrals.map((ref) => {
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
