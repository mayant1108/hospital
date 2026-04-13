import { cn } from '../utils';

const Input = ({ className, type, ...props }) => {
  return (
    <input
      type={type}
      className={cn(
        'flex h-10 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-50 transition-colors',
        className
      )}
      {...props}
    />
  );
};

export default Input;

