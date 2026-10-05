import { t } from 'i18next';
import '../../../../shared/i18n';
import type { CreateCompanyPayload } from '../types';
import { hasEmoticon } from '../../../../shared/utils';

export interface BulkFieldError {
  field: string;
  message: string;
}

export interface BulkRowValidation {
  payload: CreateCompanyPayload | null;
  errors: BulkFieldError[];
}

/** Bulk template column headers (also used for row mapping). */
export const BULK_COMPANY_HEADERS = ["Name","Description"];

/** Example row in the bulk upload template. */
export const BULK_COMPANY_EXAMPLE = ["Sample Name","Sample Description"];

/**
 * Validasi satu baris bulk (key = header). Aturan mirror validasi form +
 * membership option + unique via `isTaken`.
 */
export function validateBulkCompanyRow(
  row: Record<string, unknown>,
  isTaken: (field: string, value: string) => boolean,
): BulkRowValidation {
  const errors: BulkFieldError[] = [];
  const nameValue = String(row["Name"] ?? '').trim();
  if (!nameValue) errors.push({ field: "Name", message: t('validation.required', { label: "Name" }) });
  if (nameValue !== '' && nameValue.length < 3) errors.push({ field: "Name", message: t('validation.minLength', { label: "Name", count: 3 }) });
  if (nameValue !== '' && nameValue.length > 100) errors.push({ field: "Name", message: t('validation.maxLength', { label: "Name", count: 100 }) });
  if (nameValue !== '' && hasEmoticon(nameValue)) errors.push({ field: "Name", message: t('validation.noEmoticon') });
  if (nameValue !== '' && isTaken('name', nameValue)) errors.push({ field: "Name", message: t('validation.unique', { label: "Name" }) });
  const descriptionValue = String(row["Description"] ?? '').trim();
  if (descriptionValue !== '' && descriptionValue.length < 10) errors.push({ field: "Description", message: t('validation.minLength', { label: "Description", count: 10 }) });
  if (descriptionValue !== '' && descriptionValue.length > 500) errors.push({ field: "Description", message: t('validation.maxLength', { label: "Description", count: 500 }) });
  if (descriptionValue !== '' && hasEmoticon(descriptionValue)) errors.push({ field: "Description", message: t('validation.noEmoticon') });
  if (errors.length > 0) return { payload: null, errors };
  return {
    payload: {
    name: nameValue,
    description: descriptionValue,
    },
    errors,
  };
}
