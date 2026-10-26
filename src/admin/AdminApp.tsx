import { useEffect, useState } from 'react';
import { Navigate, NavLink, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import { Inbox, LayoutDashboard, LogOut, Menu, Users, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AuthProvider, useAuth } from './auth';
import { Initials, Spinner } from './ui';
import LoginPage from './pages/LoginPage';
import OverviewPage from './pages/OverviewPage';
import LeadsPage from './pages/LeadsPage';
import LeadDetailPage from './pages/LeadDetailPage';
import TeamPage from './pages/TeamPage';

const LOGO = 'https://res.cloudinary.com/dr5v1kpqo/image/upload/v1790683668/jamii_logo_final-digital_po2wdl.jpg';

const nav = [
  { to: '/admin', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/admin/leads', label: 'Leads', icon: Inbox, end: false },
  { to: '/admin/team', label: 'Team', icon: Users, end: false },
];

function RequireAuth() {
  const { status } = useAuth();
  const location = useLocation();
  if (status === 'loading') return <Spinner />;
  if (status === 'signed-out') return <Navigate to="/admin/login" replace state={{ from: location }} />;
  return <Layout />;
}

function Layout() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="min-h-screen md:grid md:grid-cols-[232px_1fr]">
      {/* The column carries the background; the inner panel sticks while the page scrolls */}
      <aside className="border-b border-ja-line bg-ja-surface md:border-r md:border-b-0">
        <div className="md:sticky md:top-0 md:flex md:h-screen md:flex-col">
          <div className="flex h-16 items-center justify-between px-5">
            <NavLink to="/admin" onClick={closeMenu} className="flex items-center gap-2.5 font-bold">
              <img src={LOGO} alt="" width={30} height={30} className="rounded-[10px_10px_10px_3px]" />
              Jamii Leads
            </NavLink>
            <button
              className="grid size-9 place-items-center rounded-full md:hidden"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>

          <div className={cn('flex-1 flex-col px-3 pb-4 md:flex', menuOpen ? 'flex' : 'hidden')}>
            <nav className="grid gap-1">
              {nav.map(({ to, label, icon: Icon, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ja-muted transition hover:bg-ja-tint hover:text-ja-ink',
                      isActive && 'bg-ja-tint text-ja-ink',
                    )
                  }
                >
                  <Icon className="size-4" aria-hidden /> {label}
                </NavLink>
              ))}
            </nav>

            <div className="mt-6 flex items-center gap-3 border-t border-ja-line px-2 pt-4 md:mt-auto">
              <Initials name={user!.name} />
              <div className="min-w-0 flex-1 text-sm">
                <div className="truncate font-medium">{user!.name}</div>
                <div className="truncate text-xs text-ja-muted">{user!.role === 'admin' ? 'Admin' : 'Team member'}</div>
              </div>
              <button onClick={logout} className="grid size-8 place-items-center rounded-full text-ja-muted hover:bg-ja-tint hover:text-ja-ink" aria-label="Sign out" title="Sign out">
                <LogOut className="size-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      <main className="min-w-0 px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
        <div className="mx-auto max-w-6xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default function AdminApp() {
  useEffect(() => {
    const previous = document.title;
    document.title = 'Jamii Leads';
    return () => { document.title = previous; };
  }, []);

  return (
    <div className="jamii-admin min-h-screen font-sans antialiased">
      <AuthProvider>
        <Routes>
          <Route path="login" element={<LoginPage />} />
          <Route element={<RequireAuth />}>
            <Route index element={<OverviewPage />} />
            <Route path="leads" element={<LeadsPage />} />
            <Route path="leads/:id" element={<LeadDetailPage />} />
            <Route path="team" element={<TeamPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </AuthProvider>
    </div>
  );
}
