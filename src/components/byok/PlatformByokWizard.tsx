/* eslint-disable max-lines */
'use client';

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
import { SettingsWizardCard } from '../settings/SettingsWizardCard';
import { BRAND } from '@/lib/core/brand';
import { getPortalDetails } from './portal-details';

import { useByokWizard } from './PlatformByokWizard.utils';

interface PlatformByokWizardProps {
  platform: string;
}

export const PlatformByokWizard = ({ platform }: PlatformByokWizardProps) => {
  const { credentials, setCredentials, loading, error, success, handleSave } = useByokWizard(platform);

  const portal = getPortalDetails(platform);
  const displayName = platform.charAt(0).toUpperCase() + platform.slice(1);

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

        <Box sx={{ minHeight: 80, mb: 3 }}>
          {error && (
            <Alert severity="error" sx={{ borderRadius: 2 }} data-testid="error-message">
              <AlertTitle>Validation Failed</AlertTitle>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ borderRadius: 2 }} data-testid="success-message">
              <AlertTitle>Connection Successful</AlertTitle>
              Your {displayName} BYOK credentials have been saved securely.
            </Alert>
          )}
        </Box>

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
