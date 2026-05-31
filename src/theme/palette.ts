import { PaletteMode } from '@mui/material';

export const getPalette = (mode: PaletteMode) => ({
  mode,
  ...(mode === 'light'
    ? {
        primary: {
          main: 'hsl(250, 80%, 60%)',
          contrastText: '#fff',
        },
        background: {
          default: 'hsl(250, 40%, 98%)',
          paper: 'rgba(255, 255, 255, 0.7)',
        },
        text: {
          primary: 'hsl(250, 40%, 10%)',
          secondary: 'hsl(250, 20%, 40%)',
        },
        divider: 'rgba(0, 0, 0, 0.12)',
      }
    : {
        primary: {
          main: 'hsl(250, 80%, 60%)',
          contrastText: 'hsl(250, 10%, 98%)',
        },
        background: {
          default: 'hsl(250, 40%, 5%)',
          paper: 'hsla(250, 30%, 12%, 0.5)',
        },
        text: {
          primary: 'hsl(250, 10%, 95%)',
          secondary: 'hsl(250, 10%, 60%)',
        },
        divider: 'hsla(250, 30%, 25%, 0.2)',
      }),
  error: {
    main: 'hsl(0, 84%, 60%)',
  }
});
