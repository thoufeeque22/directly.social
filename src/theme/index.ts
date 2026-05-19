import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: 'hsl(250, 80%, 60%)', // var(--primary)
      contrastText: 'hsl(250, 10%, 98%)',
    },
    background: {
      default: 'hsl(250, 40%, 5%)', // var(--background)
      paper: 'hsla(250, 30%, 12%, 0.5)', // .glass-card background
    },
    text: {
      primary: 'hsl(250, 10%, 95%)', // var(--foreground)
      secondary: 'hsl(250, 10%, 60%)', // var(--muted-foreground)
    },
    divider: 'hsla(250, 30%, 25%, 0.2)', // .glass-card border
    error: {
      main: 'hsl(0, 84%, 60%)', // var(--destructive)
    }
  },
  typography: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none', // Remove MUI elevation gradient
          backdropFilter: 'blur(8px)',
          borderRadius: '0.75rem',
          border: '1px solid hsla(250, 30%, 25%, 0.2)',
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
