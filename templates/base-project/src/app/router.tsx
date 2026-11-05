import { createBrowserRouter } from 'react-router';
import { ErrorStatePage } from '../shared/components/ui';
import { AuthProvider, PermissionGate } from './providers';
import ProtectedAppShell from './ProtectedAppShell';
import { dashboardRoutes } from '../modules/dashboard/routes';
// __ROUTE_IMPORTS__
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
              // Routes tiap modul hidup di `routes.tsx` modulnya.
              ...dashboardRoutes,
              // __GENERATOR_ROUTES__
              { path: 'not-found', element: <ErrorStatePage type="404" />, handle: { notFound: true } },
              // __FALLBACK_ROUTES__
              { path: '*', element: <ErrorStatePage type="404" />, handle: { notFound: true } },
            ],
          },
        ],
      },
      // Halaman publik (di luar shell terproteksi).
      // __PUBLIC_ROUTES__
    ],
  },
]);
