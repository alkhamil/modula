import { createBrowserRouter } from 'react-router';
import { ErrorStatePage } from '../shared/components/ui';
import { WebLayout, creatorRoutes } from '../modules/creator';
import LiveAppPage from '../modules/preview/pages/LiveAppPage';
import { showcaseRoutes } from '../modules/showcase/routes';

export const router = createBrowserRouter([
  {
    path: ':projectSlug/live',
    element: <LiveAppPage />,
  },
  {
    path: ':projectSlug/live/*',
    element: <LiveAppPage />,
  },
  {
    element: <WebLayout />,
    children: [
      ...creatorRoutes,
      ...showcaseRoutes,
      {
        path: '*',
        element: <ErrorStatePage type="404" />,
        handle: { notFound: true },
      },
    ],
  },
]);
