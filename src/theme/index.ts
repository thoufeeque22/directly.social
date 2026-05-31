import { createTheme } from '@mui/material/styles';
import { getPalette } from './palette';

export const getTheme = (mode: 'light' | 'dark') => createTheme({
  palette: getPalette(mode),
  typography: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backdropFilter: 'blur(8px)',
          borderRadius: '0.75rem',
          border: mode === 'light' 
            ? '1px solid rgba(0, 0, 0, 0.12)' 
            : '1px solid hsla(250, 30%, 25%, 0.2)',
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '0.75rem',
        }
      }
    }
  }
});

export const theme = getTheme('dark');
