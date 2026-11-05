import type { RouteObject } from 'react-router';
import {
  DefaultItemListPage,
  DefaultItemCreatePage,
  DefaultItemViewPage,
  DefaultItemEditPage,
} from './index';

export const defaultItemRoutes: RouteObject[] = [
  {
    path: 'default-parent/default-items',
    element: <DefaultItemListPage />,
    handle: {
      breadcrumb: [{ label: 'Default Items', labelKey: 'default_item.breadcrumbs.list' }],
      requiredPermission: 'default_item.view',
    },
  },
  {
    path: 'default-parent/default-items/create',
    element: <DefaultItemCreatePage />,
    handle: {
      breadcrumb: [
        { label: 'Default Items', labelKey: 'default_item.breadcrumbs.list', path: '/default-parent/default-items' },
        { label: 'Create', labelKey: 'default_item.breadcrumbs.create' },
      ],
      requiredPermission: 'default_item.create',
    },
  },
  {
    path: 'default-parent/default-items/:defaultItemId/view',
    element: <DefaultItemViewPage />,
    handle: {
      breadcrumb: [
        { label: 'Default Items', labelKey: 'default_item.breadcrumbs.list', path: '/default-parent/default-items' },
        { label: 'Detail', labelKey: 'default_item.breadcrumbs.detail' },
      ],
      requiredPermission: 'default_item.view',
    },
  },
  {
    path: 'default-parent/default-items/:defaultItemId/edit',
    element: <DefaultItemEditPage />,
    handle: {
      breadcrumb: [
        { label: 'Default Items', labelKey: 'default_item.breadcrumbs.list', path: '/default-parent/default-items' },
        { label: 'Edit', labelKey: 'default_item.breadcrumbs.edit' },
      ],
      requiredPermission: 'default_item.update',
    },
  },
];
