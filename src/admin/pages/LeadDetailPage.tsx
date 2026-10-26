import { useState, type FormEvent, type ReactNode } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Check, CircleCheck, ExternalLink, Mail, MessageSquare, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ApiError, send } from '../api';
import { useAuth } from '../auth';
import { useApi } from '../useApi';
import { Btn, Card, ErrorNote, Field, Initials, Input, Select, Spinner, StageBadge, inputClass } from '../ui';
import { CTA_LABELS, OPEN_STAGES, STAGES, STAGE_LABELS, type Activity, type Lead, type User } from '../types';
import { formatDate, formatDateTime, fromDateInput, isOverdue, timeAgo, toDateInput } from '../format';

type LeadResponse = { data: Lead; related: Pick<Lead, 'id' | 'name' | 'service' | 'stage' | 'createdAt'>[] };

function describe(a: Activity): ReactNode {
  switch (a.type) {
    case 'created': return 'Submitted the website contact form';
    case 'stage': return <>Moved from <b>{STAGE_LABELS[a.from as keyof typeof STAGE_LABELS] ?? a.from}</b> to <b>{STAGE_LABELS[a.to as keyof typeof STAGE_LABELS] ?? a.to}</b></>;
    case 'assigned': return a.to ? <>Assigned to <b>{a.to}</b></> : <>Unassigned{a.from && <> from <b>{a.from}</b></>}</>;
    default: return a.text;
  }
}

function Timeline({ activity }: { activity: Activity[] }) {
  const items = [...activity].reverse();
  return (
    <ol className="grid gap-4">
      {items.map((a) => (
        <li key={a.id} className="flex gap-3">
          {a.type === 'note' && a.by ? (
            <Initials name={a.by.name} />
          ) : (
            <span className="mt-1.5 ml-3 size-2 shrink-0 rounded-full bg-ja-context" aria-hidden />
          )}
          <div className={cn('min-w-0 flex-1', a.type !== 'note' && 'pl-3')}>
            {a.type === 'note' ? (
              <p className="rounded-2xl rounded-tl-sm bg-ja-tint px-4 py-2.5 text-sm whitespace-pre-wrap">{a.text}</p>
            ) : (
              <p className="text-sm">{describe(a)}</p>
            )}
            <p className="mt-1 text-xs text-ja-muted" title={new Date(a.at).toLocaleString()}>
              {a.by?.name ?? (a.type === 'created' ? 'Website' : 'Someone')} · {formatDateTime(a.at)}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}

function SourceRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-[110px_1fr] gap-3 py-2 text-sm">
      <dt className="text-ja-muted">{label}</dt>
      <dd className="min-w-0 break-words">{children}</dd>
    </div>
  );
}

export default function LeadDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data, setData, error, loading } = useApi<LeadResponse>(`/leads/${id}`);
  const { data: team } = useApi<{ data: User[] }>('/users');

  const [saveState, setSaveState] = useState<{ kind: 'idle' | 'saving' | 'saved' } | { kind: 'error'; message: string }>({ kind: 'idle' });
  const [valueDraft, setValueDraft] = useState('');
  const [lostDraft, setLostDraft] = useState('');
  const [note, setNote] = useState('');
  const [noteBusy, setNoteBusy] = useState(false);
  const [noteError, setNoteError] = useState('');

  const lead = data?.data;
  // Reset the text drafts whenever the saved values change (adjusting state during render,
  // per https://react.dev/learn/you-might-not-need-an-effect)
  const draftSource = lead ? `${lead.id}|${lead.value}|${lead.lostReason}` : null;
  const [draftsFor, setDraftsFor] = useState<string | null>(null);
  if (lead && draftSource !== draftsFor) {
    setDraftsFor(draftSource);
    setValueDraft(lead.value != null ? String(lead.value) : '');
    setLostDraft(lead.lostReason);
  }

  if (error?.status === 404) {
    return (
      <div className="py-16 text-center">
        <p className="font-medium">This lead doesn't exist</p>
        <p className="mt-1 text-sm text-ja-muted">It may have been deleted.</p>
        <Link to="/admin/leads" className="mt-4 inline-block text-sm font-semibold text-ja-red">Back to leads</Link>
      </div>
    );
  }
  if (error) return <ErrorNote>{error.message}</ErrorNote>;
  if (!lead || loading && !data) return <Spinner />;

  const save = async (changes: Partial<Record<'stage' | 'assignedTo' | 'value' | 'followUpAt' | 'lostReason', unknown>>) => {
    setSaveState({ kind: 'saving' });
    try {
      const r = await send<{ data: Lead }>('PATCH', `/leads/${lead.id}`, changes);
      setData((d) => (d ? { ...d, data: r.data } : d));
      setSaveState({ kind: 'saved' });
    } catch (e) {
      setSaveState({ kind: 'error', message: e instanceof ApiError ? [e.message, ...e.errors].join(' ') : 'Could not save' });
    }
  };

  const saveValue = () => {
    const trimmed = valueDraft.replace(/[,\s]/g, '');
    const next = trimmed === '' ? null : Number(trimmed);
    if (next !== null && (!Number.isFinite(next) || next < 0)) {
      setSaveState({ kind: 'error', message: 'Enter the value as a number, e.g. 250000' });
      return;
    }
    if (next !== lead.value) save({ value: next });
  };

  const addNote = async (e: FormEvent) => {
    e.preventDefault();
    if (!note.trim()) return;
    setNoteBusy(true);
    setNoteError('');
    try {
      const r = await send<{ data: Lead }>('POST', `/leads/${lead.id}/notes`, { text: note });
      setData((d) => (d ? { ...d, data: r.data } : d));
      setNote('');
    } catch (err) {
      setNoteError(err instanceof ApiError ? err.message : 'Could not add the note');
    } finally {
      setNoteBusy(false);
    }
  };

  const onDelete = async () => {
    if (!window.confirm(`Delete the lead from ${lead.name}? This can't be undone.`)) return;
    try {
      await send('DELETE', `/leads/${lead.id}`);
      navigate('/admin/leads', { replace: true });
    } catch (e) {
      setSaveState({ kind: 'error', message: e instanceof ApiError ? e.message : 'Could not delete' });
    }
  };

  const overdue = OPEN_STAGES.includes(lead.stage) && isOverdue(lead.followUpAt);
  const mailto = `mailto:${lead.email}?subject=${encodeURIComponent('Re: your enquiry to Jamii SoTech')}`;
  const activeTeam = team?.data.filter((u) => u.active || u.id === lead.assignedTo?.id) ?? [];
  const src = lead.source;

  return (
    <>
      <Link to="/admin/leads" className="mb-4 inline-flex items-center gap-1.5 text-sm text-ja-muted hover:text-ja-ink">
        <ArrowLeft className="size-4" aria-hidden /> All leads
      </Link>

      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight break-words">{lead.name}</h1>
            <StageBadge stage={lead.stage} />
          </div>
          <p className="mt-1 text-sm text-ja-muted">
            {[lead.company, lead.service].filter(Boolean).join(' · ') || 'No company or service given'} · received {timeAgo(lead.createdAt)}
          </p>
        </div>
        <a href={mailto} className="inline-flex h-10 items-center gap-2 rounded-full bg-ja-red px-4 text-sm font-semibold text-ja-on-red hover:bg-ja-red-deep">
          <Mail className="size-4" aria-hidden /> Reply to {lead.email}
        </a>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_340px]">
        <div className="grid content-start gap-4">
          <Card title="Their message">
            <p className="text-[0.95rem] leading-relaxed whitespace-pre-wrap">{lead.message}</p>
          </Card>

          <Card title="Activity" subtitle="Notes from the team and every change to this lead">
            <form onSubmit={addNote} className="mb-6 grid gap-2">
              <label htmlFor="note" className="sr-only">Add a note</label>
              <textarea
                id="note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) addNote(e); }}
                placeholder="Log a call, a meeting, or what was agreed…"
                rows={3}
                className={cn(inputClass, 'h-auto py-2.5')}
              />
              {noteError && <ErrorNote>{noteError}</ErrorNote>}
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs text-ja-muted">Ctrl + Enter to add</span>
                <Btn type="submit" busy={noteBusy} disabled={!note.trim()}>
                  <MessageSquare className="size-4" aria-hidden /> Add note
                </Btn>
              </div>
            </form>
            <Timeline activity={lead.activity ?? []} />
          </Card>
        </div>

        <div className="grid content-start gap-4">
          <Card
            title="Manage"
            action={
              <span className="text-xs text-ja-muted" role="status">
                {saveState.kind === 'saving' && 'Saving…'}
                {saveState.kind === 'saved' && <span className="inline-flex items-center gap-1 text-ja-good"><Check className="size-3.5" aria-hidden /> Saved</span>}
              </span>
            }
          >
            <div className="grid gap-4">
              <Field label="Stage">
                <Select value={lead.stage} onChange={(e) => save({ stage: e.target.value })}>
                  {STAGES.map((s) => <option key={s} value={s}>{STAGE_LABELS[s]}</option>)}
                </Select>
              </Field>

              {lead.stage === 'lost' && (
                <Field label="Why was it lost?">
                  <Input
                    value={lostDraft}
                    onChange={(e) => setLostDraft(e.target.value)}
                    onBlur={() => lostDraft !== lead.lostReason && save({ lostReason: lostDraft })}
                    placeholder="e.g. Budget, went with another vendor"
                  />
                </Field>
              )}

              <Field label="Owner">
                <Select value={lead.assignedTo?.id ?? ''} onChange={(e) => save({ assignedTo: e.target.value || null })}>
                  <option value="">Unassigned</option>
                  {activeTeam.map((u) => <option key={u.id} value={u.id}>{u.name}{u.id === user?.id ? ' (you)' : ''}</option>)}
                </Select>
              </Field>

              <Field label="Estimated value (KES)" hint="Used for pipeline totals on the overview">
                <Input
                  inputMode="numeric"
                  value={valueDraft}
                  onChange={(e) => setValueDraft(e.target.value)}
                  onBlur={saveValue}
                  onKeyDown={(e) => e.key === 'Enter' && (e.target as HTMLInputElement).blur()}
                  placeholder="e.g. 250000"
                />
              </Field>

              <Field
                label="Next follow-up"
                hint={overdue ? <span className="font-semibold text-ja-warn">Overdue since {formatDate(lead.followUpAt)}</span> : undefined}
              >
                <div className="flex gap-2">
                  <Input type="date" value={toDateInput(lead.followUpAt)} onChange={(e) => save({ followUpAt: fromDateInput(e.target.value) })} />
                  {lead.followUpAt && (
                    <Btn variant="ghost" type="button" onClick={() => save({ followUpAt: null })} aria-label="Clear follow-up date">Clear</Btn>
                  )}
                </div>
              </Field>

              {saveState.kind === 'error' && <ErrorNote>{saveState.message}</ErrorNote>}
            </div>
          </Card>

          <Card title="How they found you">
            <dl className="-my-2 divide-y divide-ja-line/60">
              <SourceRow label="Channel">{src.channel}</SourceRow>
              <SourceRow label="Clicked">{CTA_LABELS[src.cta] ?? src.cta}</SourceRow>
              {src.utmCampaign && <SourceRow label="Campaign">{src.utmCampaign}{src.utmMedium && ` (${src.utmMedium})`}</SourceRow>}
              {src.referrer && (
                <SourceRow label="Referrer">
                  <a href={src.referrer} target="_blank" rel="noreferrer noopener" className="inline-flex items-center gap-1 hover:text-ja-red">
                    {src.referrer} <ExternalLink className="size-3" aria-hidden />
                  </a>
                </SourceRow>
              )}
              {src.landingPage && <SourceRow label="Landed on">{src.landingPage}</SourceRow>}
              <SourceRow label="Auto-reply">
                {lead.acknowledgementSent
                  ? <span className="inline-flex items-center gap-1"><CircleCheck className="size-4 text-ja-good" aria-hidden /> Confirmation email sent</span>
                  : <span className="text-ja-muted">Not sent</span>}
              </SourceRow>
            </dl>
          </Card>

          {data!.related.length > 0 && (
            <Card title="Other enquiries from this email">
              <ul className="grid gap-2">
                {data!.related.map((r) => (
                  <li key={r.id}>
                    <Link to={`/admin/leads/${r.id}`} className="flex items-center justify-between gap-3 rounded-xl px-2 py-1.5 text-sm hover:bg-ja-tint">
                      <span className="min-w-0 truncate">{r.service || 'General enquiry'} · {formatDate(r.createdAt)}</span>
                      <StageBadge stage={r.stage} />
                    </Link>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {user?.role === 'admin' && (
            <Btn variant="danger" onClick={onDelete} className="justify-self-start">
              <Trash2 className="size-4" aria-hidden /> Delete lead
            </Btn>
          )}
        </div>
      </div>
    </>
  );
}
