import api from '../../../../shared/lib/api';
import type { ApiResponse } from '../../../../shared/types';

/** Panggilan API nyata — aktif bila `USE_MOCK.logout` di `mock.ts` = false. */
export async function logout(): Promise<void> {
  await api.get<ApiResponse<null>>('/api/v1/auth/logout');
}
