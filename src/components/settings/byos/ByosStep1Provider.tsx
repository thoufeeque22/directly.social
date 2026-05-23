import React from 'react';
import { Box, Typography } from '@mui/material';
import StorageIcon from '@mui/icons-material/Storage';
import CloudQueueIcon from '@mui/icons-material/CloudQueue';
import { ProviderOption } from './ProviderOption';

interface Props {
  provider: 'S3' | 'R2';
  onProviderChange: (provider: 'S3' | 'R2') => void;
}

export const ByosStep1Provider = ({ provider, onProviderChange }: Props) => (
  <Box sx={{ mt: 3, mb: 2 }}>
    <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4 }}>
      Select your storage provider. Both Amazon Web Services S3 and Cloudflare R2 are supported.
    </Typography>
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
      <ProviderOption active={provider === 'S3'} onClick={() => onProviderChange('S3')} icon={<CloudQueueIcon sx={{ fontSize: 40, color: provider === 'S3' ? 'primary.main' : 'text.secondary' }} />} title="AWS S3 Compatible" description="Use Amazon Web Services S3 or any fully S3-compliant standard API storage buckets." />
      <ProviderOption active={provider === 'R2'} onClick={() => onProviderChange('R2')} icon={<StorageIcon sx={{ fontSize: 40, color: provider === 'R2' ? 'primary.main' : 'text.secondary' }} />} title="Cloudflare R2" description="Enjoy zero-egress cost Cloudflare R2 bucket. Perfect for direct uploader streaming." />
    </Box>
  </Box>
);
