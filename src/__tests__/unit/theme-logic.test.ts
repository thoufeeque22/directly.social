import { describe, it, expect } from 'vitest';
import { getPalette } from '../../theme/palette';
import { getTheme } from '../../theme/index';

describe('Theme Logic', () => {
  describe('getPalette', () => {
    it('returns correct palette for light mode', () => {
      const palette = getPalette('light');
      expect(palette.mode).toBe('light');
      expect(palette.background?.default).toBe('hsl(250, 40%, 98%)');
      expect(palette.text?.primary).toBe('hsl(250, 40%, 10%)');
    });

    it('returns correct palette for dark mode', () => {
      const palette = getPalette('dark');
      expect(palette.mode).toBe('dark');
      expect(palette.background?.default).toBe('hsl(250, 40%, 5%)');
      expect(palette.text?.primary).toBe('hsl(250, 10%, 95%)');
    });
  });

  describe('getTheme', () => {
    it('creates a theme with correct mode', () => {
      const lightTheme = getTheme('light');
      expect(lightTheme.palette.mode).toBe('light');
      
      const darkTheme = getTheme('dark');
      expect(darkTheme.palette.mode).toBe('dark');
    });

    it('applies correct border based on mode', () => {
      const lightTheme = getTheme('light');
      expect(lightTheme.components?.MuiPaper?.styleOverrides?.root)
        .toMatchObject({ border: '1px solid rgba(0, 0, 0, 0.12)' });

      const darkTheme = getTheme('dark');
      expect(darkTheme.components?.MuiPaper?.styleOverrides?.root)
        .toMatchObject({ border: '1px solid hsla(250, 30%, 25%, 0.2)' });
    });
  });
});
