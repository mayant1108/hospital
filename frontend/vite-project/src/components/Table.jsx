import { cn } from '../utils';

const Table = ({ className, ...props }) => (
  <div className="w-full overflow-auto scrollbar-thin">
    <table
      className={cn("w-full caption-bottom text-sm", className)}
      {...props}
    />
  </div>
);

Table.Header = ({ ...props }) => (
  <thead className="bg-white">
    {props.children}
  </thead>
);

Table.Row = ({ className, ...props }) => (
  <tr
    className={cn(
      "m-0 border-b border-slate-100 transition-colors hover:bg-slate-50/70",
      className
    )}
    {...props}
  />
);

Table.Head = ({ className, ...props }) => (
  <th
    className={cn(
      "m-0 border-b border-slate-100 px-8 py-6 text-left text-xs font-extrabold uppercase tracking-[0.18em] text-slate-400",
      className
    )}
    {...props}
  />
);

Table.Body = ({ className, ...props }) => (
  <tbody
    className={cn("divide-y divide-slate-100 bg-white data-[state=loading]:animate-pulse", className)}
    {...props}
  />
);

Table.Cell = ({ className, ...props }) => (
  <td
    className={cn("px-8 py-6 text-base font-semibold text-slate-700", className)}
    {...props}
  />
);

export default Table;

