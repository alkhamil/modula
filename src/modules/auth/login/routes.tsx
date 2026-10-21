import type { RouteObject } from 'react-router';
import { LoginPage } from './index';

/** Publik (di luar shell terproteksi) — tanpa `navigation.tsx` karena tidak ada menu. */
export const loginRoutes: RouteObject[] = [{ path: 'login', element: <LoginPage /> }];
