import { useState, useEffect } from 'react';

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

  useEffect(() => { fetchConfig(); }, []);

  const fetchConfig = async () => {
    const res = await fetch('/api/settings/byos');
    if (res.ok) {
      const data = await res.json();
      if (data.config) {
        setExistingConfig(data.config);
        setFormData({ ...data.config, endpoint: data.config.endpoint || '', region: data.config.region || 'us-east-1' });
      }
    }
  };

  const handleSave = async () => {
    setLoading(true); setError(null); setValidationStage('checking');
    setChecklist({ decrypt: 'loading', bucket: 'pending', permissions: 'pending' });
    try {
      await new Promise(r => setTimeout(r, 800));
      setChecklist(p => ({ ...p, decrypt: 'success', bucket: 'loading' }));
      const res = await fetch('/api/settings/byos', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        setChecklist(p => ({ ...p, bucket: 'failed', permissions: 'failed' }));
        setValidationStage('failed'); setError(data.error || 'Connection failed'); return;
      }
      setChecklist(p => ({ ...p, bucket: 'success', permissions: 'loading' }));
      await new Promise(r => setTimeout(r, 600));
      setChecklist(p => ({ ...p, permissions: 'success' }));
      setValidationStage('success'); setSuccess(true); setExistingConfig(data.config);
      setTimeout(() => setSuccess(false), 5000);
    } catch (err: any) { setError(err.message); setValidationStage('failed'); } finally { setLoading(false); }
  };

  const handleDelete = async () => {
    if (!confirm('Disconnect storage?')) return;
    setLoading(true);
    const res = await fetch('/api/settings/byos', { method: 'DELETE' });
    if (res.ok) {
      setExistingConfig(null);
      setFormData({ provider: 'S3', bucketName: '', endpoint: '', region: 'us-east-1', accessKeyId: '', secretAccessKey: '', pathPrefix: '', keepFiles: true });
      setActiveStep(0); setValidationStage('idle');
    }
    setLoading(false);
  };

  return { activeStep, setActiveStep, formData, setFormData, loading, error, success, existingConfig, validationStage, checklist, handleSave, handleDelete };
};
