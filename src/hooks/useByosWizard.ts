import { useState, useEffect } from 'react';
import { getByosConfigAction, saveByosConfigAction, deleteByosConfigAction } from '@/lib/actions/settings';

export interface ByosConfigState {
  provider: 'S3' | 'R2';
  bucketName: string;
  endpoint: string;
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
  pathPrefix: string;
  keepFiles: boolean;
}

export const useByosWizard = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<ByosConfigState>({
    provider: 'S3', bucketName: '', endpoint: '', region: 'us-east-1',
    accessKeyId: '', secretAccessKey: '', pathPrefix: '', keepFiles: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [existingConfig, setExistingConfig] = useState<ByosConfigState | null>(null);
  const [validationStage, setValidationStage] = useState<'idle' | 'checking' | 'success' | 'failed'>('idle');
  const [checklist, setChecklist] = useState({ decrypt: 'pending', bucket: 'pending', permissions: 'pending' });

  const fetchConfig = async () => {
    try {
      const result = await getByosConfigAction();
      if (result.config) {
        setExistingConfig(result.config as unknown as ByosConfigState);
        setFormData({ 
          ...(result.config as unknown as ByosConfigState), 
          endpoint: result.config.endpoint || '', 
          region: result.config.region || 'us-east-1' 
        });
      }
    } catch (e) {
      console.error('Failed to fetch BYOS config', e);
    }
  };

  useEffect(() => { 
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchConfig(); 
  }, []);

  const handleSave = async () => {
    setLoading(true); 
    setError(null); 
    setValidationStage('checking');
    setChecklist({ decrypt: 'loading', bucket: 'pending', permissions: 'pending' });
    
    try {
      await new Promise(r => setTimeout(r, 800));
      setChecklist(p => ({ ...p, decrypt: 'success', bucket: 'loading' }));

      const result = await saveByosConfigAction(formData);

      if (!result.success) {
        setChecklist(p => ({ ...p, bucket: 'failed', permissions: 'failed' }));
        setValidationStage('failed'); 
        setError(result.error || 'Connection failed'); 
        return;
      }
      
      setChecklist(p => ({ ...p, bucket: 'success', permissions: 'loading' }));
      await new Promise(r => setTimeout(r, 600));
      setChecklist(p => ({ ...p, permissions: 'success' }));
      setValidationStage('success'); 
      setSuccess(true); 
      setExistingConfig(result.config as unknown as ByosConfigState);
      setTimeout(() => setSuccess(false), 5000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
      setValidationStage('failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Disconnect storage?')) return;
    setLoading(true);
    try {
      const res = await deleteByosConfigAction();
      if (res.success) {
        setExistingConfig(null);
        setFormData({ 
          provider: 'S3', bucketName: '', endpoint: '', region: 'us-east-1', 
          accessKeyId: '', secretAccessKey: '', pathPrefix: '', keepFiles: true 
        });
        setActiveStep(0); 
        setValidationStage('idle');
      }
    } catch (e) {
      console.error('Failed to delete BYOS config', e);
    }
    setLoading(false);
  };

  return { 
    activeStep, setActiveStep, formData, setFormData, loading, error, 
    success, existingConfig, validationStage, checklist, handleSave, handleDelete 
  };
};
