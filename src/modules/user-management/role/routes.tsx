import type { RouteObject } from 'react-router';
import {
  RoleListPage,
  RoleCreatePage,
  RoleViewPage,
  RoleEditPage,
} from './index';

export const roleRoutes: RouteObject[] = [
  {
    path: 'user-management/role',
    element: <RoleListPage />,
    handle: {
      breadcrumb: [{ label: 'Roles', labelKey: 'role.labelPlural' }],
      requiredPermission: 'master-role.view',
    },
  },
  {
    path: 'user-management/role/create',
    element: <RoleCreatePage />,
    handle: {
      breadcrumb: [
        { label: 'Roles', labelKey: 'role.labelPlural', path: '/user-management/role' },
        { label: 'Create', labelKey: 'role.breadcrumbs.create' },
      ],
      requiredPermission: 'master-role.create',
    },
  },
  {
    path: 'user-management/role/:roleId/view',
    element: <RoleViewPage />,
    handle: {
      breadcrumb: [
        { label: 'Roles', labelKey: 'role.labelPlural', path: '/user-management/role' },
        { label: 'Detail', labelKey: 'role.breadcrumbs.detail' },
      ],
      requiredPermission: 'master-role.view',
    },
  },
  {
    path: 'user-management/role/:roleId/edit',
    element: <RoleEditPage />,
    handle: {
      breadcrumb: [
        { label: 'Roles', labelKey: 'role.labelPlural', path: '/user-management/role' },
        { label: 'Edit', labelKey: 'role.breadcrumbs.edit' },
      ],
      requiredPermission: 'master-role.update',
    },
  },
];
