import type { RouteObject } from 'react-router';
import DocsLayout from './docs/DocsLayout';
import { TypographyPage, ColorsPage, IconsPage, UiPage, ComponentsIndexPage, ComponentDocPage } from './index';

export const showcaseRoutes: RouteObject[] = [
  {
    path: 'components',
    element: <ComponentsIndexPage />,
  },
  {
    path: 'components/typography',
    element: (
      <DocsLayout>
        <TypographyPage />
      </DocsLayout>
    ),
  },
  {
    path: 'components/colors',
    element: (
      <DocsLayout>
        <ColorsPage />
      </DocsLayout>
    ),
  },
  {
    path: 'components/icons',
    element: (
      <DocsLayout>
        <IconsPage />
      </DocsLayout>
    ),
  },
  {
    path: 'components/ui',
    element: (
      <DocsLayout>
        <UiPage />
      </DocsLayout>
    ),
  },
  {
    path: 'components/:slug',
    element: <ComponentDocPage />,
  },
];
