import type { RouteObject } from 'react-router';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';

/** Publik (di luar shell terproteksi). */
export const forgotPasswordRoutes: RouteObject[] = [
  { path: 'forgot-password', element: <ForgotPasswordPage /> },
  { path: 'reset-password', element: <ResetPasswordPage /> },
];
