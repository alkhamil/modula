import type { RouteObject } from 'react-router';
import { TypographyPage, ColorsPage, UiPage } from './index';

export const showcaseRoutes: RouteObject[] = [
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
