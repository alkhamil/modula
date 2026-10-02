import type { LoginPayload, LoginResult } from '../types';
import { normalizePermissions } from '../../../shared/utils';
import { mockUserRecords } from './mockUsers';

export const USE_MOCK = {
  login: false,
  logout: false,
};

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function mockLogin(payload: LoginPayload): Promise<LoginResult> {
  await delay(500);
  const record = mockUserRecords.find(
    (candidate) => candidate.username === payload.username.trim().toLowerCase(),
  );
  if (!record || record.password !== payload.password) {
    throw new Error('Username atau password salah.');
  }
  return {
    user: { username: record.username, name: record.name, role: record.role },
    token: `mock-token-${record.username}-${Date.now()}`,
    permissions: normalizePermissions(record.permissions),
  };
}

export async function mockLogout(): Promise<void> {
  await delay(200);
}
