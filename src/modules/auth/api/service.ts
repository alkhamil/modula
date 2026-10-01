import api from '../../../shared/lib/api';
import type { LoginPayload, LoginResult } from '../types';
import type { ApiResponse } from '../../../shared/types';

export async function login(payload: LoginPayload): Promise<LoginResult> {
  const res = await api.post<ApiResponse<LoginResult>>('/api/v1/auth/login', payload);
  return res.data.response_output!;
}

export async function logout(): Promise<void> {
  await api.post('/api/v1/auth/logout');
}
