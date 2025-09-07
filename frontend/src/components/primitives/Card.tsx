import React from 'react';
import { cn } from './utils/cn';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  interactive?: boolean; // adds hover/focus elevation
  padded?: boolean;      // toggle internal padding
}

/**
 * Card: minimal surface container. Keep styling lean; compose other primitives inside.
 */
export const Card: React.FC<CardProps> = ({
  className,
  children,
  interactive = false,
  padded = true,
  ...rest
}) => {
  return (
    <div
      className={cn(
        'rounded-md border border-gray-200 bg-white shadow-sm',
        interactive && 'transition-shadow hover:shadow-md focus-within:shadow-md',
        padded && 'p-4',
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
};

Card.displayName = 'Card';