import { z } from 'zod';

export const byokCredentialSchema = z.object({
  clientId: z.string().min(1, 'Client ID is required'),
  clientSecret: z.string().min(1, 'Client Secret is required'),
  redirectUri: z.string().url('Invalid Redirect URI'),
});

export type ByokCredential = z.infer<typeof byokCredentialSchema>;

export const validateCredentials = async (
  platform: string,
  credentials: ByokCredential
): Promise<{ success: boolean; message: string }> => {
  // Mock validation logic - replace with actual platform-specific health checks
  return new Promise((resolve) => {
    setTimeout(() => {
      if (credentials.clientId === 'valid') {
        resolve({ success: true, message: 'Successfully connected' });
      } else {
        resolve({ success: false, message: 'Invalid credentials for ' + platform });
      }
    }, 1000);
  });
};
