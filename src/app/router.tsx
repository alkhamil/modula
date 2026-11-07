import { createBrowserRouter } from 'react-router';
import { ErrorStatePage } from '../shared/components/ui';
import { WebLayout, creatorRoutes } from '../modules/creator';
import ProjectLivePage from '../modules/creator/pages/ProjectLivePage';
import { showcaseRoutes } from '../modules/showcase/routes';

export const router = createBrowserRouter([
  {
    path: ':projectSlug/live',
    element: <ProjectLivePage />,
  },
  {
    path: ':projectSlug/live/*',
    element: <ProjectLivePage />,
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
