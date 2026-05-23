import { Step, StepLabel, Stepper } from '@mui/material';

export const STEPS = ['Select Provider', 'Configure CORS', 'Enter Credentials', 'Test & Save'];

interface Props {
  activeStep: number;
}

export const ByosWizardStepper = ({ activeStep }: Props) => (
  <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
    {STEPS.map((label) => (
      <Step key={label}>
        <StepLabel>{label}</StepLabel>
      </Step>
    ))}
  </Stepper>
);
