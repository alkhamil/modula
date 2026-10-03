import { createBrowserRouter } from 'react-router';
import { ErrorStatePage } from '../shared/components/ui';
import { AuthProvider, PermissionGate } from '../modules/auth';
import ProtectedAppShell from './ProtectedAppShell';
import DashboardPage from '../pages/DashboardPage';
import TypographyPage from '../pages/components/TypographyPage';
import ColorsPage from '../pages/components/ColorsPage';
import IconsPage from '../pages/components/IconsPage';
import UiPage from '../pages/components/UiPage';
import LoginPage from '../pages/LoginPage';
import { GeneratorPage } from '../modules/generator';
import {
  DynamicModuleRoutes,
  DynamicPreviewCreatePage,
  DynamicPreviewDetailPage,
  DynamicPreviewEditPage,
  DynamicPreviewPage,
} from '../modules/generator/runtime/DynamicRoutes';
// __GENERATOR_IMPORTS__

export const router = createBrowserRouter([
  {
    element: <AuthProvider />,
    children: [
      {
        element: <ProtectedAppShell />,
        children: [
          {
            element: <PermissionGate />,
            children: [
              { index: true, element: <DashboardPage /> },
              {
                path: 'components/typography',
                element: <TypographyPage />,
                handle: { breadcrumb: [{ label: 'Component' }, { label: 'Typography' }] },
              },
              {
                path: 'components/colors',
                element: <ColorsPage />,
                handle: { breadcrumb: [{ label: 'Component' }, { label: 'Colors' }] },
              },
              {
                path: 'components/icons',
                element: <IconsPage />,
                handle: { breadcrumb: [{ label: 'Component' }, { label: 'Icons' }] },
              },
              {
                path: 'components/ui',
                element: <UiPage />,
                handle: { breadcrumb: [{ label: 'Component' }, { label: 'UI' }] },
              },
              {
                path: 'generator',
                element: <GeneratorPage />,
                handle: { breadcrumb: [{ label: 'Generator' }] },
              },
              {
                path: 'preview/:definitionKey',
                element: <DynamicPreviewPage />,
                handle: { breadcrumb: [{ label: 'Preview' }] },
              },
              {
                path: 'preview/:definitionKey/create',
                element: <DynamicPreviewCreatePage />,
                handle: { breadcrumb: [{ label: 'Preview' }, { label: 'Create' }] },
              },
              {
                path: 'preview/:definitionKey/:recordId/view',
                element: <DynamicPreviewDetailPage />,
                handle: { breadcrumb: [{ label: 'Preview' }, { label: 'Detail' }] },
              },
              {
                path: 'preview/:definitionKey/:recordId/edit',
                element: <DynamicPreviewEditPage />,
                handle: { breadcrumb: [{ label: 'Preview' }, { label: 'Edit' }] },
              },
              // Modul hasil generate-ke-repo terdaftar statis di sini (di atas
              // host dinamis agar menang). Modul dinamis murni tetap lewat
              // definisi published tanpa route statis.
              // __GENERATOR_ROUTES__
              // Host WAJIB `path: '*'`: pathless tidak match URL dinamis
              // (sisa pathname tak terkonsumsi → jatuh ke 404).
              {
                path: 'not-found',
                element: <ErrorStatePage type="404" />,
                handle: { notFound: true },
              },
              { path: '*', element: <DynamicModuleRoutes /> },
            ],
          },
        ],
      },
      { path: 'login', element: <LoginPage /> },
    ],
  },
]);
