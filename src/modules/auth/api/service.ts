import api from '../../../shared/lib/api';
import { isConnectionError, NETWORK_ERROR_MESSAGE } from '../../../shared/utils';
import type { LoginPayload, LoginResult } from '../types';
import type { ApiResponse } from '../../../shared/types';

interface EnvelopeErrorShape {
  response?: { data?: { response_schema?: { response_message?: string } } };
}

/** Axios error → Error dengan pesan envelope BE (atau pesan koneksi). */
function toAuthError(err: unknown, fallback: string): Error {
  if (isConnectionError(err)) return new Error(NETWORK_ERROR_MESSAGE);
  const message = (err as EnvelopeErrorShape)?.response?.data?.response_schema?.response_message;
  return new Error(message || fallback);
}

export async function login(payload: LoginPayload): Promise<LoginResult> {
  let res;
  try {
    res = await api.post<ApiResponse<LoginResult>>('/api/v1/auth/login', payload);
  } catch (err) {
    throw toAuthError(err, 'Login gagal.');
  }
  const output = res.data.response_output;
  if (!output) throw new Error('Login gagal.');
  return output;
}

export async function logout(): Promise<void> {
  try {
    await api.post('/api/v1/auth/logout');
  } catch (err) {
    throw toAuthError(err, 'Logout gagal.');
  }
}
