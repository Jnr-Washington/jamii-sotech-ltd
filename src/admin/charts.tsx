import { useLayoutEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { ChartColumn, Table2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDate, formatNumber } from './format';

/*
 * Chart conventions (from the dataviz guidance):
 * - Single series per chart, in the validated brand series colour; context marks in a recessive tone.
 * - Thin marks with a 4px rounded data-end, square at the baseline; hairline solid grid.
 * - Every value is reachable without hover: bars are direct-labelled, and every chart has a table view.
 * - Text uses text tokens, never the series colour.
 */

export function ChartCard({ title, subtitle, table, children, className, dimmed }: {
  title: string; subtitle?: ReactNode; table: ReactNode; children: ReactNode; className?: string; dimmed?: boolean;
}) {
  const [view, setView] = useState<'chart' | 'table'>('chart');
  const toggle = (v: 'chart' | 'table', icon: ReactNode, label: string) => (
    <button
      type="button"
      onClick={() => setView(v)}
      aria-pressed={view === v}
      aria-label={`Show as ${label}`}
      title={`Show as ${label}`}
      className={cn('grid size-8 place-items-center rounded-full text-ja-muted transition hover:text-ja-ink', view === v && 'bg-ja-tint text-ja-ink')}
    >
      {icon}
    </button>
  );

  return (
    <section className={cn('min-w-0 rounded-2xl border border-ja-line bg-ja-surface p-5', className)}>
      <header className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold">{title}</h2>
          {subtitle && <p className="mt-0.5 text-sm text-ja-muted">{subtitle}</p>}
        </div>
        <div className="flex shrink-0 gap-1">
          {toggle('chart', <ChartColumn className="size-4" aria-hidden />, 'chart')}
          {toggle('table', <Table2 className="size-4" aria-hidden />, 'table')}
        </div>
      </header>
      <div className={cn('transition-opacity', dimmed && 'opacity-50')}>{view === 'chart' ? children : table}</div>
    </section>
  );
}

export function DataTable({ columns, rows }: { columns: string[]; rows: (string | number)[][] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-ja-line text-left text-ja-muted">
            {columns.map((c, i) => (
              <th key={c} scope="col" className={cn('py-2 font-medium', i > 0 && 'text-right')}>{c}</th>
            ))}
          </tr>
        </thead>
        <tbody className="tabular-nums">
          {rows.map((r) => (
            <tr key={String(r[0])} className="border-b border-ja-line/60 last:border-0">
              {r.map((cell, i) => (
                <td key={i} className={cn('py-2', i > 0 && 'text-right')}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export interface BarRow {
  key: string;
  label: string;
  value: number;
  /** Extra text after the value, e.g. "2 won" */
  detail?: string;
  /** De-emphasise this bar (context, not the story) */
  muted?: boolean;
}

// Horizontal bars, value at the tip. Sorted by the caller.
export function BarList({ rows, format = formatNumber, empty = 'No data yet' }: {
  rows: BarRow[]; format?: (n: number) => string; empty?: string;
}) {
  const max = Math.max(0, ...rows.map((r) => r.value));
  const total = rows.reduce((s, r) => s + r.value, 0);
  if (!rows.length || max === 0) return <p className="py-6 text-center text-sm text-ja-muted">{empty}</p>;

  return (
    <ul className="grid gap-3">
      {rows.map((r) => {
        const pct = (r.value / max) * 100;
        const share = total ? Math.round((r.value / total) * 100) : 0;
        return (
          <li key={r.key} className="group grid gap-1" title={`${r.label}: ${format(r.value)} (${share}% of total)`}>
            <div className="flex items-baseline justify-between gap-3 text-sm">
              <span className="truncate">{r.label}</span>
              <span className="shrink-0 tabular-nums">
                <span className="font-semibold">{format(r.value)}</span>
                {r.detail && <span className="ml-1.5 text-ja-muted">{r.detail}</span>}
              </span>
            </div>
            <div className="h-3 border-l border-ja-context">
              {r.value > 0 && (
                <div
                  className={cn('h-full rounded-r-[4px] transition-[filter] group-hover:brightness-110', r.muted ? 'bg-ja-context' : 'bg-ja-series')}
                  style={{ width: `max(${pct}%, 4px)` }}
                />
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

const niceStep = (max: number, targetTicks = 4) => {
  if (max <= 0) return 1;
  const raw = max / targetTicks;
  const mag = 10 ** Math.floor(Math.log10(raw));
  const norm = raw / mag;
  return Math.max(1, (norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 5 ? 5 : 10) * mag);
};

// Column path with a rounded top (data end) and a square bottom (baseline).
const columnPath = (x: number, y: number, w: number, h: number) => {
  const r = Math.min(4, w / 2, h);
  return `M${x},${y + h}V${y + r}Q${x},${y} ${x + r},${y}H${x + w - r}Q${x + w},${y} ${x + w},${y + r}V${y + h}Z`;
};

const PLOT_H = 180;
const AXIS_H = 26;
const LEFT = 32;

export function WeeklyColumns({ weeks }: { weeks: { weekStart: string; count: number }[] }) {
  const wrap = useRef<HTMLDivElement>(null);
  // Measured from the container; 0 until the first layout so the SVG never props the layout open
  const [width, setWidth] = useState(0);
  const [active, setActive] = useState<number | null>(null);

  useLayoutEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const n = weeks.length;
  const max = Math.max(0, ...weeks.map((w) => w.count));
  const step = niceStep(max);
  const top = Math.max(step, Math.ceil(max / step) * step);
  const ticks = Array.from({ length: top / step + 1 }, (_, i) => i * step);

  const plotW = Math.max(0, width - LEFT);
  const band = n ? plotW / n : 0;
  const colW = Math.max(2, Math.min(24, band * 0.62, band - 2));
  const y = (v: number) => PLOT_H - (v / top) * PLOT_H;
  const xOf = (i: number) => LEFT + i * band + (band - colW) / 2;

  // Label every k-th week so dates never collide (~56px per label)
  const every = Math.max(1, Math.ceil(56 / Math.max(band, 1)));
  const peak = weeks.reduce((best, w, i) => (w.count > weeks[best].count ? i : best), 0);
  const labelled = new Set([n - 1, max > 0 ? peak : -1]);

  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') setActive((a) => Math.min(n - 1, (a ?? -1) + 1));
    else if (e.key === 'ArrowLeft') setActive((a) => Math.max(0, (a ?? n) - 1));
    else if (e.key === 'Escape') setActive(null);
    else return;
    e.preventDefault();
  };

  const tip = active != null ? weeks[active] : null;
  const tipLeft = active != null ? Math.min(Math.max(xOf(active) + colW / 2, 70), width - 70) : 0;

  return (
    <div ref={wrap} className="relative w-full min-w-0" style={{ height: PLOT_H + AXIS_H }}>
      {width > 0 && <svg
        width={width}
        height={PLOT_H + AXIS_H}
        role="img"
        aria-label={`Leads per week. Use the arrow keys to read each week.`}
        tabIndex={0}
        onKeyDown={onKey}
        onBlur={() => setActive(null)}
        onPointerLeave={() => setActive(null)}
        className="block overflow-visible outline-none focus-visible:ring-3 focus-visible:ring-ja-red/30 rounded-md"
      >
        {ticks.map((t) => (
          <g key={t}>
            <line x1={LEFT} x2={width} y1={y(t)} y2={y(t)} stroke="var(--ja-grid)" strokeWidth={1} shapeRendering="crispEdges" />
            <text x={LEFT - 8} y={y(t)} dy="0.32em" textAnchor="end" className="fill-ja-muted text-[11px] tabular-nums">{formatNumber(t)}</text>
          </g>
        ))}
        <line x1={LEFT} x2={width} y1={PLOT_H} y2={PLOT_H} stroke="var(--ja-context)" strokeWidth={1} shapeRendering="crispEdges" />

        {weeks.map((w, i) => {
          const h = PLOT_H - y(w.count);
          return (
            <g key={w.weekStart}>
              {h > 0 && (
                <path
                  d={columnPath(xOf(i), y(w.count), colW, h)}
                  fill="var(--ja-series)"
                  style={{ filter: active === i ? 'brightness(1.12)' : undefined }}
                />
              )}
              {labelled.has(i) && w.count > 0 && (
                <text x={xOf(i) + colW / 2} y={y(w.count) - 6} textAnchor="middle" className="fill-ja-ink text-[11px] font-semibold tabular-nums">
                  {w.count}
                </text>
              )}
              {(n - 1 - i) % every === 0 && (
                <text x={LEFT + i * band + band / 2} y={PLOT_H + 17} textAnchor="middle" className="fill-ja-muted text-[11px]">
                  {formatDate(w.weekStart, { year: undefined })}
                </text>
              )}
              {/* Hit target: the whole band, taller than the mark */}
              <rect
                x={LEFT + i * band}
                y={0}
                width={band}
                height={PLOT_H}
                fill="transparent"
                onPointerEnter={() => setActive(i)}
                onPointerDown={() => setActive(i)}
              />
            </g>
          );
        })}
      </svg>}

      {tip && (
        <div
          role="status"
          className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-xl border border-ja-line bg-ja-surface px-3 py-2 text-sm whitespace-nowrap shadow-lg"
          style={{ left: tipLeft, top: Math.max(0, y(tip.count) - 10) }}
        >
          <div className="text-base font-semibold tabular-nums">{tip.count} {tip.count === 1 ? 'lead' : 'leads'}</div>
          <div className="text-ja-muted">Week of {formatDate(tip.weekStart)}</div>
        </div>
      )}
    </div>
  );
}

export function StatTile({ label, value, detail, tone }: {
  label: string; value: ReactNode; detail?: ReactNode; tone?: 'default' | 'hero';
}) {
  return (
    <div className="rounded-2xl border border-ja-line bg-ja-surface p-5">
      <p className="text-sm text-ja-muted">{label}</p>
      <p className={cn('mt-1 font-bold tracking-tight', tone === 'hero' ? 'text-5xl' : 'text-3xl')}>{value}</p>
      {detail && <p className="mt-1 text-sm text-ja-muted">{detail}</p>}
    </div>
  );
}
