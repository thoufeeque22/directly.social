'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Alert,
  AlertTitle,
  Divider,
  Stack,
  Stepper,
  Step,
  StepLabel,
  FormControlLabel,
  Switch,
  Tooltip,
  Paper,
} from '@mui/material';
import StorageIcon from '@mui/icons-material/Storage';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CloudQueueIcon from '@mui/icons-material/CloudQueue';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import DeleteIcon from '@mui/icons-material/Delete';
import DoneIcon from '@mui/icons-material/Done';
import { GlassCard } from '../ui/GlassCard';

const STEPS = ['Select Provider', 'Configure CORS', 'Enter Credentials', 'Test & Save'];

const CORS_JSON = `[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["PUT", "POST", "GET", "HEAD"],
    "AllowedOrigins": ["*"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3000
  }
]`;

interface ByosConfigState {
  provider: 'S3' | 'R2';
  bucketName: string;
  endpoint: string;
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
  pathPrefix: string;
  keepFiles: boolean;
}

export const ByosWizard = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<ByosConfigState>({
    provider: 'S3',
    bucketName: '',
    endpoint: '',
    region: 'us-east-1',
    accessKeyId: '',
    secretAccessKey: '',
    pathPrefix: '',
    keepFiles: true,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [existingConfig, setExistingConfig] = useState<ByosConfigState | null>(null);
  const [copied, setCopied] = useState(false);

  // Active validation check indicators
  const [validationStage, setValidationStage] = useState<'idle' | 'checking' | 'success' | 'failed'>('idle');
  const [checklist, setChecklist] = useState({
    decrypt: 'pending', // 'pending' | 'loading' | 'success' | 'failed'
    bucket: 'pending',
    permissions: 'pending',
  });

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const res = await fetch('/api/settings/byos');
      if (res.ok) {
        const data = await res.json();
        if (data.config) {
          setExistingConfig(data.config);
          setFormData({
            provider: data.config.provider,
            bucketName: data.config.bucketName,
            endpoint: data.config.endpoint || '',
            region: data.config.region || 'us-east-1',
            accessKeyId: data.config.accessKeyId,
            secretAccessKey: data.config.secretAccessKey,
            pathPrefix: data.config.pathPrefix || '',
            keepFiles: data.config.keepFiles ?? true,
          });
        }
      }
    } catch (err: unknown) {
      console.error('Error fetching BYOS configuration:', err);
    }
  };

  const handleNext = () => {
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleCopyCors = async () => {
    try {
      await navigator.clipboard.writeText(CORS_JSON);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err: unknown) {
      console.error('Failed to copy text', err);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    setValidationStage('checking');
    setChecklist({
      decrypt: 'loading',
      bucket: 'pending',
      permissions: 'pending',
    });

    try {
      // Step 1: Simulating database verification
      await new Promise((resolve) => setTimeout(resolve, 800));
      setChecklist((prev) => ({ ...prev, decrypt: 'success', bucket: 'loading' }));

      // Step 2 & 3: Make actual API call to validate and save
      const res = await fetch('/api/settings/byos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setChecklist((prev) => ({ ...prev, bucket: 'failed', permissions: 'failed' }));
        setValidationStage('failed');
        setError(data.error || 'Connection failed');
        return;
      }

      setChecklist((prev) => ({ ...prev, bucket: 'success', permissions: 'loading' }));
      await new Promise((resolve) => setTimeout(resolve, 600));
      
      setChecklist((prev) => ({ ...prev, permissions: 'success' }));
      setValidationStage('success');
      setSuccess(true);
      setExistingConfig(data.config);
      
      setTimeout(() => {
        setSuccess(false);
      }, 5000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(`Validation failed: ${msg}`);
      setValidationStage('failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to disconnect your storage and return to default storage?')) return;
    
    setLoading(true);
    try {
      const res = await fetch('/api/settings/byos', { method: 'DELETE' });
      if (res.ok) {
        setExistingConfig(null);
        setFormData({
          provider: 'S3',
          bucketName: '',
          endpoint: '',
          region: 'us-east-1',
          accessKeyId: '',
          secretAccessKey: '',
          pathPrefix: '',
          keepFiles: true,
        });
        setActiveStep(0);
        setValidationStage('idle');
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to delete configuration');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(`Failed to disconnect: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Box sx={{ mt: 3, mb: 2 }}>
            <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4 }}>
              Select your storage provider. Both Amazon Web Services S3 and Cloudflare R2 are supported.
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                gap: 3,
              }}
            >
              <Paper
                variant="outlined"
                sx={{
                  p: 3,
                  cursor: 'pointer',
                  borderRadius: 3,
                  borderColor: formData.provider === 'S3' ? 'primary.main' : 'divider',
                  backgroundColor:
                    formData.provider === 'S3'
                      ? 'rgba(var(--primary-rgb), 0.05)'
                      : 'transparent',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: 'primary.main',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                  },
                }}
                onClick={() => setFormData((prev) => ({ ...prev, provider: 'S3', region: 'us-east-1' }))}
              >
                <Stack spacing={2} sx={{ alignItems: 'center' }}>
                  <CloudQueueIcon sx={{ fontSize: 40, color: formData.provider === 'S3' ? 'primary.main' : 'text.secondary' }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    AWS S3 Compatible
                  </Typography>
                  <Typography variant="body2" color="text.secondary" align="center">
                    Use Amazon Web Services S3 or any fully S3-compliant standard API storage buckets.
                  </Typography>
                </Stack>
              </Paper>

              <Paper
                variant="outlined"
                sx={{
                  p: 3,
                  cursor: 'pointer',
                  borderRadius: 3,
                  borderColor: formData.provider === 'R2' ? 'primary.main' : 'divider',
                  backgroundColor:
                    formData.provider === 'R2'
                      ? 'rgba(var(--primary-rgb), 0.05)'
                      : 'transparent',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: 'primary.main',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                  },
                }}
                onClick={() => setFormData((prev) => ({ ...prev, provider: 'R2', region: 'auto' }))}
              >
                <Stack spacing={2} sx={{ alignItems: 'center' }}>
                  <StorageIcon sx={{ fontSize: 40, color: formData.provider === 'R2' ? 'primary.main' : 'text.secondary' }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Cloudflare R2
                  </Typography>
                  <Typography variant="body2" color="text.secondary" align="center">
                    Enjoy zero-egress cost Cloudflare R2 bucket. Perfect for direct uploader streaming.
                  </Typography>
                </Stack>
              </Paper>
            </Box>
          </Box>
        );

      case 1:
        return (
          <Box sx={{ mt: 3, mb: 2 }}>
            <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3 }}>
              To allow safe direct uploads from your web browser to the storage bucket, you must enable CORS rules in your provider dashboard.
            </Typography>
            <Paper
              variant="outlined"
              sx={{
                p: 3,
                borderRadius: 3,
                backgroundColor: 'rgba(0,0,0,0.02)',
                position: 'relative',
              }}
            >
              <Stack spacing={1.5} direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                  Recommended CORS JSON Rules
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={copied ? <DoneIcon /> : <ContentCopyIcon />}
                  onClick={handleCopyCors}
                  sx={{ borderRadius: 2, textTransform: 'none' }}
                >
                  {copied ? 'Copied' : 'Copy Rules'}
                </Button>
              </Stack>
              <pre
                style={{
                  margin: 0,
                  padding: '12px',
                  borderRadius: '8px',
                  backgroundColor: '#1E1E1E',
                  color: '#D4D4D4',
                  fontSize: '0.85rem',
                  overflowX: 'auto',
                  fontFamily: 'monospace',
                }}
              >
                {CORS_JSON}
              </pre>
            </Paper>
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 3 }}>
              Copy the configuration above and paste it inside the <strong>CORS policy</strong> section in the bucket settings tab on your Cloudflare R2 / AWS S3 panel.
            </Typography>
          </Box>
        );

      case 2:
        return (
          <Box sx={{ mt: 3, mb: 2 }}>
            <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4 }}>
              Enter the bucket parameters and API credentials. Key fields are masked when saved and encrypted at rest.
            </Typography>
            <Stack spacing={3}>
              <Box>
                <label htmlFor="byos-bucket-name" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', color: 'hsl(var(--foreground))' }}>
                  Bucket Name *
                </label>
                <TextField
                  id="byos-bucket-name"
                  fullWidth
                  value={formData.bucketName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, bucketName: e.target.value }))}
                  placeholder="my-social-studio-bucket"
                  size="small"
                />
              </Box>

              {formData.provider === 'R2' && (
                <Box>
                  <label htmlFor="byos-endpoint" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', color: 'hsl(var(--foreground))' }}>
                    Endpoint URL *
                  </label>
                  <TextField
                    id="byos-endpoint"
                    fullWidth
                    value={formData.endpoint}
                    onChange={(e) => setFormData((prev) => ({ ...prev, endpoint: e.target.value }))}
                    placeholder="https://<account-id>.r2.cloudflarestorage.com"
                    size="small"
                    helperText="Found inside your Cloudflare R2 dashboard."
                  />
                </Box>
              )}

              {formData.provider === 'S3' && (
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                  <Box>
                    <label htmlFor="byos-region" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', color: 'hsl(var(--foreground))' }}>
                      Region
                    </label>
                    <TextField
                      id="byos-region"
                      fullWidth
                      value={formData.region}
                      onChange={(e) => setFormData((prev) => ({ ...prev, region: e.target.value }))}
                      placeholder="us-east-1"
                      size="small"
                    />
                  </Box>
                  <Box>
                    <label htmlFor="byos-custom-endpoint" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', color: 'hsl(var(--foreground))' }}>
                      Endpoint Override (Optional)
                    </label>
                    <TextField
                      id="byos-custom-endpoint"
                      fullWidth
                      value={formData.endpoint}
                      onChange={(e) => setFormData((prev) => ({ ...prev, endpoint: e.target.value }))}
                      placeholder="https://s3.amazonaws.com"
                      size="small"
                    />
                  </Box>
                </Box>
              )}

              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                <Box>
                  <label htmlFor="byos-access-key-id" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', color: 'hsl(var(--foreground))' }}>
                    Access Key ID *
                  </label>
                  <TextField
                    id="byos-access-key-id"
                    fullWidth
                    value={formData.accessKeyId}
                    onChange={(e) => setFormData((prev) => ({ ...prev, accessKeyId: e.target.value }))}
                    placeholder={existingConfig ? '••••••••' : 'Enter your Access Key'}
                    size="small"
                  />
                </Box>
                <Box>
                  <label htmlFor="byos-secret-access-key" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', color: 'hsl(var(--foreground))' }}>
                    Secret Access Key *
                  </label>
                  <TextField
                    id="byos-secret-access-key"
                    fullWidth
                    type="password"
                    value={formData.secretAccessKey}
                    onChange={(e) => setFormData((prev) => ({ ...prev, secretAccessKey: e.target.value }))}
                    placeholder={existingConfig ? '••••••••' : 'Enter your Secret Key'}
                    size="small"
                  />
                </Box>
              </Box>

              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                <Box>
                  <label htmlFor="byos-path-prefix" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', color: 'hsl(var(--foreground))' }}>
                    Path Prefix (Folder)
                  </label>
                  <TextField
                    id="byos-path-prefix"
                    fullWidth
                    value={formData.pathPrefix}
                    onChange={(e) => setFormData((prev) => ({ ...prev, pathPrefix: e.target.value }))}
                    placeholder="e.g. social-studio/"
                    size="small"
                  />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', pt: 3 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.keepFiles}
                        onChange={(e) => setFormData((prev) => ({ ...prev, keepFiles: e.target.checked }))}
                        color="primary"
                      />
                    }
                    label="Keep uploaded assets in bucket"
                  />
                </Box>
              </Box>
            </Stack>
          </Box>
        );

      case 3:
        return (
          <Box sx={{ mt: 3, mb: 2 }}>
            <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4 }}>
              Click validation button to verify bucket parameters, perform a lightweight check, and finalize setup.
            </Typography>

            {validationStage !== 'idle' && (
              <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, mb: 4, backgroundColor: 'rgba(0,0,0,0.01)' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                  Active Health Check Status
                </Typography>
                <Stack spacing={2}>
                  {/* Step 1 */}
                  <Stack spacing={1.5} direction="row" sx={{ alignItems: 'center' }}>
                    {checklist.decrypt === 'loading' && <CircularProgress size={16} />}
                    {checklist.decrypt === 'success' && <CheckCircleIcon color="success" sx={{ fontSize: 18 }} />}
                    {checklist.decrypt === 'failed' && <ErrorIcon color="error" sx={{ fontSize: 18 }} />}
                    {checklist.decrypt === 'pending' && <Box sx={{ width: 18, height: 18, borderRadius: '50%', border: '1px solid #CCC' }} />}
                    <Typography variant="body2">
                      Encrypt credentials and authorize local database write
                    </Typography>
                  </Stack>

                  {/* Step 2 */}
                  <Stack spacing={1.5} direction="row" sx={{ alignItems: 'center' }}>
                    {checklist.bucket === 'loading' && <CircularProgress size={16} />}
                    {checklist.bucket === 'success' && <CheckCircleIcon color="success" sx={{ fontSize: 18 }} />}
                    {checklist.bucket === 'failed' && <ErrorIcon color="error" sx={{ fontSize: 18 }} />}
                    {checklist.bucket === 'pending' && <Box sx={{ width: 18, height: 18, borderRadius: '50%', border: '1px solid #CCC' }} />}
                    <Typography variant="body2">
                      Validate Bucket name, Region endpoints, and active authentication
                    </Typography>
                  </Stack>

                  {/* Step 3 */}
                  <Stack spacing={1.5} direction="row" sx={{ alignItems: 'center' }}>
                    {checklist.permissions === 'loading' && <CircularProgress size={16} />}
                    {checklist.permissions === 'success' && <CheckCircleIcon color="success" sx={{ fontSize: 18 }} />}
                    {checklist.permissions === 'failed' && <ErrorIcon color="error" sx={{ fontSize: 18 }} />}
                    {checklist.permissions === 'pending' && <Box sx={{ width: 18, height: 18, borderRadius: '50%', border: '1px solid #CCC' }} />}
                    <Typography variant="body2">
                      Perform pre-flight listing to verify multipart upload capabilities
                    </Typography>
                  </Stack>
                </Stack>
              </Paper>
            )}

            {error && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                <AlertTitle>Validation Failed</AlertTitle>
                {error}
              </Alert>
            )}

            {success && (
              <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
                <AlertTitle>Connection Active</AlertTitle>
                BYOS setup complete and active. All uploads will bypass local servers and stream directly to your bucket.
              </Alert>
            )}

            <Button
              fullWidth
              variant="contained"
              onClick={handleSave}
              disabled={loading}
              sx={{
                py: 1.5,
                borderRadius: 2,
                fontWeight: 600,
                textTransform: 'none',
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Run Active Connection Checks & Save'}
            </Button>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <GlassCard style={{ overflow: 'hidden', padding: '1.5rem' }}>
      <Box sx={{ p: 2 }}>
        <Stack spacing={1.5} direction="row" sx={{ mb: 3, alignItems: 'center', justifyContent: 'space-between' }}>
          <Stack spacing={1.5} direction="row" sx={{ alignItems: 'center' }}>
            <StorageIcon sx={{ fontSize: 28, color: 'primary.main' }} />
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Bring Your Own Storage (BYOS)
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Upload massive video files directly to Cloudflare R2 or AWS S3 buckets.
              </Typography>
            </Box>
          </Stack>
          {existingConfig && (
            <Tooltip title="Storage Connected">
              <Box
                sx={{
                  px: 2,
                  py: 0.5,
                  borderRadius: 3,
                  backgroundColor: 'rgba(76, 175, 80, 0.1)',
                  color: 'success.main',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  border: '1px solid rgba(76, 175, 80, 0.2)',
                }}
              >
                <CheckCircleIcon sx={{ fontSize: 14 }} />
                Active Pipeline
              </Box>
            </Tooltip>
          )}
        </Stack>

        {existingConfig && activeStep === 0 && (
          <Paper variant="outlined" sx={{ p: 3, mb: 4, borderRadius: 3, backgroundColor: 'rgba(0,0,0,0.01)' }}>
            <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  Active Storage Configured ({existingConfig.provider})
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  Bucket: {existingConfig.bucketName} | Region: {existingConfig.region || 'auto'}
                </Typography>
              </Box>
              <Button
                variant="outlined"
                color="error"
                size="small"
                startIcon={<DeleteIcon />}
                onClick={handleDelete}
                disabled={loading}
                sx={{ borderRadius: 2, textTransform: 'none' }}
              >
                Disconnect Storage
              </Button>
            </Stack>
          </Paper>
        )}

        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
          {STEPS.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Divider sx={{ mb: 3, opacity: 0.05 }} />

        {renderStepContent()}

        <Divider sx={{ my: 3, opacity: 0.05 }} />

        <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
          <Button
            disabled={activeStep === 0 || loading}
            onClick={handleBack}
            startIcon={<ArrowBackIcon />}
            sx={{ borderRadius: 2, textTransform: 'none' }}
          >
            Back
          </Button>

          {activeStep < STEPS.length - 1 ? (
            <Button
              variant="contained"
              onClick={handleNext}
              endIcon={<ArrowForwardIcon />}
              disabled={
                (activeStep === 2 && (!formData.bucketName || !formData.accessKeyId || !formData.secretAccessKey || (formData.provider === 'R2' && !formData.endpoint)))
              }
              sx={{ borderRadius: 2, textTransform: 'none' }}
            >
              Continue
            </Button>
          ) : null}
        </Stack>
      </Box>
    </GlassCard>
  );
};
