import { cn } from '../utils';

const Button = ({ children, className, variant = 'default', size = 'md', ...props }) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-lg font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
  
  const variants = {
    default: 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800',
    destructive: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800',
    outline: 'border border-gray-300 bg-white hover:bg-gray-50 text-gray-900',
    ghost: 'hover:bg-gray-100 text-gray-700',
  };

  const sizes = {
    sm: 'h-9 px-3 text-sm',
    md: 'h-10 py-2 px-4 text-sm',
    lg: 'h-11 px-8 text-base',
  };

  return (
    <button
      className={cn(baseClasses, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
};

export { Button };
export default Button;

