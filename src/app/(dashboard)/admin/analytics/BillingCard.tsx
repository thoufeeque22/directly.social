"use client";

import React from "react";
import { 
  Paper, 
  Typography, 
  Box, 
  Chip,
  Tooltip,
  IconButton
} from "@mui/material";
import { Info as InfoIcon } from "@mui/icons-material";

export interface BillingInfo {
  id: string;
  provider: string;
  currentSpend: number;
  threshold: number;
  currency: string;
  lastSynced: string;
  status: "HEALTHY" | "WARNING" | "CRITICAL" | "UNKNOWN";
}

interface BillingCardProps {
  billing: BillingInfo;
}

export function BillingCard({ billing }: BillingCardProps) {
  const getStatusColor = (status: string): "success" | "warning" | "error" | "default" => {
    switch (status) {
      case "HEALTHY": return "success";
      case "WARNING": return "warning";
      case "CRITICAL": return "error";
      default: return "default";
    }
  };

  return (
    <Paper elevation={0} sx={{ 
      p: 2, 
      borderRadius: 2, 
      border: '1px solid', 
      borderColor: 'divider',
      bgcolor: 'background.paper',
      position: 'relative'
    }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: "bold", textTransform: 'uppercase' }}>
          {billing.provider} API Spend
        </Typography>
        <Chip 
          label={billing.status} 
          size="small" 
          color={getStatusColor(billing.status)}
          sx={{ fontWeight: 'bold', height: 20, fontSize: '0.65rem' }}
        />
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
        <Typography variant="h4" color="primary" sx={{ fontWeight: "bold" }}>
          ${billing.currentSpend.toFixed(2)}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
          / ${billing.threshold.toFixed(2)}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
        <Typography variant="caption" color="text.secondary">
          Synced: {new Date(billing.lastSynced).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Typography>
        <Tooltip title={`Last full sync at ${new Date(billing.lastSynced).toLocaleString()}`}>
          <IconButton size="small">
            <InfoIcon sx={{ fontSize: 14 }} />
          </IconButton>
        </Tooltip>
      </Box>
    </Paper>
  );
}
