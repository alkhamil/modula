import type { RouteObject } from 'react-router';
import RegisterPage from './pages/RegisterPage';

/** Publik (di luar shell terproteksi). */
export const registerRoutes: RouteObject[] = [{ path: 'register', element: <RegisterPage /> }];
