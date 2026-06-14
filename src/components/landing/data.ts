import React from 'react';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import StorageIcon from '@mui/icons-material/Storage';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import { PRICING_TIERS, PRODUCT_FEATURES, HOW_IT_WORKS_STEPS } from '@/lib/core/product-data';

// Map icon names to React components
const ICON_MAP: Record<string, React.ReactElement> = {
  Storage: React.createElement(StorageIcon, { fontSize: "large" }),
  VpnKey: React.createElement(VpnKeyIcon, { fontSize: "large" }),
  AutoAwesome: React.createElement(AutoAwesomeIcon, { fontSize: "large" }),
  ContentPaste: React.createElement(ContentPasteIcon, { fontSize: "large" }),
};

export const features = PRODUCT_FEATURES.map(f => ({
  ...f,
  icon: ICON_MAP[f.iconName] || ICON_MAP.Storage
}));

export const pricingTiers = [...PRICING_TIERS];

export const howItWorksSteps = HOW_IT_WORKS_STEPS.map(s => ({
  ...s,
  // Add additional UI-specific logic if needed
  description: s.step === 3 
    ? `${s.description} [Learn why this matters](/philosophy)` 
    : s.description
}));
