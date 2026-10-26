import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from 'react';
import { LoaderCircle, TriangleAlert } from 'lucide-react';
import { cn } from '@/lib/utils';
import { STAGE_LABELS, type Stage } from './types';

export const inputClass =
  'h-10 w-full rounded-xl border border-ja-line bg-ja-bg px-3 text-sm text-ja-ink placeholder:text-ja-muted/70 outline-none transition focus:border-ja-red focus:ring-3 focus:ring-ja-tint disabled:opacity-60';

export function Card({ title, subtitle, action, className, children }: {
  title?: ReactNode; subtitle?: ReactNode; action?: ReactNode; className?: string; children: ReactNode;
}) {
  return (
    <section className={cn('rounded-2xl border border-ja-line bg-ja-surface p-5', className)}>
      {(title || action) && (
        <header className="mb-4 flex items-start justify-between gap-3">
          <div>
            {title && <h2 className="text-base font-semibold">{title}</h2>}
            {subtitle && <p className="mt-0.5 text-sm text-ja-muted">{subtitle}</p>}
          </div>
          {action}
        </header>
      )}
      {children}
    </section>
  );
}

type ButtonVariant = 'primary' | 'ghost' | 'danger';
export function Btn({ variant = 'primary', busy, className, children, ...props }:
  ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant; busy?: boolean }) {
  return (
    <button
      className={cn(
        'inline-flex h-10 items-center justify-center gap-2 rounded-full px-4 text-sm font-semibold transition outline-none focus-visible:ring-3 focus-visible:ring-ja-red/40 disabled:cursor-not-allowed disabled:opacity-60',
        variant === 'primary' && 'bg-ja-red text-ja-on-red hover:bg-ja-red-deep dark:hover:opacity-90',
        variant === 'ghost' && 'border border-ja-line bg-transparent text-ja-ink hover:border-ja-red',
        variant === 'danger' && 'border border-ja-line bg-transparent text-ja-red hover:bg-ja-tint',
        className,
      )}
      disabled={busy || props.disabled}
      {...props}
    >
      {busy && <LoaderCircle className="size-4 animate-spin" aria-hidden />}
      {children}
    </button>
  );
}

export function Field({ label, hint, children }: { label: string; hint?: ReactNode; children: ReactNode }) {
  return (
    <label className="grid gap-1.5 text-sm font-medium">
      {label}
      {children}
      {hint && <span className="text-xs font-normal text-ja-muted">{hint}</span>}
    </label>
  );
}

export const Input = ({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) => (
  <input className={cn(inputClass, className)} {...props} />
);

export const Select = ({ className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) => (
  <select className={cn(inputClass, 'pr-8', className)} {...props}>{children}</select>
);

// Stage colour is decoration only: the label always carries the meaning.
const stageTone: Record<Stage, string> = {
  new: 'bg-ja-red text-ja-on-red',
  contacted: 'bg-ja-tint text-ja-ink',
  qualified: 'bg-ja-tint text-ja-ink',
  proposal: 'bg-ja-tint text-ja-ink',
  won: 'bg-ja-good/15 text-ja-good',
  lost: 'bg-ja-line text-ja-muted',
};

export function StageBadge({ stage }: { stage: Stage }) {
  return (
    <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap', stageTone[stage])}>
      {STAGE_LABELS[stage]}
    </span>
  );
}

export function ErrorNote({ children }: { children: ReactNode }) {
  return (
    <p role="alert" className="flex items-start gap-2 rounded-xl bg-ja-tint px-3 py-2.5 text-sm">
      <TriangleAlert className="mt-0.5 size-4 shrink-0 text-ja-red" aria-hidden />
      <span>{children}</span>
    </p>
  );
}

export function Spinner({ label = 'Loading' }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-2 py-16 text-sm text-ja-muted" role="status">
      <LoaderCircle className="size-4 animate-spin" aria-hidden /> {label}…
    </div>
  );
}

export function PageHeader({ title, subtitle, action }: { title: ReactNode; subtitle?: ReactNode; action?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-ja-muted">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function Initials({ name, className }: { name: string; className?: string }) {
  const initials = name.split(/\s+/).map((p) => p[0]).slice(0, 2).join('').toUpperCase();
  return (
    <span aria-hidden className={cn('inline-grid size-8 shrink-0 place-items-center rounded-full bg-ja-tint text-xs font-bold text-ja-red', className)}>
      {initials}
    </span>
  );
}
