import type { ComponentProps } from 'react';
import { AppShell } from '../shared/components/layout';
import { navItems } from './navigation';
import { assetUrl, projectConfig } from './project.config';
import { RequireAuth, useAuth } from './providers';
// __SHELL_IMPORTS__

const logo = projectConfig.logo ? (
  <img src={assetUrl(projectConfig.logo)} alt={projectConfig.name} className="wds-sidenav__brand-img" />
) : undefined;
const collapsedLogo = projectConfig.logoCollapsed ? (
  <img src={assetUrl(projectConfig.logoCollapsed)} alt={projectConfig.name} className="wds-sidenav__brand-img wds-sidenav__brand-img--mini" />
) : undefined;

/** App shell terproteksi: guard session + menu (disaring permission) + user dari auth. */
function ProtectedAppShell() {
  const { user, permissions } = useAuth();
  // __SHELL_HOOKS__
  const shellExtras: Partial<ComponentProps<typeof AppShell>> = {
    // __SHELL_EXTRAS__
  };
  return (
    <RequireAuth>
      <AppShell
        navItems={navItems}
        permissions={permissions}
        user={user ? { name: user.name, roleName: user.role } : null}
        appName={projectConfig.name}
        logo={logo}
        collapsedLogo={collapsedLogo}
        {...shellExtras}
      />
    </RequireAuth>
  );
}

export default ProtectedAppShell;
