import api from '../../../../shared/lib/api';

/** Panggilan API nyata — aktif bila `USE_MOCK.verify` di `mock.ts` = false. */
export async function verifyCode(username: string, code: string): Promise<void> {
  await api.post('/api/v1/auth/two-factor/verify', { username, code });
}
