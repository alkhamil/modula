import { createBrowserRouter } from 'react-router';
import { ErrorStatePage } from '../shared/components/ui';
import { WebLayout, creatorRoutes } from '../modules/creator';
import { showcaseRoutes } from '../modules/showcase/routes';

export const router = createBrowserRouter([
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
