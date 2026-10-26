import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { CalendarClock, ChevronLeft, ChevronRight, Download, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ApiError, download } from '../api';
import { useApi } from '../useApi';
import { Btn, ErrorNote, Input, PageHeader, Select, Spinner, StageBadge } from '../ui';
import { OPEN_STAGES, SERVICE_OPTIONS, STAGES, STAGE_LABELS, type Lead, type Pagination, type User } from '../types';
import { formatDate, formatKes, isOverdue, timeAgo } from '../format';

const OPEN = OPEN_STAGES.join(',');

const TABS: { value: string; label: string }[] = [
  { value: OPEN, label: 'Open' },
  ...STAGES.map((s) => ({ value: s, label: STAGE_LABELS[s] })),
  { value: 'all', label: 'All' },
];

// Filters that are passed straight through to the API
const FILTER_KEYS = ['service', 'assignedTo', 'followUp', 'q', 'sort'] as const;

export default function LeadsPage() {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const stage = params.get('stage') ?? OPEN;
  const page = Number(params.get('page')) || 1;

  const apiQuery = useMemo(() => {
    const q = new URLSearchParams();
    if (stage !== 'all') q.set('stage', stage);
    for (const k of FILTER_KEYS) {
      const v = params.get(k);
      if (v) q.set(k, v);
    }
    return q;
  }, [params, stage]);

  const listQuery = new URLSearchParams(apiQuery);
  listQuery.set('page', String(page));
  const { data, error, loading } = useApi<{ data: Lead[]; pagination: Pagination }>(`/leads?${listQuery}`);
  const { data: team } = useApi<{ data: User[] }>('/users');

  const update = (changes: Record<string, string | null>) => {
    const next = new URLSearchParams(params);
    for (const [k, v] of Object.entries(changes)) {
      if (v) next.set(k, v);
      else next.delete(k);
    }
    if (!('page' in changes)) next.delete('page');
    setParams(next);
  };

  // Debounced search box
  const [search, setSearch] = useState(params.get('q') ?? '');
  useEffect(() => {
    const t = setTimeout(() => {
      if (search !== (params.get('q') ?? '')) update({ q: search.trim() || null });
    }, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState('');
  const onExport = async () => {
    setExporting(true);
    setExportError('');
    try {
      await download(`/leads/export?${apiQuery}`, 'jamii-leads.csv');
    } catch (e) {
      setExportError(e instanceof ApiError ? e.message : 'Export failed');
    } finally {
      setExporting(false);
    }
  };

  const leads = data?.data ?? [];
  const pg = data?.pagination;
  const hasFilters = FILTER_KEYS.some((k) => k !== 'sort' && params.get(k));

  return (
    <>
      <PageHeader
        title="Leads"
        subtitle={pg ? `${pg.total} ${pg.total === 1 ? 'lead' : 'leads'}` : ' '}
        action={<Btn variant="ghost" onClick={onExport} busy={exporting}><Download className="size-4" aria-hidden /> Export CSV</Btn>}
      />

      <div className="mb-4 -mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        <div className="flex w-max gap-1 rounded-full border border-ja-line bg-ja-surface p-1" role="tablist" aria-label="Stage">
          {TABS.map((t) => (
            <button
              key={t.value}
              role="tab"
              aria-selected={stage === t.value}
              onClick={() => update({ stage: t.value === OPEN ? null : t.value })}
              className={cn(
                'h-8 rounded-full px-3.5 text-sm font-medium whitespace-nowrap transition',
                stage === t.value ? 'bg-ja-red text-ja-on-red' : 'text-ja-muted hover:text-ja-ink',
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-[1fr_auto_auto_auto_auto]">
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ja-muted" aria-hidden />
          <Input
            type="search"
            placeholder="Search name, email or company"
            aria-label="Search leads"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select aria-label="Service" value={params.get('service') ?? ''} onChange={(e) => update({ service: e.target.value })}>
          <option value="">All services</option>
          {SERVICE_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
        </Select>
        <Select aria-label="Owner" value={params.get('assignedTo') ?? ''} onChange={(e) => update({ assignedTo: e.target.value })}>
          <option value="">Any owner</option>
          <option value="me">Assigned to me</option>
          <option value="unassigned">Unassigned</option>
          {team?.data.filter((u) => u.active).map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
        </Select>
        <Select aria-label="Follow-up" value={params.get('followUp') ?? ''} onChange={(e) => update({ followUp: e.target.value })}>
          <option value="">Any follow-up</option>
          <option value="overdue">Overdue follow-ups</option>
          <option value="upcoming">Upcoming follow-ups</option>
        </Select>
        <Select
          aria-label="Sort"
          value={params.get('sort') ?? 'newest'}
          onChange={(e) => update({ sort: e.target.value === 'newest' ? null : e.target.value })}
          disabled={!!params.get('followUp')}
          title={params.get('followUp') ? 'Follow-up lists are sorted soonest first' : undefined}
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="value">Highest value</option>
        </Select>
      </div>

      {(error || exportError) && <div className="mb-4"><ErrorNote>{error?.message ?? exportError}</ErrorNote></div>}
      {!data && loading && <Spinner />}

      {data && (
        <div className={cn('overflow-hidden rounded-2xl border border-ja-line bg-ja-surface transition-opacity', loading && 'opacity-50')}>
          {leads.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <p className="font-medium">No leads match</p>
              <p className="mt-1 text-sm text-ja-muted">
                {hasFilters || stage !== OPEN ? 'Try a different stage or clear the filters.' : 'New enquiries from the website will appear here.'}
              </p>
              {hasFilters && (
                <Btn variant="ghost" className="mt-4" onClick={() => { setSearch(''); setParams(stage === OPEN ? {} : { stage }); }}>
                  Clear filters
                </Btn>
              )}
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-ja-line text-left whitespace-nowrap text-ja-muted">
                  <th scope="col" className="px-4 py-3 font-medium">Lead</th>
                  <th scope="col" className="px-4 py-3 font-medium">Stage</th>
                  <th scope="col" className="hidden px-4 py-3 font-medium md:table-cell">Service</th>
                  <th scope="col" className="hidden px-4 py-3 font-medium lg:table-cell">Owner</th>
                  <th scope="col" className="hidden px-4 py-3 text-right font-medium lg:table-cell">Value</th>
                  <th scope="col" className="hidden px-4 py-3 font-medium md:table-cell">Follow-up</th>
                  <th scope="col" className="hidden px-4 py-3 text-right font-medium sm:table-cell">Received</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((l) => {
                  const overdue = OPEN_STAGES.includes(l.stage) && isOverdue(l.followUpAt);
                  return (
                    <tr
                      key={l.id}
                      onClick={(e) => { if (!(e.target as HTMLElement).closest('a')) navigate(`/admin/leads/${l.id}`); }}
                      className="cursor-pointer border-b border-ja-line/60 transition last:border-0 hover:bg-ja-tint/50"
                    >
                      <td className="w-full max-w-0 px-4 py-3">
                        <Link to={`/admin/leads/${l.id}`} className="block truncate font-semibold hover:text-ja-red">
                          {l.name}
                        </Link>
                        <div className="truncate text-ja-muted">{[l.company, l.email].filter(Boolean).join(' · ')}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap"><StageBadge stage={l.stage} /></td>
                      <td className="hidden px-4 py-3 whitespace-nowrap text-ja-muted md:table-cell">{l.service || '—'}</td>
                      <td className="hidden px-4 py-3 whitespace-nowrap lg:table-cell">{l.assignedTo?.name ?? <span className="text-ja-muted">Unassigned</span>}</td>
                      <td className="hidden px-4 py-3 text-right whitespace-nowrap tabular-nums lg:table-cell">{l.value != null ? formatKes(l.value, { short: true }) : <span className="text-ja-muted">—</span>}</td>
                      <td className="hidden px-4 py-3 md:table-cell">
                        {l.followUpAt ? (
                          <span className={cn('inline-flex items-center gap-1.5 whitespace-nowrap', overdue && 'font-semibold text-ja-warn')}>
                            {overdue && <CalendarClock className="size-4" aria-hidden />}
                            {formatDate(l.followUpAt, { year: undefined })}
                            {overdue && <span className="sr-only"> (overdue)</span>}
                          </span>
                        ) : (
                          <span className="text-ja-muted">—</span>
                        )}
                      </td>
                      <td className="hidden px-4 py-3 text-right whitespace-nowrap text-ja-muted sm:table-cell" title={new Date(l.createdAt).toLocaleString()}>
                        {timeAgo(l.createdAt)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}

      {pg && pg.pages > 1 && (
        <nav className="mt-4 flex items-center justify-between text-sm" aria-label="Pagination">
          <span className="text-ja-muted">Page {pg.page} of {pg.pages}</span>
          <div className="flex gap-2">
            <Btn variant="ghost" disabled={pg.page <= 1} onClick={() => update({ page: String(pg.page - 1) })}>
              <ChevronLeft className="size-4" aria-hidden /> Previous
            </Btn>
            <Btn variant="ghost" disabled={pg.page >= pg.pages} onClick={() => update({ page: String(pg.page + 1) })}>
              Next <ChevronRight className="size-4" aria-hidden />
            </Btn>
          </div>
        </nav>
      )}
    </>
  );
}
