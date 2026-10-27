import type { RouteObject } from 'react-router';
import { TypographyPage, ColorsPage, IconsPage, UiPage, ComponentsIndexPage, ComponentDocPage } from './index';

export const showcaseRoutes: RouteObject[] = [
  {
    path: 'components',
    element: <ComponentsIndexPage />,
    handle: {
      breadcrumb: [
        { label: 'Component', labelKey: 'nav.components' },
        { label: 'Docs', labelKey: 'nav.docs' },
      ],
    },
  },
  {
    path: 'components/:slug',
    element: <ComponentDocPage />,
    handle: {
      breadcrumb: [
        { label: 'Component', labelKey: 'nav.components' },
        { label: 'Docs', labelKey: 'nav.docs', path: '/components' },
      ],
    },
  },
  {
    path: 'components/typography',
    element: <TypographyPage />,
    handle: {
      breadcrumb: [
        { label: 'Component', labelKey: 'nav.components' },
        { label: 'Typography', labelKey: 'nav.typography' },
      ],
    },
  },
  {
    path: 'components/colors',
    element: <ColorsPage />,
    handle: {
      breadcrumb: [
        { label: 'Component', labelKey: 'nav.components' },
        { label: 'Colors', labelKey: 'nav.colors' },
      ],
    },
  },
  {
    path: 'components/icons',
    element: <IconsPage />,
    handle: {
      breadcrumb: [
        { label: 'Component', labelKey: 'nav.components' },
        { label: 'Icons', labelKey: 'nav.icons' },
      ],
    },
  },
  {
    path: 'components/ui',
    element: <UiPage />,
    handle: {
      breadcrumb: [
        { label: 'Component', labelKey: 'nav.components' },
        { label: 'UI', labelKey: 'nav.ui' },
      ],
    },
  },
];
