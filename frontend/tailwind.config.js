/** @type {import('tailwindcss').Config} */
// Tailwind base configuration establishing semantic design tokens for emerging UI primitives.
// Keep this minimal; extend only what primitives (Card, Badge, Typography, etc.) will rely upon.
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#2563eb',
          primaryForeground: '#ffffff',
          accent: '#f59e0b',
          muted: '#64748b',
          surface: '#f8fafc'
        },
        state: {
          success: '#16a34a',
          warning: '#d97706',
          danger: '#dc2626',
          info: '#0ea5e9'
        }
      },
      borderRadius: {
        sm: '4px',
        DEFAULT: '6px',
        md: '8px',
        lg: '12px'
      },
      boxShadow: {
        card: '0 1px 3px 0 rgb(0 0 0 / 0.08), 0 1px 2px -1px rgb(0 0 0 / 0.06)'
      },
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1rem' }],
        sm: ['0.875rem', { lineHeight: '1.25rem' }],
        base: ['1rem', { lineHeight: '1.5rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }]
      }
    }
  },
  plugins: []
};
