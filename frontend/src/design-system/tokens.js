/**
 * Design System Tokens
 * 
 * Centralized design tokens following PROJECT_GUIDELINES.md
 * These tokens are used by UI components to ensure consistency
 */

export const colors = {
  primary: '#1E40AF',      // Deep Royal Blue
  secondary: '#DC2626',    // Bright Red (from guidelines, not the teal in CSS)
  accent: '#FACC15',       // Golden Yellow
  neutral: '#334155',      // Slate Gray
  white: '#FFFFFF',
  
  // Semantic colors for status badges
  success: '#10B981',      // Emerald
  warning: '#F59E0B',      // Amber
  error: '#EF4444',        // Red
  info: '#3B82F6',         // Blue
};

export const spacing = {
  xs: '0.25rem',    // 4px
  sm: '0.5rem',     // 8px
  md: '0.75rem',    // 12px
  lg: '1rem',       // 16px
  xl: '1.5rem',     // 24px
  '2xl': '2rem',    // 32px
  '3xl': '3rem',    // 48px
};

export const borderRadius = {
  sm: '0.375rem',   // 6px
  md: '0.5rem',     // 8px
  lg: '0.75rem',    // 12px
  xl: '1rem',       // 16px
  '2xl': '1rem',    // 16px (following guidelines)
  full: '9999px',
};

export const fontSize = {
  xs: '0.75rem',    // 12px
  sm: '0.875rem',   // 14px
  base: '1rem',     // 16px
  lg: '1.125rem',   // 18px
  xl: '1.25rem',    // 20px
  '2xl': '1.5rem',  // 24px
  '3xl': '1.875rem', // 30px
  '4xl': '2.25rem', // 36px
  '5xl': '3rem',    // 48px
};

export const fontWeight = {
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
};

export const fontFamily = {
  heading: '"Inter", "Poppins", sans-serif',
  body: '"Roboto", "Noto Sans", sans-serif',
  thai: '"Sarabun", sans-serif',
};