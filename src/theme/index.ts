import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: 'hsl(30, 50%, 60%)', // var(--primary)
      contrastText: 'hsl(30, 10%, 98%)',
    },
    background: {
      default: 'hsl(40, 20%, 96%)', // var(--background)
      paper: 'hsla(35, 30%, 95%, 0.7)', // .glass-card background
    },
    text: {
      primary: 'hsl(30, 30%, 15%)', // var(--foreground)
      secondary: 'hsl(30, 20%, 40%)', // var(--muted-foreground)
    },
    divider: 'hsla(30, 20%, 70%, 0.3)', // .glass-card border
    error: {
      main: 'hsl(0, 60%, 50%)', // var(--destructive)
    }
  },
  typography: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backdropFilter: 'blur(4px)',
          borderRadius: '1.25rem',
          border: '1px solid hsla(30, 20%, 70%, 0.3)',
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '1.25rem',
        }
      }
    }
  }
});
