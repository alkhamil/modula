import type { RouteObject } from 'react-router';
import {
  DefaultModuleListPage,
  DefaultModuleCreatePage,
  DefaultModuleViewPage,
  DefaultModuleEditPage,
} from './index';

export const defaultModuleRoutes: RouteObject[] = [
  {
    path: 'default-modules',
    element: <DefaultModuleListPage />,
    handle: {
      breadcrumb: [{ label: 'Default Modules', labelKey: 'default_module.breadcrumbs.list' }],
      requiredPermission: 'default_module.view',
    },
  },
  {
    path: 'default-modules/create',
    element: <DefaultModuleCreatePage />,
    handle: {
      breadcrumb: [
        { label: 'Default Modules', labelKey: 'default_module.breadcrumbs.list', path: '/default-modules' },
        { label: 'Create', labelKey: 'default_module.breadcrumbs.create' },
      ],
      requiredPermission: 'default_module.create',
    },
  },
  {
    path: 'default-modules/:defaultModuleId/view',
    element: <DefaultModuleViewPage />,
    handle: {
      breadcrumb: [
        { label: 'Default Modules', labelKey: 'default_module.breadcrumbs.list', path: '/default-modules' },
        { label: 'Detail', labelKey: 'default_module.breadcrumbs.detail' },
      ],
      requiredPermission: 'default_module.view',
    },
  },
  {
    path: 'default-modules/:defaultModuleId/edit',
    element: <DefaultModuleEditPage />,
    handle: {
      breadcrumb: [
        { label: 'Default Modules', labelKey: 'default_module.breadcrumbs.list', path: '/default-modules' },
        { label: 'Edit', labelKey: 'default_module.breadcrumbs.edit' },
      ],
      requiredPermission: 'default_module.update',
    },
  },
];
