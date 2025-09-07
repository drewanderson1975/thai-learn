/**
 * Card Component
 * 
 * Reusable card component following design system tokens
 * Base component for various content containers
 */

const cardVariants = {
  default: "bg-white border border-gray-200",
  elevated: "bg-white shadow-sm border border-gray-200",
  outlined: "bg-white border-2 border-gray-300",
  ghost: "bg-transparent",
};

const cardSizes = {
  sm: "p-3",
  md: "p-4", 
  lg: "p-5",
  xl: "p-6",
};

export default function Card({ 
  children,
  variant = "default",
  size = "md",
  className = "",
  ...props 
}) {
  const variantClasses = cardVariants[variant] || cardVariants.default;
  const sizeClasses = cardSizes[size] || cardSizes.md;
  
  const baseClasses = "rounded-2xl";
  
  return (
    <div
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

// Additional card layout components for common patterns
export function CardHeader({ children, className = "", ...props }) {
  return (
    <div className={`mb-3 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardContent({ children, className = "", ...props }) {
  return (
    <div className={`${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className = "", ...props }) {
  return (
    <div className={`mt-3 ${className}`} {...props}>
      {children}
    </div>
  );
}