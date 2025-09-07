/**
 * Button Component
 * 
 * Reusable button component following design system tokens
 * Supports different variants, sizes, and states
 */

const buttonVariants = {
  primary: "bg-primary text-white hover:bg-blue-700 focus-visible:ring-primary/50",
  secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200 focus-visible:ring-gray-500/50", 
  accent: "bg-accent text-black hover:bg-yellow-500 focus-visible:ring-accent/50",
  outline: "border border-primary text-primary hover:bg-primary hover:text-white focus-visible:ring-primary/50",
  ghost: "text-primary hover:bg-primary/10 focus-visible:ring-primary/50",
  danger: "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500/50",
};

const buttonSizes = {
  sm: "px-2 py-1 text-xs",
  md: "px-3 py-1.5 text-sm", 
  lg: "px-4 py-2 text-base",
  xl: "px-6 py-3 text-lg",
};

export default function Button({ 
  children,
  variant = "primary",
  size = "md", 
  disabled = false,
  className = "",
  type = "button",
  ...props 
}) {
  const variantClasses = buttonVariants[variant] || buttonVariants.primary;
  const sizeClasses = buttonSizes[size] || buttonSizes.md;
  
  const baseClasses = `
    inline-flex items-center justify-center gap-2 font-semibold
    rounded-md transition-colors cursor-pointer
    focus-visible:outline focus-visible:outline-2 focus-visible:ring-0
    disabled:opacity-50 disabled:cursor-not-allowed
  `.replace(/\s+/g, ' ').trim();
  
  return (
    <button
      type={type}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}