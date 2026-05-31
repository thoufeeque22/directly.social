'use client';

export const ThemeScript = () => (
  <script
    dangerouslySetInnerHTML={{
      __html: `
        (function() {
          try {
            var mode = localStorage.getItem('theme-preference') || 'system';
            var isDark = mode === 'dark' || (mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
            if (isDark) {
              document.documentElement.classList.remove('light-mode');
            } else {
              document.documentElement.classList.add('light-mode');
            }
          } catch (e) {}
        })();
      `,
    }}
  />
);
