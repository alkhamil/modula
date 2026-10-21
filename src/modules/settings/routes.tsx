import type { RouteObject } from 'react-router';
import { SettingsPage } from './index';

export const settingsRoutes: RouteObject[] = [
  {
    path: 'settings',
    element: <SettingsPage />,
    handle: {
      breadcrumb: [{ label: 'Settings', labelKey: 'settings.breadcrumb' }],
      requiredPermission: 'settings.view',
    },
  },
];
