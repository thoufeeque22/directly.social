import { useState } from 'react';
import { Box, TextField, Button, Typography, CircularProgress } from '@mui/material';
import { validateCredentials, ByokCredential } from '../../lib/byok/credential-validator';

export const ByokWizard = ({ platform }: { platform: string }) => {
  const [credentials, setCredentials] = useState<ByokCredential>({ clientId: '', clientSecret: '', redirectUri: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    setLoading(true);
    setError('');
    const result = await validateCredentials(platform, credentials);
    if (!result.success) {
      setError(result.message);
    } else {
      // Logic for saving to localStorage securely
      localStorage.setItem(`byok_${platform}`, JSON.stringify(credentials));
    }
    setLoading(false);
  };

  return (
    <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h6">Setup {platform} BYOK</Typography>
      <TextField label="Client ID" value={credentials.clientId} onChange={(e) => setCredentials({ ...credentials, clientId: e.target.value })} />
      <TextField label="Client Secret" type="password" value={credentials.clientSecret} onChange={(e) => setCredentials({ ...credentials, clientSecret: e.target.value })} />
      <TextField label="Redirect URI" value={credentials.redirectUri} onChange={(e) => setCredentials({ ...credentials, redirectUri: e.target.value })} />
      {error && <Typography color="error">{error}</Typography>}
      <Button variant="contained" onClick={handleSave} disabled={loading}>
        {loading ? <CircularProgress size={24} /> : 'Save Credentials'}
      </Button>
    </Box>
  );
};
