import { Loader2, Search } from 'lucide-react';
import { cn } from '../utils';

export const MetricCard = ({
  title,
  value,
  detail,
  icon: Icon,
  tone = 'blue',
}) => {
  const tones = {
    teal: 'bg-blue-100 text-blue-600',
    blue: 'bg-blue-100 text-blue-600',
    amber: 'bg-amber-50 text-amber-700',
    rose: 'bg-rose-50 text-rose-700',
    green: 'bg-emerald-100 text-emerald-600',
    slate: 'bg-slate-100 text-slate-700',
  };

  return (
    <article className="rounded-lg bg-white p-7 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
      <div className="flex items-center gap-5">
        {Icon ? (
          <span
            className={cn(
              'flex h-14 w-14 shrink-0 items-center justify-center rounded-lg',
              tones[tone]
            )}
          >
            <Icon className="h-7 w-7" aria-hidden="true" />
          </span>
        ) : null}
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-slate-400">
            {title}
          </p>
          <p className="mt-1 text-3xl font-extrabold text-[#111827]">{value}</p>
          {detail ? (
            <p className="mt-1 text-sm font-semibold text-slate-400">{detail}</p>
          ) : null}
        </div>
      </div>
    </article>
  );
};

export const StatusBadge = ({ status }) => {
  const normalized = (status || 'unknown').toLowerCase();
  const styles = {
    confirmed: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
    completed: 'bg-blue-50 text-blue-700 ring-blue-100',
    paid: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
    pending: 'bg-amber-50 text-amber-700 ring-amber-100',
    failed: 'bg-rose-50 text-rose-700 ring-rose-100',
    cancelled: 'bg-rose-50 text-rose-700 ring-rose-100',
    refunded: 'bg-slate-100 text-slate-700 ring-slate-200',
    unknown: 'bg-slate-100 text-slate-700 ring-slate-200',
  };

  return (
    <span
      className={cn(
        'inline-flex rounded-lg px-2.5 py-1 text-xs font-bold capitalize ring-1',
        styles[normalized] || styles.unknown
      )}
    >
      {normalized}
    </span>
  );
};

export const SearchToolbar = ({
  value,
  onChange,
  placeholder,
  count,
  right,
}) => (
  <div className="mb-7 flex flex-col gap-3 rounded-lg bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.08)] lg:flex-row lg:items-center lg:justify-between">
    <div className="relative min-w-0 flex-1">
      <Search
        className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
        aria-hidden="true"
      />
      <input
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 w-full rounded-lg border-0 bg-white pl-10 pr-4 text-base font-bold text-slate-700 outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-blue-100"
      />
    </div>
    <div className="flex items-center justify-between gap-3">
      <span className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-extrabold text-slate-500">
        {count} records
      </span>
      {right}
    </div>
  </div>
);

export const LoadingState = ({ label = 'Loading records...' }) => (
  <div className="flex min-h-64 flex-col items-center justify-center rounded-lg bg-white p-10 text-center">
    <Loader2 className="mb-3 h-8 w-8 animate-spin text-blue-600" />
    <p className="text-sm font-semibold text-slate-600">{label}</p>
  </div>
);

export const EmptyState = ({ title, description }) => (
  <div className="flex min-h-64 flex-col items-center justify-center rounded-lg bg-white p-10 text-center">
    <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
      <Search className="h-6 w-6" aria-hidden="true" />
    </div>
    <h3 className="mt-4 text-lg font-bold text-slate-950">{title}</h3>
    {description ? (
      <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
        {description}
      </p>
    ) : null}
  </div>
);

export const TableShell = ({ children }) => (
  <div className="overflow-hidden rounded-lg bg-white shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
    {children}
  </div>
);
