import React from 'react';
import { cn } from './utils/cn';
import { headingSizes, textVariants, textSizes } from './theme';

// Heading
export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3 | 4; // maps to h1-h4
  align?: 'left' | 'center' | 'right';
  as?: React.ElementType; // override element if needed
}

export const Heading: React.FC<HeadingProps> = ({
  level = 2,
  align = 'left',
  className,
  children,
  as,
  ...rest
}) => {
  const Tag = (as || (`h${level}` as const)) as React.ElementType;
  return (
    <Tag
      className={cn(
        'tracking-tight',
        headingSizes[level],
        align === 'center' && 'text-center',
        align === 'right' && 'text-right',
        className
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
};

Heading.displayName = 'Heading';

// Text
export interface TextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  variant?: keyof typeof textVariants;
  size?: keyof typeof textSizes;
  muted?: boolean; // overrides variant to 'muted'
  asSpan?: boolean; // render span instead of p
  as?: React.ElementType; // explicit override
}

export const Text: React.FC<TextProps> = ({
  variant = 'default',
  size = 'base',
  muted = false,
  asSpan = false,
  as,
  className,
  children,
  ...rest
}) => {
  const chosenVariant = muted ? 'muted' : variant;
  const Comp: React.ElementType = as || (asSpan ? 'span' : 'p');
  return (
    <Comp
      className={cn(
        'leading-relaxed',
        textVariants[chosenVariant],
        textSizes[size],
        className
      )}
      {...rest}
    >
      {children}
    </Comp>
  );
};

Text.displayName = 'Text';