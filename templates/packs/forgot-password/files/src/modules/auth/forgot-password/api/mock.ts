import { findMockUserByEmail, updateMockPassword } from '../../login/api';

/** Saklar sumber data: `true` = mock lokal tanpa backend. */
export const USE_MOCK = {
  requestReset: true,
  resetPassword: true,
};

const DEMO_TOKEN_PREFIX = 'demo-';

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Minta tautan reset. Response selalu sukses (tidak membocorkan apakah email
 * terdaftar); `demoToken` hanya ada di mock agar alur bisa dicoba tanpa email.
 */
export async function mockRequestReset(email: string): Promise<{ demoToken?: string }> {
  await delay(500);
  const user = findMockUserByEmail(email);
  return user ? { demoToken: `${DEMO_TOKEN_PREFIX}${user.username}` } : {};
}

export async function mockResetPassword(token: string, password: string): Promise<void> {
  await delay(500);
  if (!token.startsWith(DEMO_TOKEN_PREFIX)) throw new Error('auth.resetTokenInvalid');
  updateMockPassword(token.slice(DEMO_TOKEN_PREFIX.length), password);
}
