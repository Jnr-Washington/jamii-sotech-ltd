import { useState, type FormEvent } from 'react';
import { KeyRound, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ApiError, send } from '../api';
import { useAuth } from '../auth';
import { useApi } from '../useApi';
import { Btn, Card, ErrorNote, Field, Initials, Input, PageHeader, Select, Spinner } from '../ui';
import type { User } from '../types';
import { timeAgo } from '../format';

const message = (e: unknown) => (e instanceof ApiError ? [e.message, ...e.errors].join(' ') : 'Something went wrong');

function AddMember({ onAdded }: { onAdded: () => void }) {
  const empty = { name: '', email: '', password: '', role: 'member' };
  const [form, setForm] = useState(empty);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const set = (k: keyof typeof empty) => (e: { target: { value: string } }) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await send('POST', '/users', form);
      setForm(empty);
      onAdded();
    } catch (err) {
      setError(message(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card title="Add a team member" subtitle="Share the password with them directly. They can change it after signing in.">
      <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
        <Field label="Name"><Input value={form.name} onChange={set('name')} required minLength={2} /></Field>
        <Field label="Email"><Input type="email" value={form.email} onChange={set('email')} required /></Field>
        <Field label="Temporary password" hint="At least 10 characters">
          <Input type="text" value={form.password} onChange={set('password')} required minLength={10} autoComplete="new-password" />
        </Field>
        <Field label="Role" hint="Admins can manage the team and delete leads">
          <Select value={form.role} onChange={set('role')}>
            <option value="member">Team member</option>
            <option value="admin">Admin</option>
          </Select>
        </Field>
        {error && <div className="sm:col-span-2"><ErrorNote>{error}</ErrorNote></div>}
        <div className="sm:col-span-2">
          <Btn type="submit" busy={busy}><Plus className="size-4" aria-hidden /> Add member</Btn>
        </div>
      </form>
    </Card>
  );
}

function ChangePassword() {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<{ ok: boolean; text: string } | null>(null);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setStatus(null);
    try {
      await send('POST', '/auth/password', { currentPassword: current, newPassword: next });
      setCurrent('');
      setNext('');
      setStatus({ ok: true, text: 'Password updated.' });
    } catch (err) {
      setStatus({ ok: false, text: message(err) });
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card title="Your password">
      <form onSubmit={onSubmit} className="grid gap-4">
        <Field label="Current password">
          <Input type="password" value={current} onChange={(e) => setCurrent(e.target.value)} autoComplete="current-password" required />
        </Field>
        <Field label="New password" hint="At least 10 characters">
          <Input type="password" value={next} onChange={(e) => setNext(e.target.value)} autoComplete="new-password" minLength={10} required />
        </Field>
        {status && (status.ok ? <p role="status" className="text-sm text-ja-good">{status.text}</p> : <ErrorNote>{status.text}</ErrorNote>)}
        <Btn type="submit" variant="ghost" busy={busy} className="justify-self-start">
          <KeyRound className="size-4" aria-hidden /> Change password
        </Btn>
      </form>
    </Card>
  );
}

export default function TeamPage() {
  const { user: me } = useAuth();
  const { data, error, loading, reload } = useApi<{ data: User[] }>('/users');
  const [rowError, setRowError] = useState('');
  const isAdmin = me?.role === 'admin';

  const update = async (u: User, changes: Partial<User> & { password?: string }) => {
    setRowError('');
    try {
      await send('PATCH', `/users/${u.id}`, changes);
      reload();
    } catch (e) {
      setRowError(message(e));
    }
  };

  const resetPassword = (u: User) => {
    const password = window.prompt(`New password for ${u.name} (at least 10 characters):`);
    if (password) update(u, { password });
  };

  return (
    <>
      <PageHeader title="Team" subtitle="Everyone who can sign in to the leads dashboard." />

      <div className="grid gap-4 lg:grid-cols-[1fr_340px]">
        <div className="grid content-start gap-4">
          <Card>
            {error && <ErrorNote>{error.message}</ErrorNote>}
            {!data && loading && <Spinner />}
            {rowError && <div className="mb-3"><ErrorNote>{rowError}</ErrorNote></div>}
            <ul className="divide-y divide-ja-line/60">
              {data?.data.map((u) => {
                const self = u.id === me?.id;
                return (
                  <li key={u.id} className={cn('flex flex-wrap items-center gap-3 py-3', !u.active && 'opacity-60')}>
                    <Initials name={u.name} />
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-medium">{u.name}{self && <span className="text-ja-muted"> (you)</span>}</div>
                      <div className="truncate text-sm text-ja-muted">
                        {u.email} · {u.active ? (u.lastLoginAt ? `last signed in ${timeAgo(u.lastLoginAt)}` : 'never signed in') : 'deactivated'}
                      </div>
                    </div>
                    {isAdmin && !self ? (
                      <div className="flex flex-wrap items-center gap-2">
                        <Select
                          aria-label={`Role for ${u.name}`}
                          value={u.role}
                          onChange={(e) => update(u, { role: e.target.value as User['role'] })}
                          className="h-9 w-auto"
                        >
                          <option value="member">Team member</option>
                          <option value="admin">Admin</option>
                        </Select>
                        <Btn variant="ghost" className="h-9" onClick={() => resetPassword(u)}>Reset password</Btn>
                        <Btn variant={u.active ? 'danger' : 'ghost'} className="h-9" onClick={() => update(u, { active: !u.active })}>
                          {u.active ? 'Deactivate' : 'Reactivate'}
                        </Btn>
                      </div>
                    ) : (
                      <span className="rounded-full bg-ja-tint px-2.5 py-0.5 text-xs font-semibold">{u.role === 'admin' ? 'Admin' : 'Team member'}</span>
                    )}
                  </li>
                );
              })}
            </ul>
          </Card>
          {isAdmin && <AddMember onAdded={reload} />}
        </div>
        <div className="grid content-start gap-4">
          <ChangePassword />
        </div>
      </div>
    </>
  );
}
