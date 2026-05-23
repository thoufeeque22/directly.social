import React from 'react';
import { Box, Typography, Stack, FormControlLabel, Switch } from '@mui/material';
import { ByosField } from './ByosField';

export const ByosStep2 = ({ formData, onFieldChange, existingConfig }: any) => (
  <Box sx={{ mt: 3, mb: 2 }}>
    <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4 }}>Enter the bucket parameters and API credentials.</Typography>
    <Stack spacing={3}>
      <ByosField label="Bucket Name *" id="byos-bucket-name" value={formData.bucketName} onChange={(v) => onFieldChange('bucketName', v)} placeholder="my-bucket" />
      {formData.provider === 'R2' && <ByosField label="Endpoint URL *" id="byos-endpoint" value={formData.endpoint} onChange={(v) => onFieldChange('endpoint', v)} placeholder="https://<id>.r2.cloudflarestorage.com" />}
      {formData.provider === 'S3' && (
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
          <ByosField label="Region" id="byos-region" value={formData.region} onChange={(v) => onFieldChange('region', v)} placeholder="us-east-1" />
          <ByosField label="Endpoint Override" id="byos-custom-endpoint" value={formData.endpoint} onChange={(v) => onFieldChange('endpoint', v)} />
        </Box>
      )}
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
        <ByosField label="Access Key ID *" id="byos-access-key-id" value={formData.accessKeyId} onChange={(v) => onFieldChange('accessKeyId', v)} placeholder={existingConfig ? '••••••••' : ''} />
        <ByosField label="Secret Access Key *" id="byos-secret-access-key" value={formData.secretAccessKey} onChange={(v) => onFieldChange('secretAccessKey', v)} placeholder={existingConfig ? '••••••••' : ''} type="password" />
      </Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
        <ByosField label="Path Prefix" id="byos-path-prefix" value={formData.pathPrefix} onChange={(v) => onFieldChange('pathPrefix', v)} placeholder="folder/" />
        <Box sx={{ display: 'flex', alignItems: 'center', pt: 3 }}><FormControlLabel control={<Switch checked={formData.keepFiles} onChange={(e) => onFieldChange('keepFiles', e.target.checked)} color="primary" />} label="Keep assets" /></Box>
      </Box>
    </Stack>
  </Box>
);
