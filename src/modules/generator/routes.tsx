import type { RouteObject } from 'react-router';
import { GeneratorPage } from './index';
import {
  DynamicPreviewCreatePage,
  DynamicPreviewDetailPage,
  DynamicPreviewEditPage,
  DynamicPreviewPage,
} from './runtime/DynamicRoutes';

export const generatorRoutes: RouteObject[] = [
  {
    path: 'generator',
    element: <GeneratorPage />,
    handle: {
      breadcrumb: [{ label: 'Generator', labelKey: 'nav.generator' }],
    },
  },
  {
    path: 'preview/:definitionKey',
    element: <DynamicPreviewPage />,
    handle: {
      breadcrumb: [
        { label: 'Preview', labelKey: 'common.preview' },
      ],
    },
  },
  {
    path: 'preview/:definitionKey/create',
    element: <DynamicPreviewCreatePage />,
    handle: {
      breadcrumb: [
        { label: 'Preview', labelKey: 'common.preview' },
        { label: 'Create', labelKey: 'common.create' },
      ],
    },
  },
  {
    path: 'preview/:definitionKey/:recordId/view',
    element: <DynamicPreviewDetailPage />,
    handle: {
      breadcrumb: [
        { label: 'Preview', labelKey: 'common.preview' },
        { label: 'Detail', labelKey: 'common.detail' },
      ],
    },
  },
  {
    path: 'preview/:definitionKey/:recordId/edit',
    element: <DynamicPreviewEditPage />,
    handle: {
      breadcrumb: [
        { label: 'Preview', labelKey: 'common.preview' },
        { label: 'Edit', labelKey: 'common.edit' },
      ],
    },
  },
];
