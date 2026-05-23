import React from 'react';
import { Box, Typography, TextField } from '@mui/material';

interface Props {
  label: string; id: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string;
}

export const ByosField = ({ label, id, value, onChange, placeholder, type }: Props) => (
  <Box>
    <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', mb: 1 }}>{label}</Typography>
    <TextField id={id} fullWidth value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} size="small" type={type} />
  </Box>
);
