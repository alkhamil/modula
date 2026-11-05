import type { RouteObject } from 'react-router';
import { DashboardPage } from './index';

export const dashboardRoutes: RouteObject[] = [{ index: true, element: <DashboardPage /> }];
