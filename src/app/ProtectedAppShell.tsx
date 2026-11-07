import { useMemo } from 'react';
import { Outlet } from 'react-router';
import { AppShell } from '../shared/components/layout';
import type { NavItemType } from '../shared/types/navigation';
import { useAuth } from './providers/useAuth';
import { RequireAuth } from './providers';
import {
  Widget2,
  Pen2,
  UsersGroupRounded,
  Box,
} from '../shared/components/icons';

export default function ProtectedAppShell() {
  const { user, permissions, logout } = useAuth();

  const navItems: NavItemType[] = useMemo(() => {
    const items: NavItemType[] = [
      {
        path: '/',
        label: 'Project Workspace',
        icon: <Widget2 className="h-4 w-4" />,
      },
      {
        path: '/generator',
        label: 'Module Generator',
        icon: <Pen2 className="h-4 w-4" />,
      },
      {
        path: '/create',
        label: 'Create Project (.zip)',
        icon: <Box className="h-4 w-4" />,
      },
    ];

    // Menu Manajemen Pengguna hanya untuk Admin & Super Admin
    if (user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN') {
      items.push({
        path: '/users',
        label: 'Manajemen Pengguna',
        icon: <UsersGroupRounded className="h-4 w-4" />,
      });
    }

    return items;
  }, [user?.role]);

  return (
    <RequireAuth>
      <AppShell
        appName="Modula 2.0"
        logo={
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground shadow-sm">
            M
          </div>
        }
        user={user ? { name: user.name, roleName: user.role } : null}
        permissions={permissions}
        onLogout={logout}
        navItems={navItems}
      >
        <Outlet />
      </AppShell>
    </RequireAuth>
  );
}
