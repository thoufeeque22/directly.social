import React from 'react';
import { Box, Divider, Stack, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { GlassCard } from '../ui/GlassCard';
import { ByosWizardHeader } from './byos/ByosWizardHeader';
import { ByosWizardStepper, STEPS } from './byos/ByosWizardStepper';
import { ByosExistingConfig } from './byos/ByosExistingConfig';
import { ByosStep1Provider } from './byos/ByosStep1Provider';
import { ByosStep2Cors } from './byos/ByosStep2Cors';
import { ByosStep3Credentials } from './byos/ByosStep3Credentials';
import { ByosStep4Validation } from './byos/ByosStep4Validation';
import { useByosWizard } from '@/hooks/useByosWizard';

export const ByosWizard = () => {
  const { activeStep, setActiveStep, formData, setFormData, loading, error, success, existingConfig, validationStage, checklist, handleSave, handleDelete } = useByosWizard();

  const handleFieldChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const renderContent = () => {
    switch (activeStep) {
      case 0: return <ByosStep1Provider provider={formData.provider} onProviderChange={(p) => setFormData(prev => ({ ...prev, provider: p, region: p === 'S3' ? 'us-east-1' : 'auto' }))} />;
      case 1: return <ByosStep2Cors />;
      case 2: return <ByosStep3Credentials formData={formData} onFieldChange={handleFieldChange} existingConfig={!!existingConfig} />;
      case 3: return <ByosStep4Validation validationStage={validationStage} checklist={checklist} error={error} success={success} loading={loading} onSave={handleSave} />;
      default: return null;
    }
  };

  const isNextDisabled = activeStep === 2 && (!formData.bucketName || !formData.accessKeyId || !formData.secretAccessKey || (formData.provider === 'R2' && !formData.endpoint));

  return (
    <GlassCard style={{ overflow: 'hidden', padding: '1.5rem' }}>
      <Box sx={{ p: 2 }}>
        <ByosWizardHeader existingConfig={existingConfig} />
        {existingConfig && activeStep === 0 && <ByosExistingConfig config={existingConfig} onDelete={handleDelete} loading={loading} />}
        <ByosWizardStepper activeStep={activeStep} />
        <Divider sx={{ mb: 3, opacity: 0.05 }} />
        {renderContent()}
        <Divider sx={{ my: 3, opacity: 0.05 }} />
        <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
          <Button disabled={activeStep === 0 || loading} onClick={() => setActiveStep(activeStep - 1)} startIcon={<ArrowBackIcon />}>Back</Button>
          {activeStep < STEPS.length - 1 && (
            <Button variant="contained" onClick={() => setActiveStep(activeStep + 1)} endIcon={<ArrowForwardIcon />} disabled={isNextDisabled}>Continue</Button>
          )}
        </Stack>
      </Box>
    </GlassCard>
  );
};
