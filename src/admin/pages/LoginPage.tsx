import { useState, type FormEvent } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth';
import { ApiError } from '../api';
import { Btn, ErrorNote, Field, Input } from '../ui';

export default function LoginPage() {
  const { status, login } = useAuth();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (status === 'signed-in') {
    const from = (location.state as { from?: { pathname: string; search: string } } | null)?.from;
    return <Navigate to={from ? `${from.pathname}${from.search}` : '/admin'} replace />;
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await login(email, password);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Something went wrong');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid min-h-screen place-items-center px-4">
      <form onSubmit={onSubmit} className="w-full max-w-sm rounded-3xl border border-ja-line bg-ja-surface p-8">
        <img
          src="https://res.cloudinary.com/dr5v1kpqo/image/upload/v1790683668/jamii_logo_final-digital_po2wdl.jpg"
          alt="Jamii SoTech"
          width={44}
          height={44}
          className="rounded-[14px_14px_14px_4px]"
        />
        <h1 className="mt-5 text-2xl font-bold tracking-tight">Sign in to Jamii Leads</h1>
        <p className="mt-1 text-sm text-ja-muted">Track and follow up on enquiries from the website.</p>

        <div className="mt-6 grid gap-4">
          <Field label="Email">
            <Input type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} required autoFocus />
          </Field>
          <Field label="Password">
            <Input type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </Field>
          {error && <ErrorNote>{error}</ErrorNote>}
          <Btn type="submit" busy={busy} className="mt-1 w-full">Sign in</Btn>
        </div>
        <p className="mt-5 text-xs text-ja-muted">No account? Ask an admin to add you on the Team page.</p>
      </form>
    </div>
  );
}
