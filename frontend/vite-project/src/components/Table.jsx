import { cn } from '../utils';

const Table = ({ className, ...props }) => (
  <div className="w-full overflow-auto">
    <table
      className={cn("w-full caption-bottom text-sm", className)}
      {...props}
    />
  </div>
);

Table.Header = ({ className, ...props }) => (
  <thead>
    {props.children}
  </thead>
);

Table.Row = ({ className, ...props }) => (
  <tr
    className={cn(
      "m-0 border-t border-border transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
      className
    )}
    {...props}
  />
);

Table.Head = ({ className, ...props }) => (
  <th
    className={cn(
      "m-0 border-b border-border p-4 text-left font-medium",
      className
    )}
    {...props}
  />
);

Table.Body = ({ className, ...props }) => (
  <tbody
    className={cn("data-[state=loading]:animate-pulse", className)}
    {...props}
  />
);

Table.Cell = ({ className, ...props }) => (
  <td
    className={cn("border-b border-border p-4", className)}
    {...props}
  />
);

export default Table;

