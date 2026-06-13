"use client";

import React from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Divider, 
  Alert
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import SecurityIcon from '@mui/icons-material/Security';

interface DataExportSectionProps {
  loading: boolean;
  message: { type: 'success' | 'error', text: string } | null;
  onRequest: () => void;
}

export const DataExportSection: React.FC<DataExportSectionProps> = ({
  loading,
  message,
  onRequest
}) => (
  <Box sx={{ mb: 4 }}>
    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
      <DownloadIcon color="primary" /> Data Export
    </Typography>
    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
      You can download a machine-readable export of your data immediately, including your profile information, connected accounts, and activity logs.
      The export will be generated in JSON format.
    </Typography>
    {message && (
      <Alert severity={message.type} sx={{ mb: 2 }}>
        {message.text}
      </Alert>
    )}
    <Button 
      variant="outlined" 
      color="primary" 
      startIcon={<DownloadIcon />}
      onClick={onRequest}
      disabled={loading}
    >
      {loading ? 'Requesting...' : 'Request Data Export'}
    </Button>
  </Box>
);

export const PrivacyPolicySection = () => (
  <>
    <Divider sx={{ mb: 4 }} />
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
        <SecurityIcon color="primary" /> Privacy Policy
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
        Learn more about how we handle your data and your rights under GDPR by reading our full privacy policy.
      </Typography>
      <Button variant="text" color="primary" href="/privacy" target="_blank">
        View Privacy Policy
      </Button>
    </Box>
  </>
);

interface DangerZoneSectionProps {
  onDelete: () => void;
}

export const DangerZoneSection: React.FC<DangerZoneSectionProps> = ({ onDelete }) => (
  <>
    <Divider sx={{ mb: 4 }} />
    <Box sx={{ p: 2, border: '1px solid', borderColor: 'error.main', borderRadius: 2, bgcolor: 'rgba(211, 47, 47, 0.05)' }}>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: 'error.main', display: 'flex', alignItems: 'center', gap: 1 }}>
        <DeleteForeverIcon /> Danger Zone
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
        Deleting your account is permanent and your existing data cannot be recovered. 
        <br/>
        <strong>However, you are always welcome back—you can create a fresh account later using the same email address if you choose to return.</strong>
      </Typography>
      <Button 
        variant="contained" 
        color="error" 
        startIcon={<DeleteForeverIcon />}
        onClick={onDelete}
      >
        Delete Account
      </Button>
    </Box>
  </>
);
