import { t } from 'i18next';
import '../../../../shared/i18n';
import type { CreateRolePayload } from '../types';

export interface BulkFieldError {
  field: string;
  message: string;
}

export interface BulkRowValidation {
  payload: CreateRolePayload | null;
  errors: BulkFieldError[];
}

/** Bulk template column headers (also used for row mapping). */
export const BULK_ROLE_HEADERS = ['Name', 'Permissions', 'Status'];

/** Example row in the bulk upload template. */
export const BULK_ROLE_EXAMPLE = ['Sample Role', 'user.view, user.create', 'Active'];

const STATUS_VALUES = ['active', 'inactive'];

/**
 * Validasi satu baris bulk (key = header). Permissions dipisah koma
 * (`user.view, user.create`), tiap item harus ada di katalog.
 */
export function validateBulkRoleRow(
  row: Record<string, unknown>,
  catalog: string[],
  isTaken: (name: string) => boolean,
): BulkRowValidation {
  const errors: BulkFieldError[] = [];

  const nameValue = String(row['Name'] ?? '').trim();
  if (!nameValue) errors.push({ field: 'Name', message: t('validation.required', { label: 'Name' }) });
  if (nameValue !== '' && nameValue.length < 3)
    errors.push({ field: 'Name', message: t('validation.minLength', { label: 'Name', count: 3 }) });
  if (nameValue !== '' && nameValue.length > 100)
    errors.push({ field: 'Name', message: t('validation.maxLength', { label: 'Name', count: 100 }) });
  if (nameValue !== '' && isTaken(nameValue))
    errors.push({ field: 'Name', message: t('validation.unique', { label: 'Name' }) });

  const rawPermissions = String(row['Permissions'] ?? '')
    .split(',')
    .map((p) => p.trim())
    .filter(Boolean);
  const unknown = rawPermissions.filter((p) => !catalog.includes(p));
  if (rawPermissions.length === 0)
    errors.push({
      field: 'Permissions',
      message: t('validation.minItems', { label: 'Permissions', count: 1 }),
    });
  for (const permission of unknown) {
    errors.push({
      field: 'Permissions',
      message: t('validation.unknownOption', { label: 'Permissions', value: permission }),
    });
  }

  const statusRaw = String(row['Status'] ?? '').trim().toLowerCase();
  const statusValue = (STATUS_VALUES.includes(statusRaw) ? statusRaw : 'active') as
    | 'active'
    | 'inactive';

  if (errors.length > 0) return { payload: null, errors };
  return {
    payload: { name: nameValue, permissions: rawPermissions, status: statusValue },
    errors,
  };
}
