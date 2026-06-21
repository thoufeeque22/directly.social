'use client';

import React, { useState, useTransition } from 'react';
import { useSession } from 'next-auth/react';
import { Box, Typography, TextField, Button, FormControl, InputLabel, Select, MenuItem, FormHelperText, Alert, CircularProgress } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlined';
import { submitSupportRequestAction } from '@/app/actions/support';

export const SupportForm: React.FC = () => {
  const { data: session } = useSession();
  const [topic, setTopic] = useState('');
  const [message, setMessage] = useState('');
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic || message.length < 10 || message.length > 1000) return;
    setError(null);
    startTransition(async () => {
      try {
        await submitSupportRequestAction({ topic, message });
        setSuccess(true);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
      }
    });
  };

  if (success) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', py: 4 }}>
        <CheckCircleOutlineIcon color="success" data-testid="CheckCircleOutlineIcon" sx={{ fontSize: 60, mb: 2 }} />
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: 'text.primary' }}>Support Request Received</Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3, maxWidth: 480 }}>
          Thank you for reaching out. We have successfully logged your request and our support team will respond to your registered email address within 24 hours.
        </Typography>
        <Button variant="outlined" color="primary" onClick={() => { setTopic(''); setMessage(''); setError(null); setSuccess(false); }}>
          Submit Another Request
        </Button>
      </Box>
    );
  }

  const isValErr = message.length > 0 && (message.length < 10 || message.length > 1000);

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        Submitting request as: {session?.user?.email || ''}
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <FormControl fullWidth required>
        <InputLabel id="support-topic-label">Topic</InputLabel>
        <Select
          labelId="support-topic-label"
          id="support-topic"
          name="topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          label="Topic"
          disabled={isPending}
          inputProps={{ 'aria-describedby': 'support-topic-helper' }}
        >
          {['General Inquiry', 'Bug Report', 'Feature Request', 'Billing', 'Other'].map((t) => (
            <MenuItem key={t} value={t}>{t}</MenuItem>
          ))}
        </Select>
        <FormHelperText id="support-topic-helper">Select the category that best matches your inquiry</FormHelperText>
      </FormControl>
      <FormControl fullWidth error={isValErr}>
        <TextField
          id="support-message"
          name="message"
          label="Message"
          multiline
          rows={4}
          fullWidth
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={isPending}
          slotProps={{ htmlInput: { 'aria-describedby': 'support-message-helper' } }}
          error={isValErr}
        />
        <FormHelperText id="support-message-helper" sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>{isValErr ? 'Message must be between 10 and 1000 characters' : 'Provide detail on your request (10-1000 characters)'}</span>
          <span>{message.length} / 1000</span>
        </FormHelperText>
      </FormControl>
      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={isPending || !topic || message.length < 10 || message.length > 1000}
        sx={{ alignSelf: 'flex-start' }}
      >
        {isPending ? <CircularProgress size={24} color="inherit" /> : 'Submit Request'}
      </Button>
    </Box>
  );
};
