import { useState } from 'react';
import { ByokCredential } from '../../lib/byok/credential-validator';
import { validateAndSaveByokAction } from '../../app/actions/byok';

export function useByokWizard(platform: string) {
  const [credentials, setCredentials] = useState<ByokCredential>({ 
    clientId: '', 
    clientSecret: '', 
    redirectUri: '' 
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

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

  return { credentials, setCredentials, loading, error, success, handleSave };
}
