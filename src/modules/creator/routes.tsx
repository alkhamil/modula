import type { RouteObject } from 'react-router';
import LandingPage from './pages/LandingPage';
import CreateProjectPage from './pages/CreateProjectPage';

export const creatorRoutes: RouteObject[] = [
  { index: true, element: <LandingPage /> },
  { path: 'create', element: <CreateProjectPage /> },
];
