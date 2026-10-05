import { t } from 'i18next';
import '../../../../shared/i18n';
import type { CreateUserPayload } from '../types';
import { EMAIL_PATTERN } from './userValidation';

export interface BulkFieldError {
  field: string;
  message: string;
}

export interface BulkRowValidation {
  payload: CreateUserPayload | null;
  errors: BulkFieldError[];
}

/** Bulk template column headers (also used for row mapping). */
export const BULK_USER_HEADERS = ['Name', 'Username', 'Email', 'Password', 'Role', 'Status'];

/** Example row in the bulk upload template. */
export const BULK_USER_EXAMPLE = [
  'Sample Name',
  'sample.name',
  'sample.name@company.com',
  'secret123',
  'Admin',
  'Active',
];

const STATUS_VALUES = ['active', 'inactive'];

/**
 * Validasi satu baris bulk (key = header). Aturan mirror validasi form +
 * membership role + unique via `isTaken` / `resolveRoleId`.
 */
export function validateBulkUserRow(
  row: Record<string, unknown>,
  isTaken: (field: string, value: string) => boolean,
  resolveRoleId: (roleName: string) => string | undefined,
): BulkRowValidation {
  const errors: BulkFieldError[] = [];
  const required = (header: string, label: string) => {
    const value = String(row[header] ?? '').trim();
    if (!value) errors.push({ field: header, message: t('validation.required', { label }) });
    return value;
  };

  const nameValue = required('Name', 'Name');
  if (nameValue !== '' && nameValue.length < 3)
    errors.push({ field: 'Name', message: t('validation.minLength', { label: 'Name', count: 3 }) });
  if (nameValue !== '' && nameValue.length > 100)
    errors.push({ field: 'Name', message: t('validation.maxLength', { label: 'Name', count: 100 }) });

  const usernameValue = required('Username', 'Username');
  if (usernameValue !== '' && usernameValue.length < 3)
    errors.push({
      field: 'Username',
      message: t('validation.minLength', { label: 'Username', count: 3 }),
    });
  if (usernameValue !== '' && isTaken('username', usernameValue))
    errors.push({ field: 'Username', message: t('validation.unique', { label: 'Username' }) });

  const emailValue = required('Email', 'Email');
  if (emailValue !== '' && !EMAIL_PATTERN.test(emailValue))
    errors.push({ field: 'Email', message: t('validation.email') });
  if (emailValue !== '' && isTaken('email', emailValue))
    errors.push({ field: 'Email', message: t('validation.unique', { label: 'Email' }) });

  const passwordValue = required('Password', 'Password');
  if (passwordValue !== '' && passwordValue.length < 6)
    errors.push({
      field: 'Password',
      message: t('validation.minLength', { label: 'Password', count: 6 }),
    });

  const roleValue = required('Role', 'Role');
  const roleId = roleValue !== '' ? resolveRoleId(roleValue) : undefined;
  if (roleValue !== '' && !roleId)
    errors.push({
      field: 'Role',
      message: t('validation.unknownOption', { label: 'Role', value: roleValue }),
    });

  const statusRaw = String(row['Status'] ?? '').trim().toLowerCase();
  const statusValue = (STATUS_VALUES.includes(statusRaw) ? statusRaw : 'active') as
    | 'active'
    | 'inactive';

  if (errors.length > 0) return { payload: null, errors };
  return {
    payload: {
      name: nameValue,
      role_id: roleId ?? '',
      username: usernameValue,
      email: emailValue,
      password: passwordValue,
      status: statusValue,
    },
    errors,
  };
}
