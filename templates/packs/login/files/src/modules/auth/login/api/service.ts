import api from '../../../../shared/lib/api';
import { isConnectionError, NETWORK_ERROR_MESSAGE } from '../../../../shared/utils';
import type { LoginPayload, LoginResult } from '../types';
import type { ApiDetail, ApiResponse } from '../../../../shared/types';

/** Panggilan API nyata — aktif bila `USE_MOCK.login` di `mock.ts` = false. */
export async function login(payload: LoginPayload): Promise<LoginResult> {
  try {
    const { data } = await api.post<ApiResponse<ApiDetail<LoginResult>>>(
      '/api/v1/auth/login',
      payload,
    );
    return data.response_output!.detail;
  } catch (err) {
    const message = (err as { response?: { data?: { response_schema?: { response_message?: string } } } })
      ?.response?.data?.response_schema?.response_message;
    throw new Error(
      message ?? (isConnectionError(err) ? NETWORK_ERROR_MESSAGE : 'auth.loginFailed'),
    );
  }
}
