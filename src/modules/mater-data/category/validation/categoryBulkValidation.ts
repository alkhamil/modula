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

/** Header kolom template bulk upload (dipakai juga untuk mapping baris). */
export const BULK_CATEGORY_HEADERS = ["Category Name","Description","Source"];

/** Contoh baris pada template bulk upload. */
export const BULK_CATEGORY_EXAMPLE = ["Contoh Category Name","Contoh Description","SOURCE_1,SOURCE_2"];

/**
 * Validasi satu baris bulk (key = header). Aturan mirror validasi form +
 * membership option + unique via `isTaken`.
 */
export function validateBulkCategoryRow(
  row: Record<string, unknown>,
  _isTaken: (field: string, value: string) => boolean,
): BulkRowValidation {
  const errors: BulkFieldError[] = [];
  const categoryNameValue = String(row["Category Name"] ?? '').trim();
  if (!categoryNameValue) errors.push({ field: "Category Name", message: "Category Name wajib diisi." });
  if (categoryNameValue !== '' && categoryNameValue.length < 3) errors.push({ field: "Category Name", message: "Category Name minimal 3 karakter." });
  if (categoryNameValue !== '' && categoryNameValue.length > 100) errors.push({ field: "Category Name", message: "Category Name maksimal 100 karakter." });
  if (categoryNameValue !== '' && hasEmoticon(categoryNameValue)) errors.push({ field: "Category Name", message: "Category Name tidak boleh mengandung emoticon." });
  const descriptionValue = String(row["Description"] ?? '').trim();
  if (descriptionValue !== '' && descriptionValue.length < 10) errors.push({ field: "Description", message: "Description minimal 10 karakter." });
  if (descriptionValue !== '' && descriptionValue.length > 500) errors.push({ field: "Description", message: "Description maksimal 500 karakter." });
  if (descriptionValue !== '' && hasEmoticon(descriptionValue)) errors.push({ field: "Description", message: "Description tidak boleh mengandung emoticon." });
  const sourceValue = String(row["Source"] ?? '').split(',').map((item) => item.trim()).filter(Boolean);
  if (sourceValue.length === 0) errors.push({ field: "Source", message: "Source wajib diisi." });
  if (errors.length > 0) return { payload: null, errors };
  return {
    payload: {
    categoryName: categoryNameValue,
    description: descriptionValue,
    source: sourceValue,
    },
    errors,
  };
}
