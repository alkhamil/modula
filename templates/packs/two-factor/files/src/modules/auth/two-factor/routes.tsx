import type { RouteObject } from 'react-router';
import TwoFactorPage from './pages/TwoFactorPage';

/** Publik (di luar shell terproteksi). */
export const twoFactorRoutes: RouteObject[] = [{ path: 'two-factor', element: <TwoFactorPage /> }];
