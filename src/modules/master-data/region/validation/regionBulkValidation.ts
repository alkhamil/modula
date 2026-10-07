import { t } from 'i18next';
import '../../../../shared/i18n';
import type { CreateRegionPayload } from '../types';
import { hasEmoticon } from '../../../../shared/utils';

export interface BulkFieldError {
  field: string;
  message: string;
}

export interface BulkRowValidation {
  payload: CreateRegionPayload | null;
  errors: BulkFieldError[];
}

/** Bulk template column headers (also used for row mapping). */
export const BULK_REGION_HEADERS = ["Name","Code"];

/** Example row in the bulk upload template. */
export const BULK_REGION_EXAMPLE = ["Sample Name","Sample Code"];

/**
 * Validasi satu baris bulk (key = header). Aturan mirror validasi form +
 * membership option + unique via `isTaken`.
 */
export function validateBulkRegionRow(
  row: Record<string, unknown>,
  isTaken: (field: string, value: string) => boolean,
): BulkRowValidation {
  const errors: BulkFieldError[] = [];
  const nameValue = String(row["Name"] ?? '').trim();
  if (!nameValue) errors.push({ field: "Name", message: t('validation.required', { label: t('region.fields.name.label') }) });
  if (nameValue !== '' && nameValue.length < 3) errors.push({ field: "Name", message: t('validation.minLength', { label: t('region.fields.name.label'), count: 3 }) });
  if (nameValue !== '' && nameValue.length > 100) errors.push({ field: "Name", message: t('validation.maxLength', { label: t('region.fields.name.label'), count: 100 }) });
  if (nameValue !== '' && hasEmoticon(nameValue)) errors.push({ field: "Name", message: t('validation.noEmoticon') });
  if (nameValue !== '' && isTaken('name', nameValue)) errors.push({ field: "Name", message: t('validation.unique', { label: t('region.fields.name.label') }) });
  const codeValue = String(row["Code"] ?? '').trim();
  if (!codeValue) errors.push({ field: "Code", message: t('validation.required', { label: t('region.fields.code.label') }) });
  if (codeValue !== '' && codeValue.length < 3) errors.push({ field: "Code", message: t('validation.minLength', { label: t('region.fields.code.label'), count: 3 }) });
  if (codeValue !== '' && codeValue.length > 3) errors.push({ field: "Code", message: t('validation.maxLength', { label: t('region.fields.code.label'), count: 3 }) });
  if (codeValue !== '' && hasEmoticon(codeValue)) errors.push({ field: "Code", message: t('validation.noEmoticon') });
  if (codeValue !== '' && isTaken('code', codeValue)) errors.push({ field: "Code", message: t('validation.unique', { label: t('region.fields.code.label') }) });
  if (errors.length > 0) return { payload: null, errors };
  return {
    payload: {
    name: nameValue,
    code: codeValue,
    },
    errors,
  };
}
