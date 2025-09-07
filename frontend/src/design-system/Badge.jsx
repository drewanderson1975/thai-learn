/**
 * Badge Component
 * 
 * Reusable badge component following design system tokens
 * Used for status indicators, lesson types, consonant classes, etc.
 */

const badgeVariants = {
  // Status badges
  outstanding: "bg-amber-100 text-amber-700",
  inProgress: "bg-blue-100 text-blue-700", 
  complete: "bg-emerald-100 text-emerald-700",
  
  // Consonant class badges
  high: "bg-rose-100 text-rose-700",
  mid: "bg-blue-100 text-blue-700",
  low: "bg-emerald-100 text-emerald-700",
  
  // Lesson type badges
  core: "bg-primary text-white",
  practice: "bg-secondary text-white",
  phrasebook: "bg-accent text-black",
  
  // Generic variants
  primary: "bg-primary text-white",
  secondary: "bg-gray-100 text-gray-800",
  accent: "bg-accent text-black",
  success: "bg-emerald-100 text-emerald-700",
  warning: "bg-amber-100 text-amber-700",
  error: "bg-red-100 text-red-700",
  info: "bg-blue-100 text-blue-700",
};

const badgeSizes = {
  sm: "text-xs px-2 py-0.5",
  md: "text-sm px-2.5 py-1",
  lg: "text-base px-3 py-1.5",
};

export default function Badge({ 
  children, 
  variant = "secondary", 
  size = "sm",
  className = "",
  title,
  ...props 
}) {
  const variantClasses = badgeVariants[variant] || badgeVariants.secondary;
  const sizeClasses = badgeSizes[size] || badgeSizes.sm;
  
  return (
    <span
      className={`inline-flex items-center gap-1 font-semibold rounded-full ${variantClasses} ${sizeClasses} ${className}`}
      title={title}
      {...props}
    >
      {children}
    </span>
  );
}