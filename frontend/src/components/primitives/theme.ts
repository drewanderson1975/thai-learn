// Central style maps for primitive variants. Extend cautiously.
export const badgeVariants: Record<string, string> = {
  info: 'bg-state-info text-white',
  success: 'bg-state-success text-white',
  warning: 'bg-state-warning text-white',
  danger: 'bg-state-danger text-white',
  neutral: 'bg-brand-muted text-white',
  brand: 'bg-brand-primary text-brand-primaryForeground'
};

export const textVariants: Record<string, string> = {
  default: 'text-gray-900',
  muted: 'text-brand-muted',
  danger: 'text-state-danger',
  success: 'text-state-success',
  warning: 'text-state-warning',
  info: 'text-state-info'
};

export const headingSizes: Record<number, string> = {
  1: 'text-2xl font-semibold',
  2: 'text-xl font-semibold',
  3: 'text-lg font-semibold',
  4: 'text-base font-semibold'
};

export const textSizes: Record<string, string> = {
  xs: 'text-xs',
  sm: 'text-sm',
  base: 'text-base',
  lg: 'text-lg'
};