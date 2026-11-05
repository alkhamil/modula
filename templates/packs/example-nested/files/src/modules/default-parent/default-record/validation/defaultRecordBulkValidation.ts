import { t } from 'i18next';
import '../../../../shared/i18n';
import type { CreateDefaultRecordPayload } from '../types';

export interface BulkFieldError {
  field: string;
  message: string;
}

export interface BulkRowValidation {
  payload: CreateDefaultRecordPayload | null;
  errors: BulkFieldError[];
}

/** Bulk template column headers (also used for row mapping). */
export const BULK_DEFAULTRECORD_HEADERS = ["Name","Code","Sort Order","Description"];

/** Example row in the bulk upload template. */
export const BULK_DEFAULTRECORD_EXAMPLE = ["Sample Name","Sample Code",100,"Sample Description"];

/**
 * Validasi satu baris bulk (key = header). Aturan mirror validasi form +
 * membership option + unique via `isTaken`.
 */
export function validateBulkDefaultRecordRow(
  row: Record<string, unknown>,
  _isTaken: (field: string, value: string) => boolean,
): BulkRowValidation {
  const errors: BulkFieldError[] = [];
  const nameValue = String(row["Name"] ?? '').trim();
  if (!nameValue) errors.push({ field: "Name", message: t('validation.required', { label: t('default_record.fields.name.label') }) });
  if (nameValue !== '' && nameValue.length > 100) errors.push({ field: "Name", message: t('validation.maxLength', { label: t('default_record.fields.name.label'), count: 100 }) });
  const codeValue = String(row["Code"] ?? '').trim();
  if (!codeValue) errors.push({ field: "Code", message: t('validation.required', { label: t('default_record.fields.code.label') }) });
  if (codeValue !== '' && codeValue.length > 30) errors.push({ field: "Code", message: t('validation.maxLength', { label: t('default_record.fields.code.label'), count: 30 }) });
  const sortOrderRaw = String(row["Sort Order"] ?? '').trim();
  const sortOrderValue = sortOrderRaw === '' ? NaN : Number(sortOrderRaw);
  if (sortOrderRaw === '' || Number.isNaN(sortOrderValue)) errors.push({ field: "Sort Order", message: t('validation.number', { label: t('default_record.fields.sortOrder.label') }) });
  const descriptionValue = String(row["Description"] ?? '').trim();
  if (descriptionValue !== '' && descriptionValue.length > 500) errors.push({ field: "Description", message: t('validation.maxLength', { label: t('default_record.fields.description.label'), count: 500 }) });
  if (errors.length > 0) return { payload: null, errors };
  return {
    payload: {
    name: nameValue,
    code: codeValue,
    sortOrder: sortOrderValue,
    description: descriptionValue,
    },
    errors,
  };
}
