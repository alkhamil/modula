import { navItems, useDynamicNavItems } from './navigation';
import { AppShell } from '../shared/components/layout';
import { RequireAuth, useAuth } from '../modules/auth';

/** App shell terproteksi: guard session + user/permissions/logout dari auth. */
function ProtectedAppShell() {
  const { user, permissions, logout } = useAuth();
  const dynamicNavItems = useDynamicNavItems();
  return (
    <RequireAuth>
      <AppShell
        navItems={[...navItems, ...dynamicNavItems]}
        permissions={permissions}
        user={user ? { name: user.name, roleName: user.role } : null}
        onLogout={logout}
        appName="Generator"
        showThemeCustomizer
      />
    </RequireAuth>
  );
}

export default ProtectedAppShell;
