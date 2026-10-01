import type { CreateUserPayload } from '../types';

export interface BulkFieldError {
  field: string;
  message: string;
}

export interface BulkRowValidation {
  payload: CreateUserPayload | null;
  errors: BulkFieldError[];
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ROLE_VALUES = ['admin', 'editor', 'viewer'];

/** Header kolom template bulk upload (dipakai juga untuk mapping baris). */
export const BULK_USER_HEADERS = ['Name', 'Email', 'Role'];

/** Contoh baris pada template bulk upload. */
export const BULK_USER_EXAMPLE = ['Contoh Nama', 'contoh@example.com', 'editor'];

/**
 * Validasi satu baris bulk (key = header). Aturan mirror userValidation +
 * membership role + unique email via `isTaken`.
 */
export function validateBulkUserRow(
  row: Record<string, unknown>,
  isTaken: (field: string, value: string) => boolean,
): BulkRowValidation {
  const errors: BulkFieldError[] = [];
  const name = String(row.Name ?? '').trim();
  const email = String(row.Email ?? '').trim();
  const role = String(row.Role ?? '').trim();

  if (!name) {
    errors.push({ field: 'Name', message: 'Name wajib diisi.' });
  } else {
    if (name.length < 3) errors.push({ field: 'Name', message: 'Name minimal 3 karakter.' });
    if (name.length > 100) errors.push({ field: 'Name', message: 'Name maksimal 100 karakter.' });
  }
  if (!email) {
    errors.push({ field: 'Email', message: 'Email wajib diisi.' });
  } else {
    if (!EMAIL_RE.test(email)) errors.push({ field: 'Email', message: 'Format email tidak valid.' });
    else if (isTaken('email', email)) {
      errors.push({ field: 'Email', message: 'Email sudah dipakai.' });
    }
  }
  if (!role) {
    errors.push({ field: 'Role', message: 'Role wajib diisi.' });
  } else if (!ROLE_VALUES.includes(role)) {
    errors.push({ field: 'Role', message: `Role harus salah satu: ${ROLE_VALUES.join(', ')}.` });
  }

  if (errors.length > 0) return { payload: null, errors };
  return { payload: { name, email, role }, errors };
}
