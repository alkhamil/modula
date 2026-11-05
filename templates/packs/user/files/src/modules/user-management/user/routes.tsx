import type { RouteObject } from 'react-router';
import {
  UserListPage,
  UserCreatePage,
  UserViewPage,
  UserEditPage,
} from './index';

export const userRoutes: RouteObject[] = [
  {
    path: 'user-management/user',
    element: <UserListPage />,
    handle: {
      breadcrumb: [{ label: 'Users', labelKey: 'user.labelPlural' }],
      requiredPermission: 'master-user.view',
    },
  },
  {
    path: 'user-management/user/create',
    element: <UserCreatePage />,
    handle: {
      breadcrumb: [
        { label: 'Users', labelKey: 'user.labelPlural', path: '/user-management/user' },
        { label: 'Create', labelKey: 'user.breadcrumbs.create' },
      ],
      requiredPermission: 'master-user.create',
    },
  },
  {
    path: 'user-management/user/:userId/view',
    element: <UserViewPage />,
    handle: {
      breadcrumb: [
        { label: 'Users', labelKey: 'user.labelPlural', path: '/user-management/user' },
        { label: 'Detail', labelKey: 'user.breadcrumbs.detail' },
      ],
      requiredPermission: 'master-user.view',
    },
  },
  {
    path: 'user-management/user/:userId/edit',
    element: <UserEditPage />,
    handle: {
      breadcrumb: [
        { label: 'Users', labelKey: 'user.labelPlural', path: '/user-management/user' },
        { label: 'Edit', labelKey: 'user.breadcrumbs.edit' },
      ],
      requiredPermission: 'master-user.update',
    },
  },
];
