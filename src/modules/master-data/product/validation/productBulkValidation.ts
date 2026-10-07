import { t } from 'i18next';
import '../../../../shared/i18n';
import type { CreateProductPayload } from '../types';
import { hasEmoticon } from '../../../../shared/utils';

export interface BulkFieldError {
  field: string;
  message: string;
}

export interface BulkRowValidation {
  payload: CreateProductPayload | null;
  errors: BulkFieldError[];
}

/** Bulk template column headers (also used for row mapping). */
export const BULK_PRODUCT_HEADERS = ["Name","Category","Description"];

/** Example row in the bulk upload template. */
export const BULK_PRODUCT_EXAMPLE = ["Sample Name","CATEGORY_1","Sample Description"];

/**
 * Validasi satu baris bulk (key = header). Aturan mirror validasi form +
 * membership option + unique via `isTaken`.
 */
export function validateBulkProductRow(
  row: Record<string, unknown>,
  isTaken: (field: string, value: string) => boolean,
): BulkRowValidation {
  const errors: BulkFieldError[] = [];
  const nameValue = String(row["Name"] ?? '').trim();
  if (!nameValue) errors.push({ field: "Name", message: t('validation.required', { label: t('product.fields.name.label') }) });
  if (nameValue !== '' && nameValue.length < 3) errors.push({ field: "Name", message: t('validation.minLength', { label: t('product.fields.name.label'), count: 3 }) });
  if (nameValue !== '' && nameValue.length > 100) errors.push({ field: "Name", message: t('validation.maxLength', { label: t('product.fields.name.label'), count: 100 }) });
  if (nameValue !== '' && hasEmoticon(nameValue)) errors.push({ field: "Name", message: t('validation.noEmoticon') });
  if (nameValue !== '' && isTaken('name', nameValue)) errors.push({ field: "Name", message: t('validation.unique', { label: t('product.fields.name.label') }) });
  const categoryValue = String(row["Category"] ?? '').trim();
  if (!categoryValue) errors.push({ field: "Category", message: t('validation.required', { label: t('product.fields.category.label') }) });
  const descriptionValue = String(row["Description"] ?? '').trim();
  if (!descriptionValue) errors.push({ field: "Description", message: t('validation.required', { label: t('product.fields.description.label') }) });
  if (descriptionValue !== '' && descriptionValue.length > 1000) errors.push({ field: "Description", message: t('validation.maxLength', { label: t('product.fields.description.label'), count: 1000 }) });
  if (descriptionValue !== '' && hasEmoticon(descriptionValue)) errors.push({ field: "Description", message: t('validation.noEmoticon') });
  if (errors.length > 0) return { payload: null, errors };
  return {
    payload: {
    name: nameValue,
    category: categoryValue,
    description: descriptionValue,
    },
    errors,
  };
}
