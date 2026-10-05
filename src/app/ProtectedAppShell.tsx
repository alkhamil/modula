import { mergeNavItems, navItems, useDynamicNavItems } from './navigation';
import { AppShell } from '../shared/components/layout';
import { RequireAuth, useAuth } from './providers';
import LanguageSwitcher from '../shared/i18n/LanguageSwitcher';

/** App shell terproteksi: guard session + user/permissions/logout dari auth. */
function ProtectedAppShell() {
  const { user, permissions, logout } = useAuth();
  const dynamicNavItems = useDynamicNavItems();
  return (
    <RequireAuth>
      <AppShell
        navItems={mergeNavItems(navItems, dynamicNavItems)}
        permissions={permissions}
        user={user ? { name: user.name, roleName: user.role } : null}
        onLogout={logout}
        appName="Generator"
        showThemeCustomizer
        headerExtra={<LanguageSwitcher />}
      />
    </RequireAuth>
  );
}

export default ProtectedAppShell;
