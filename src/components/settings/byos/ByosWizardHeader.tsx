import { Box, Stack, Typography } from '@mui/material';
import StorageIcon from '@mui/icons-material/Storage';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface Props {
  existingConfig: { provider: string; bucketName: string; region: string } | null;
}

export const ByosWizardHeader = ({ existingConfig }: Props) => (
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
    )}
  </Stack>
);
