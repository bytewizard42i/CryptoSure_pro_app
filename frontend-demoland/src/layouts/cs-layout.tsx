import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  Shield, LayoutDashboard, FileText, AlertCircle, GraduationCap,
  Coins, UserPlus, LogOut, Bot,
} from 'lucide-react';
import { useAuth, useMode } from '../providers/context';
import { DemoModeBanner } from '../components/DemoModeBanner';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/onboarding', label: 'Onboarding', icon: UserPlus },
  { to: '/policies', label: 'Policies', icon: FileText },
  { to: '/claims', label: 'Claims', icon: AlertCircle },
  { to: '/edu', label: 'EDU Certification', icon: GraduationCap },
  { to: '/pool', label: 'Premium Pool', icon: Coins },
  { to: '/ai-assistant', label: 'AI Assistant', icon: Bot },
];

export function CSLayout() {
  const { session, logout } = useAuth();
  const mode = useMode();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="cs-product-shell dark min-h-screen bg-slate-950">
      <DemoModeBanner />
      <div className="cs-product-frame flex">
        {/* Sidebar */}
        <aside className="cs-sidebar w-64 shrink-0 border-r border-slate-800 bg-slate-950/90 min-h-[calc(100vh-40px)]">
          <div className="flex items-center gap-2 px-4 py-4 border-b border-slate-200 dark:border-slate-800">
            <Shield className="h-6 w-6 text-violet-600" />
            <span className="font-bold text-lg text-slate-900 dark:text-white">CryptoSure</span>
            {mode === 'demoland' && (
              <span className="ml-auto text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-medium">
                DEMO
              </span>
            )}
          </div>

          <nav className="flex flex-col gap-1 p-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-violet-100 text-violet-900 dark:bg-violet-900/30 dark:text-violet-300'
                        : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
                    }`
                  }
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>

          {/* User info */}
          <div className="mt-auto p-3 border-t border-slate-200 dark:border-slate-800">
            {session && (
              <div className="flex items-center gap-2 mb-2">
                <img
                  src={session.avatarUrl}
                  alt={session.displayName}
                  className="h-8 w-8 rounded-full"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                    {session.displayName}
                  </p>
                  <p className="text-xs text-slate-500 truncate">{session.email}</p>
                </div>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 w-full rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className="cs-main flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
