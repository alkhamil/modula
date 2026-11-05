import type { RegisterPayload } from '../types';

export const MIN_PASSWORD_LENGTH = 6;

/**
 * Validasi input register sebelum submit.
 * @returns i18n key pesan error (+ params), atau `null` bila valid.
 */
export function validateRegisterInput(
  input: RegisterPayload & { confirm: string },
): { key: string; params?: Record<string, unknown> } | null {
  if (!input.name.trim() || !input.username.trim() || !input.email.trim() || !input.password) {
    return { key: 'auth.registerFieldsRequired' };
  }
  if (!/^\S+@\S+\.\S+$/.test(input.email.trim())) return { key: 'auth.emailInvalid' };
  if (input.password.length < MIN_PASSWORD_LENGTH) {
    return { key: 'auth.passwordTooShort', params: { count: MIN_PASSWORD_LENGTH } };
  }
  if (input.password !== input.confirm) return { key: 'auth.passwordMismatch' };
  return null;
}
