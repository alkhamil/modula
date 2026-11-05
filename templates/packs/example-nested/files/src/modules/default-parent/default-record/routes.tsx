import type { RouteObject } from 'react-router';
import {
  DefaultRecordListPage,
  DefaultRecordCreatePage,
  DefaultRecordViewPage,
  DefaultRecordEditPage,
} from './index';

export const defaultRecordRoutes: RouteObject[] = [
  {
    path: 'default-parent/default-records',
    element: <DefaultRecordListPage />,
    handle: {
      breadcrumb: [{ label: 'Default Records', labelKey: 'default_record.breadcrumbs.list' }],
      requiredPermission: 'default_record.view',
    },
  },
  {
    path: 'default-parent/default-records/create',
    element: <DefaultRecordCreatePage />,
    handle: {
      breadcrumb: [
        { label: 'Default Records', labelKey: 'default_record.breadcrumbs.list', path: '/default-parent/default-records' },
        { label: 'Create', labelKey: 'default_record.breadcrumbs.create' },
      ],
      requiredPermission: 'default_record.create',
    },
  },
  {
    path: 'default-parent/default-records/:defaultRecordId/view',
    element: <DefaultRecordViewPage />,
    handle: {
      breadcrumb: [
        { label: 'Default Records', labelKey: 'default_record.breadcrumbs.list', path: '/default-parent/default-records' },
        { label: 'Detail', labelKey: 'default_record.breadcrumbs.detail' },
      ],
      requiredPermission: 'default_record.view',
    },
  },
  {
    path: 'default-parent/default-records/:defaultRecordId/edit',
    element: <DefaultRecordEditPage />,
    handle: {
      breadcrumb: [
        { label: 'Default Records', labelKey: 'default_record.breadcrumbs.list', path: '/default-parent/default-records' },
        { label: 'Edit', labelKey: 'default_record.breadcrumbs.edit' },
      ],
      requiredPermission: 'default_record.update',
    },
  },
];
