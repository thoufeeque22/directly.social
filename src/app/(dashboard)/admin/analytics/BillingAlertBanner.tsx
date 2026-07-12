"use client";

import React from "react";
import { Alert, AlertTitle, Box, Button } from "@mui/material";
import { BillingInfo } from "./BillingCard";

interface BillingAlertBannerProps {
  billing: BillingInfo[];
}

export function BillingAlertBanner({ billing }: BillingAlertBannerProps) {
  const criticalProviders = billing.filter(b => b.status === "CRITICAL");
  const warningProviders = billing.filter(b => b.status === "WARNING");

  if (criticalProviders.length === 0 && warningProviders.length === 0) {
    return null;
  }

  const isCritical = criticalProviders.length > 0;
  const severity = isCritical ? "error" : "warning";
  const title = isCritical ? "Critical Billing Alert" : "Billing Warning";
  
  const providersList = [...criticalProviders, ...warningProviders]
    .map(p => p.provider)
    .join(", ");

  return (
    <Box sx={{ mb: 3 }}>
      <Alert 
        severity={severity} 
        variant="filled"
        action={
          <Button color="inherit" size="small" href="https://console.cloud.google.com/billing" target="_blank">
            Manage Billing
          </Button>
        }
      >
        <AlertTitle>{title}</AlertTitle>
        The following API providers have reached their budget thresholds: <strong>{providersList}</strong>. 
        AI features may be restricted to prevent overages.
      </Alert>
    </Box>
  );
}
