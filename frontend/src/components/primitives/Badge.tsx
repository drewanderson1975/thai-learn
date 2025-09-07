import React from 'react';
import { cn } from './utils/cn';
import { badgeVariants } from './theme';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: keyof typeof badgeVariants;
  soft?: boolean; // translucent version
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
}

function computeSoftClasses(base: string) {
  // Example base: 'bg-state-success text-white'
  const parts = base.split(' ');
  const bg = parts.find(p => p.startsWith('bg-'));
  const text = parts.find(p => p.startsWith('text-'));
  let newBg = bg || '';
  if (newBg && !newBg.includes('/')) {
    newBg = `${newBg}/15`;
  }
  let newText = text || '';
  if (newText === 'text-white' && bg) {
    newText = bg.replace('bg-', 'text-').split('/')[0];
  }
  return [newBg, newText].filter(Boolean).join(' ');
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'info',
  soft = false,
  className,
  children,
  leadingIcon,
  trailingIcon,
  ...rest
}) => {
  const base = badgeVariants[variant] || badgeVariants.info;
  const style = soft ? computeSoftClasses(base) : base;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium select-none',
        style,
        className
      )}
      {...rest}
    >
      {leadingIcon && (
        <span className="inline-flex h-3.5 w-3.5 items-center justify-center">
          {leadingIcon}
        </span>
      )}
      {children}
      {trailingIcon && (
        <span className="inline-flex h-3.5 w-3.5 items-center justify-center">
          {trailingIcon}
        </span>
      )}
    </span>
  );
};

Badge.displayName = 'Badge';