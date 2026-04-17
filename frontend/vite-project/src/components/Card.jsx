import { cn } from '../utils';

const Card = ({ className, children, ...props }) => {
  return (
    <div
      className={cn(
        "rounded-lg border border-slate-200 bg-white text-slate-950 shadow-sm",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

Card.Content = ({ className, ...props }) => (
  <div className={cn("p-6 pt-0", className)} {...props} />
);

Card.Header = ({ className, ...props }) => (
  <div className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
);

Card.Title = ({ className, ...props }) => (
  <h3
    className={cn("font-bold text-xl text-slate-950 leading-none tracking-tight", className)}
    {...props}
  />
);

Card.Description = ({ className, ...props }) => (
  <p className={cn("text-sm text-slate-600 mt-2", className)} {...props} />
);

export default Card;
