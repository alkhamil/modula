import { t } from 'i18next';
import '../../../../shared/i18n';
import type { CreateCategoryPayload } from '../types';
import { hasEmoticon } from '../../../../shared/utils';

export interface BulkFieldError {
  field: string;
  message: string;
}

export interface BulkRowValidation {
  payload: CreateCategoryPayload | null;
  errors: BulkFieldError[];
}

/** Bulk template column headers (also used for row mapping). */
export const BULK_CATEGORY_HEADERS = ["Name"];

/** Example row in the bulk upload template. */
export const BULK_CATEGORY_EXAMPLE = ["Sample Name"];

/**
 * Validasi satu baris bulk (key = header). Aturan mirror validasi form +
 * membership option + unique via `isTaken`.
 */
export function validateBulkCategoryRow(
  row: Record<string, unknown>,
  isTaken: (field: string, value: string) => boolean,
): BulkRowValidation {
  const errors: BulkFieldError[] = [];
  const nameValue = String(row["Name"] ?? '').trim();
  if (!nameValue) errors.push({ field: "Name", message: t('validation.required', { label: t('category.fields.name.label') }) });
  if (nameValue !== '' && nameValue.length < 3) errors.push({ field: "Name", message: t('validation.minLength', { label: t('category.fields.name.label'), count: 3 }) });
  if (nameValue !== '' && nameValue.length > 100) errors.push({ field: "Name", message: t('validation.maxLength', { label: t('category.fields.name.label'), count: 100 }) });
  if (nameValue !== '' && hasEmoticon(nameValue)) errors.push({ field: "Name", message: t('validation.noEmoticon') });
  if (nameValue !== '' && isTaken('name', nameValue)) errors.push({ field: "Name", message: t('validation.unique', { label: t('category.fields.name.label') }) });
  if (errors.length > 0) return { payload: null, errors };
  return {
    payload: {
    name: nameValue,
    },
    errors,
  };
}
