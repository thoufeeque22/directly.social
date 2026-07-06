/* eslint-disable max-lines */
'use client';

import { useState } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  CircularProgress, 
  Alert, 
  AlertTitle, 
  Stack
} from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import YouTubeIcon from '@mui/icons-material/YouTube';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import { ByokCredential } from '../../lib/byok/credential-validator';
import { SettingsWizardCard } from '../settings/SettingsWizardCard';
import { validateAndSaveByokAction } from '../../app/actions/byok';
import { BRAND } from '@/lib/core/brand';

interface PlatformByokWizardProps {
  platform: string;
}

export const PlatformByokWizard = ({ platform }: PlatformByokWizardProps) => {
  const [credentials, setCredentials] = useState<ByokCredential>({ 
    clientId: '', 
    clientSecret: '', 
    redirectUri: '' 
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const getPortalDetails = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'youtube':
        return {
          url: 'https://console.cloud.google.com/',
          icon: <YouTubeIcon sx={{ color: '#FF0000' }} />,
          instruction: 'Create a project in Google Cloud Console and enable the YouTube Data API v3.'
        };
      case 'tiktok':
        return {
          url: 'https://developers.tiktok.com/console',
          icon: <MusicNoteIcon sx={{ color: '#000000' }} />,
          instruction: 'Register as a developer on TikTok for Developers and create a new App.'
        };
      case 'facebook':
        return {
          url: 'https://developers.facebook.com/',
          icon: <FacebookIcon sx={{ color: '#1877F2' }} />,
          instruction: 'Create a Meta App and configure the Graph API with appropriate permissions.'
        };
      case 'instagram':
        return {
          url: 'https://developers.facebook.com/',
          icon: <InstagramIcon sx={{ color: '#E4405F' }} />,
          instruction: 'Enable Instagram Graph API in your Meta Developer App settings.'
        };
      default:
        return {
          url: '#',
          icon: null,
          instruction: `Generate credentials in the ${platform} developer portal.`
        };
    }
  };

  const portal = getPortalDetails(platform);
  const displayName = platform.charAt(0).toUpperCase() + platform.slice(1);

  const handleSave = async () => {
    setLoading(true);
    setError('');
    setSuccess(false);
    
    try {
      const result = await validateAndSaveByokAction({ platform, ...credentials });
      if (result.success) {
        setSuccess(true);
      } else {
        setError(result.error || 'Validation failed.');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SettingsWizardCard
      title={`${displayName} Integration`}
      icon={portal.icon}
      data-testid={`byok-wizard-${platform.toLowerCase()}`}
    >
        <Box sx={{ mb: 4 }}>
          <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 700 }}>
            Step 1: Get Your Keys
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
            {portal.instruction}
          </Typography>
          <Button
            variant="outlined"
            size="small"
            href={portal.url}
            target="_blank"
            rel="noopener noreferrer"
            endIcon={<OpenInNewIcon />}
            sx={{ borderRadius: 2, textTransform: 'none' }}
          >
            Go to Developer Portal
          </Button>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 700, mb: 2, display: 'block' }}>
            Step 2: Configure Credentials
          </Typography>
          <Stack spacing={2.5}>
            <TextField 
              fullWidth
              label="Client ID" 
              data-testid="client-id-input" 
              value={credentials.clientId} 
              onChange={(e) => setCredentials({ ...credentials, clientId: e.target.value })}
              placeholder="Enter your API Client ID"
              size="small"
            />
            <TextField 
              fullWidth
              label="Client Secret" 
              data-testid="client-secret-input" 
              type="password" 
              value={credentials.clientSecret} 
              onChange={(e) => setCredentials({ ...credentials, clientSecret: e.target.value })}
              placeholder="Enter your API Client Secret"
              size="small"
            />
            <TextField 
              fullWidth
              label="Redirect URI" 
              data-testid="redirect-uri-input" 
              value={credentials.redirectUri} 
              onChange={(e) => setCredentials({ ...credentials, redirectUri: e.target.value })}
              placeholder={`${BRAND.url}/callback`}
              size="small"
              helperText="Must match the authorized redirect URI in your dev portal."
            />
          </Stack>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }} data-testid="error-message">
            <AlertTitle>Validation Failed</AlertTitle>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }} data-testid="success-message">
            <AlertTitle>Connection Successful</AlertTitle>
            Your {displayName} BYOK credentials have been saved securely.
          </Alert>
        )}

        <Button 
          fullWidth
          variant="contained" 
          onClick={handleSave} 
          disabled={loading} 
          data-testid="save-button"
          sx={{ 
            py: 1.2, 
            borderRadius: 2, 
            fontWeight: 600,
            textTransform: 'none',
            boxShadow: 'none',
            '&:hover': { boxShadow: '0 4px 12px rgba(var(--primary-rgb), 0.3)' }
          }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Validate & Save Credentials'}
        </Button>
    </SettingsWizardCard>
  );
};
