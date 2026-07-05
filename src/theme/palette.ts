import { PaletteMode } from '@mui/material';

export const getPalette = (mode: PaletteMode) => ({
  mode,
  ...(mode === 'light'
    ? {
        primary: {
          main: 'hsl(20, 80%, 60%)', // Warm terracotta
          contrastText: '#fff',
        },
        background: {
          default: 'hsl(35, 30%, 98%)', // Warm off-white/cream
          paper: 'rgba(255, 255, 255, 0.8)',
        },
        text: {
          primary: 'hsl(20, 40%, 10%)',
          secondary: 'hsl(20, 20%, 40%)',
        },
        divider: 'rgba(0, 0, 0, 0.12)',
      }
    : {
        primary: {
          main: 'hsl(20, 80%, 60%)', // Warm terracotta
          contrastText: 'hsl(20, 10%, 98%)',
        },
        background: {
          default: 'hsl(20, 20%, 6%)', // Warm dark earthy tone
          paper: 'hsla(20, 20%, 12%, 0.6)',
        },
        text: {
          primary: 'hsl(20, 10%, 95%)',
          secondary: 'hsl(20, 10%, 60%)',
        },
        divider: 'hsla(20, 30%, 25%, 0.2)',
      }),
  error: {
    main: 'hsl(0, 84%, 60%)',
  }
});
