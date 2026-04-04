const { createGlobPatternsForDependencies } = require('@nx/angular/tailwind');
const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  important: true,
  content: [
    join(__dirname, 'src/**/!(*.stories|*.spec).{ts,html}'),
    ...createGlobPatternsForDependencies(__dirname),
    '!**/e2e/**',
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--mat-sys-primary)',
        'on-primary': 'var(--mat-sys-on-primary)',
        secondary: 'var(--mat-sys-secondary)',
        tertiary: 'var(--mat-sys-tertiary)',
        error: 'var(--mat-sys-error)',
        'on-error': 'var(--mat-sys-on-error)',
        surface: 'var(--mat-sys-surface)',
        'surface-variant': 'var(--mat-sys-surface-variant)',
        'on-surface': 'var(--mat-sys-on-surface)',
      },
    },
  },
  plugins: [],
};
