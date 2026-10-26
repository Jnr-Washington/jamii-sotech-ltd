const TZ = 'Africa/Nairobi';

const compact = new Intl.NumberFormat('en-KE', { notation: 'compact', maximumFractionDigits: 1 });
const whole = new Intl.NumberFormat('en-KE');

export const formatNumber = (n: number) => whole.format(n);

export const formatKes = (n: number | null | undefined, { short = false } = {}) =>
  n == null ? '—' : `KES ${short && n >= 10_000 ? compact.format(n) : whole.format(n)}`;

export const formatPercent = (ratio: number | null) => (ratio == null ? '—' : `${Math.round(ratio * 100)}%`);

export const formatHours = (h: number | null) => {
  if (h == null) return '—';
  if (h < 1) return `${Math.max(1, Math.round(h * 60))} min`;
  if (h < 48) return `${Math.round(h)} h`;
  return `${Math.round(h / 24)} days`;
};

export const formatDate = (iso: string | null, opts: Intl.DateTimeFormatOptions = {}) =>
  iso ? new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: TZ, ...opts }) : '—';

export const formatDateTime = (iso: string) =>
  new Date(iso).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', timeZone: TZ });

const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

export const timeAgo = (iso: string) => {
  const diff = (new Date(iso).getTime() - Date.now()) / 1000;
  const abs = Math.abs(diff);
  if (abs < 60) return 'just now';
  if (abs < 3600) return rtf.format(Math.round(diff / 60), 'minute');
  if (abs < 86400) return rtf.format(Math.round(diff / 3600), 'hour');
  if (abs < 86400 * 30) return rtf.format(Math.round(diff / 86400), 'day');
  return formatDate(iso);
};

// <input type="date"> works in local dates; follow-ups are stored as 09:00 Nairobi time on that day.
export const toDateInput = (iso: string | null) =>
  iso ? new Date(iso).toLocaleDateString('en-CA', { timeZone: TZ }) : '';
export const fromDateInput = (value: string) => (value ? new Date(`${value}T09:00:00+03:00`).toISOString() : null);

export const isOverdue = (iso: string | null) => !!iso && new Date(iso).getTime() < Date.now();
