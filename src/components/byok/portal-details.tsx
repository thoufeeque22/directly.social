import YouTubeIcon from '@mui/icons-material/YouTube';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';

export const getPortalDetails = (platform: string) => {
  switch (platform.toLowerCase()) {
    case 'youtube':
      return {
        url: 'https://console.cloud.google.com/',
        icon: <YouTubeIcon sx={{ color: '#FF0000' }} />,
        instruction: 'Create a project in Google Cloud Console and enable the YouTube Data API v3.'
      };
    case 'facebook':
      return {
        url: 'https://developers.facebook.com/',
        icon: <FacebookIcon sx={{ color: '#1877F2' }} />,
        instruction: 'Create a Meta App and configure the Graph API with appropriate permissions.'
      };
    case 'instagram':
      return {
        url: 'https://developers.facebook.com/',
        icon: <InstagramIcon sx={{ color: '#E4405F' }} />,
        instruction: 'Enable Instagram Graph API in your Meta Developer App settings.'
      };
    default:
      return {
        url: '#',
        icon: null,
        instruction: `Generate credentials in the ${platform} developer portal.`
      };
  }
};
