import React from 'react';
import { Box, Divider, Stack, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { GlassCard } from '../ui/GlassCard';
import { ByosWizardHeader } from './byos/ByosWizardHeader';
import { ByosWizardStepper, STEPS } from './byos/ByosWizardStepper';
import { ByosExistingConfig } from './byos/ByosExistingConfig';
import { ByosStep0 } from './byos/ByosStep0';
import { ByosStep1 } from './byos/ByosStep1';
import { ByosStep2 } from './byos/ByosStep2';
import { ByosStep3 } from './byos/ByosStep3';
import { useByosWizard } from '@/hooks/useByosWizard';

export const ByosWizard = () => {
  const { activeStep, setActiveStep, formData, setFormData, loading, error, success, existingConfig, validationStage, checklist, handleSave, handleDelete } = useByosWizard();

  const renderContent = () => {
    switch (activeStep) {
      case 0: return <ByosStep0 provider={formData.provider} onProviderChange={(p) => setFormData({ ...formData, provider: p, region: p === 'S3' ? 'us-east-1' : 'auto' })} />;
      case 1: return <ByosStep1 />;
      case 2: return <ByosStep2 formData={formData} onFieldChange={(f: string, v: any) => setFormData({ ...formData, [f]: v })} existingConfig={!!existingConfig} />;
      case 3: return <ByosStep3 validationStage={validationStage} checklist={checklist} error={error} success={success} loading={loading} onSave={handleSave} />;
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
