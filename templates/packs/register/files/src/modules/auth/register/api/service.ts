import api from '../../../../shared/lib/api';
import type { RegisterPayload } from '../types';

/** Panggilan API nyata — aktif bila `USE_MOCK.register` di `mock.ts` = false. */
export async function register(payload: RegisterPayload): Promise<void> {
  await api.post('/api/v1/auth/register', payload);
}
