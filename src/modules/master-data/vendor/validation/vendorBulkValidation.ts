import { t } from 'i18next';
import '../../../../shared/i18n';
import type { CreateVendorPayload } from '../types';
import { hasEmoticon } from '../../../../shared/utils';

export interface BulkFieldError {
  field: string;
  message: string;
}

export interface BulkRowValidation {
  payload: CreateVendorPayload | null;
  errors: BulkFieldError[];
}

/** Bulk template column headers (also used for row mapping). */
export const BULK_VENDOR_HEADERS = ["Region","Name"];

/** Example row in the bulk upload template. */
export const BULK_VENDOR_EXAMPLE = ["REGION_1","Sample Name"];

/**
 * Validasi satu baris bulk (key = header). Aturan mirror validasi form +
 * membership option + unique via `isTaken`.
 */
export function validateBulkVendorRow(
  row: Record<string, unknown>,
  isTaken: (field: string, value: string) => boolean,
): BulkRowValidation {
  const errors: BulkFieldError[] = [];
  const regionValue = String(row["Region"] ?? '').trim();
  if (!regionValue) errors.push({ field: "Region", message: t('validation.required', { label: t('vendor.fields.region.label') }) });
  const nameValue = String(row["Name"] ?? '').trim();
  if (!nameValue) errors.push({ field: "Name", message: t('validation.required', { label: t('vendor.fields.name.label') }) });
  if (nameValue !== '' && nameValue.length < 3) errors.push({ field: "Name", message: t('validation.minLength', { label: t('vendor.fields.name.label'), count: 3 }) });
  if (nameValue !== '' && nameValue.length > 100) errors.push({ field: "Name", message: t('validation.maxLength', { label: t('vendor.fields.name.label'), count: 100 }) });
  if (nameValue !== '' && hasEmoticon(nameValue)) errors.push({ field: "Name", message: t('validation.noEmoticon') });
  if (nameValue !== '' && isTaken('name', nameValue)) errors.push({ field: "Name", message: t('validation.unique', { label: t('vendor.fields.name.label') }) });
  if (errors.length > 0) return { payload: null, errors };
  return {
    payload: {
    region: regionValue,
    name: nameValue,
    },
    errors,
  };
}
