import { Link, useSearchParams } from 'react-router-dom';
import { CalendarClock, Check, ChevronRight, Clock, UserX } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { useApi } from '../useApi';
import { BarList, ChartCard, DataTable, StatTile, WeeklyColumns } from '../charts';
import { Card, ErrorNote, PageHeader, Spinner } from '../ui';
import { CTA_LABELS, OPEN_STAGES, STAGE_LABELS, type Stats } from '../types';
import { formatDate, formatHours, formatKes, formatNumber, formatPercent } from '../format';

const RANGES = [
  { days: 30, label: 'Last 30 days' },
  { days: 90, label: 'Last 90 days' },
  { days: 180, label: 'Last 6 months' },
  { days: 365, label: 'Last 12 months' },
];

function AttentionRow({ icon, label, count, to }: { icon: ReactNode; label: string; count: number; to: string }) {
  const clear = count === 0;
  return (
    <li>
      <Link to={to} className="flex items-center gap-3 rounded-xl px-2 py-2.5 transition hover:bg-ja-tint">
        <span className={cn('grid size-8 shrink-0 place-items-center rounded-full', clear ? 'bg-ja-good/12 text-ja-good' : 'bg-ja-warn/15 text-ja-warn')}>
          {clear ? <Check className="size-4" aria-label="All clear" /> : icon}
        </span>
        <span className="flex-1 text-sm">{label}</span>
        <span className="text-lg font-semibold tabular-nums">{count}</span>
        <ChevronRight className="size-4 text-ja-muted" aria-hidden />
      </Link>
    </li>
  );
}

export default function OverviewPage() {
  const [params, setParams] = useSearchParams();
  const days = Number(params.get('days')) || 90;
  const { data, error, loading } = useApi<{ data: Stats }>(`/leads/stats?days=${days}`);
  const s = data?.data;
  const rangeLabel = RANGES.find((r) => r.days === days)?.label.toLowerCase() ?? `last ${days} days`;

  return (
    <>
      <PageHeader title="Overview" subtitle="How the website is turning visitors into clients." />

      {/* One filter row, scoping everything below it */}
      <div className="mb-6 flex flex-wrap gap-2" role="group" aria-label="Date range">
        {RANGES.map((r) => (
          <button
            key={r.days}
            onClick={() => setParams(r.days === 90 ? {} : { days: String(r.days) })}
            aria-pressed={days === r.days}
            className={cn(
              'h-9 rounded-full border px-4 text-sm font-medium transition',
              days === r.days ? 'border-ja-ink bg-ja-ink text-ja-bg' : 'border-ja-line bg-ja-surface text-ja-muted hover:text-ja-ink',
            )}
          >
            {r.label}
          </button>
        ))}
      </div>

      {error && <ErrorNote>{error.message}</ErrorNote>}
      {!s && loading && <Spinner />}

      {s && (
        <div className={cn('grid gap-4 transition-opacity', loading && 'opacity-50')}>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatTile
              tone="hero"
              label={`Leads, ${rangeLabel}`}
              value={formatNumber(s.totals.leads)}
              detail={`${s.totals.newThisWeek} in the last 7 days`}
            />
            <StatTile
              label="Open pipeline"
              value={formatNumber(s.totals.open)}
              detail={s.totals.openValue ? `${formatKes(s.totals.openValue, { short: true })} estimated` : 'No deal values yet'}
            />
            <StatTile
              label="Win rate"
              value={formatPercent(s.totals.winRate)}
              detail={s.totals.won + s.totals.lost ? `${s.totals.won} won · ${s.totals.lost} lost${s.totals.wonValue ? ` · ${formatKes(s.totals.wonValue, { short: true })}` : ''}` : 'No closed leads yet'}
            />
            <StatTile
              label="Median first response"
              value={formatHours(s.response.medianHours)}
              detail={s.response.count ? `${formatPercent(s.response.within24hRate)} answered within 24 h` : 'No responses logged yet'}
            />
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <ChartCard
              className="lg:col-span-2"
              title="New leads per week"
              subtitle={`Contact form submissions, ${rangeLabel}`}
              table={<DataTable columns={['Week of', 'Leads']} rows={s.weekly.map((w) => [formatDate(w.weekStart), w.count])} />}
            >
              <WeeklyColumns weeks={s.weekly} />
            </ChartCard>

            <Card title="Needs attention" subtitle="Right now, across all leads">
              <ul className="-mx-2 grid gap-1">
                <AttentionRow
                  icon={<Clock className="size-4" aria-hidden />}
                  label="Waiting over 24 h for a first reply"
                  count={s.totals.awaitingResponse}
                  to="/admin/leads?stage=new&sort=oldest"
                />
                <AttentionRow
                  icon={<CalendarClock className="size-4" aria-hidden />}
                  label="Overdue follow-ups"
                  count={s.totals.overdueFollowUps}
                  to="/admin/leads?followUp=overdue"
                />
                <AttentionRow
                  icon={<UserX className="size-4" aria-hidden />}
                  label="Open leads with no owner"
                  count={s.totals.unassignedOpen}
                  to={`/admin/leads?assignedTo=unassigned&stage=${OPEN_STAGES.join(',')}`}
                />
              </ul>
            </Card>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <ChartCard
              title="Pipeline"
              subtitle="Where every lead stands today"
              table={
                <DataTable
                  columns={['Stage', 'Leads', 'Est. value']}
                  rows={s.stages.map((x) => [STAGE_LABELS[x.stage], x.count, x.value ? formatKes(x.value) : '—'])}
                />
              }
            >
              <BarList
                rows={s.stages.map((x) => ({
                  key: x.stage,
                  label: STAGE_LABELS[x.stage],
                  value: x.count,
                  detail: x.value ? formatKes(x.value, { short: true }) : undefined,
                  muted: x.stage === 'lost',
                }))}
              />
            </ChartCard>

            <ChartCard
              title="Where leads come from"
              subtitle={`UTM source or referring site, ${rangeLabel}`}
              table={<DataTable columns={['Channel', 'Leads', 'Won']} rows={s.byChannel.map((x) => [x.channel, x.count, x.won])} />}
            >
              <BarList
                rows={s.byChannel.map((x) => ({ key: x.channel, label: x.channel, value: x.count, detail: x.won ? `${x.won} won` : undefined }))}
                empty="No leads in this period"
              />
            </ChartCard>

            <ChartCard
              title="Which button they clicked"
              subtitle="The call to action that brought them to the form"
              table={<DataTable columns={['Call to action', 'Leads']} rows={s.byCta.map((x) => [CTA_LABELS[x.cta] ?? x.cta, x.count])} />}
            >
              <BarList rows={s.byCta.map((x) => ({ key: x.cta, label: CTA_LABELS[x.cta] ?? x.cta, value: x.count }))} empty="No leads in this period" />
            </ChartCard>

            <ChartCard
              title="Services requested"
              subtitle={rangeLabel[0].toUpperCase() + rangeLabel.slice(1)}
              table={<DataTable columns={['Service', 'Leads']} rows={s.byService.map((x) => [x.service, x.count])} />}
            >
              <BarList
                rows={s.byService.map((x) => ({ key: x.service, label: x.service, value: x.count, muted: x.service === 'Not specified' }))}
                empty="No leads in this period"
              />
            </ChartCard>
          </div>
        </div>
      )}
    </>
  );
}
