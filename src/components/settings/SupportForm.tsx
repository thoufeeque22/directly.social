'use client';
import React, { useState, useActionState } from 'react';
import { useSession } from 'next-auth/react';
import { Box, Typography, TextField, Button, FormControl, InputLabel, Select, MenuItem, FormHelperText, Alert, CircularProgress } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlined';
import { submitSupportRequestAction, ActionState } from '@/app/actions/support';
import { SUPPORT_TOPICS, MIN_MESSAGE_LENGTH, MAX_MESSAGE_LENGTH } from '@/lib/schemas/support';

interface SupportFormProps {
  onSuccess?: (id: string) => void;
  onError?: (error: string) => void;
}

export const SupportForm: React.FC<SupportFormProps> = ({ onSuccess, onError }) => {
  const { data: session } = useSession();
  const [topic, setTopic] = useState('');
  const [message, setMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [state, formAction, isPending] = useActionState(
    async (prevState: ActionState | null, formData: FormData): Promise<ActionState> => {
      const formTopic = formData.get('topic') as string;
      const formMessage = formData.get('message') as string;
      if (!formTopic || formMessage.length < MIN_MESSAGE_LENGTH || formMessage.length > MAX_MESSAGE_LENGTH) {
        const err = 'Invalid validation constraints.';
        onError?.(err);
        return { success: false, error: err };
      }
      const res = await submitSupportRequestAction({ topic: formTopic, message: formMessage });
      if (res.success) {
        setShowSuccess(true);
        onSuccess?.(res.id || '');
      } else {
        onError?.(res.error || '');
      }
      return res;
    },
    null
  );
  if (showSuccess) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', py: 4 }}>
        <CheckCircleOutlineIcon color="success" data-testid="CheckCircleOutlineIcon" sx={{ fontSize: 60, mb: 2 }} />
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>Support Request Received</Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3, maxWidth: 480 }}>
          Thank you for reaching out. We have successfully logged your request and our support team will respond to your registered email address within 24 hours.
        </Typography>
        <Button variant="outlined" onClick={() => { setTopic(''); setMessage(''); setShowSuccess(false); }}>
          Submit Another Request
        </Button>
      </Box>
    );
  }
  const hasValidationError = message.length > 0 && (message.length < MIN_MESSAGE_LENGTH || message.length > MAX_MESSAGE_LENGTH);
  return (
    <Box component="form" action={formAction} noValidate sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        Submitting request as: {session?.user?.email || ''}
      </Typography>
      {state?.error && <Alert severity="error">{state.error}</Alert>}
      <FormControl fullWidth required>
        <InputLabel id="support-topic-label">Topic</InputLabel>
        <Select
          labelId="support-topic-label" id="support-topic" name="topic" value={topic}
          onChange={(e) => setTopic(e.target.value)} label="Topic" disabled={isPending}
          inputProps={{ 'aria-describedby': 'support-topic-helper' }}
        >
          {Object.entries(SUPPORT_TOPICS).map(([key, label]) => (
            <MenuItem key={key} value={key}>{label}</MenuItem>
          ))}
        </Select>
        <FormHelperText id="support-topic-helper">Select the category that best matches your inquiry</FormHelperText>
      </FormControl>
      <FormControl fullWidth error={hasValidationError}>
        <TextField
          id="support-message" name="message" label="Message" multiline rows={4} fullWidth
          value={message} onChange={(e) => setMessage(e.target.value)} disabled={isPending}
          slotProps={{ htmlInput: { 'aria-describedby': 'support-message-helper' } }} error={hasValidationError}
        />
        <FormHelperText id="support-message-helper" sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>{hasValidationError ? `Message must be between ${MIN_MESSAGE_LENGTH} and ${MAX_MESSAGE_LENGTH} characters` : `Provide detail on your request (${MIN_MESSAGE_LENGTH}-${MAX_MESSAGE_LENGTH} characters)`}</span>
          <span>{message.length} / {MAX_MESSAGE_LENGTH}</span>
        </FormHelperText>
      </FormControl>
      <Button
        type="submit" variant="contained" color="primary" sx={{ alignSelf: 'flex-start' }}
        disabled={isPending || !topic || message.length < MIN_MESSAGE_LENGTH || message.length > MAX_MESSAGE_LENGTH}
      >
        {isPending ? <CircularProgress size={24} color="inherit" /> : 'Submit Request'}
      </Button>
    </Box>
  );
};

