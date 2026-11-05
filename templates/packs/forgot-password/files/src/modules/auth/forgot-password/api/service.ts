import api from '../../../../shared/lib/api';

/** Panggilan API nyata — aktif bila saklar di `mock.ts` = false. */
export async function requestReset(email: string): Promise<{ demoToken?: string }> {
  await api.post('/api/v1/auth/forgot-password', { email });
  return {};
}

export async function resetPassword(token: string, password: string): Promise<void> {
  await api.post('/api/v1/auth/reset-password', { token, password });
}
