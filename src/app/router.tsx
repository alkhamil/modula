import { createBrowserRouter, Navigate } from 'react-router';
import { ErrorStatePage } from '../shared/components/ui';
import { AuthProvider } from './providers/AuthProvider';
import RequireAuth from './providers/RequireAuth';
import ProtectedAppShell from './ProtectedAppShell';
import LoginPage from '../modules/auth/pages/LoginPage';
import WorkspaceDashboardPage from '../modules/workspace/pages/WorkspaceDashboardPage';
import UserManagementPage from '../modules/users/pages/UserManagementPage';
import CreateProjectPage from '../modules/creator/pages/CreateProjectPage';
import ProjectBuilderPage from '../modules/builder/pages/ProjectBuilderPage';
import { generatorRoutes } from '../modules/generator/routes';
import { showcaseRoutes } from '../modules/showcase/routes';

export const router = createBrowserRouter([
  {
    element: <AuthProvider />,
    children: [
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/projects/:slug/builder',
        element: (
          <RequireAuth>
            <ProjectBuilderPage />
          </RequireAuth>
        ),
      },
      {
        path: '/',
        element: <ProtectedAppShell />,
        children: [
          {
            index: true,
            element: <WorkspaceDashboardPage />,
          },
          {
            path: 'projects',
            element: <Navigate to="/" replace />,
          },
          {
            path: 'create',
            element: <CreateProjectPage />,
          },
          {
            path: 'users',
            element: <UserManagementPage />,
          },
          ...generatorRoutes,
          ...showcaseRoutes,
        ],
      },
      {
        path: '*',
        element: <ErrorStatePage type="404" />,
        handle: { notFound: true },
      },
    ],
  },
]);
