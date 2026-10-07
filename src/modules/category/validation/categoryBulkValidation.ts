import type { CreateCategoryPayload } from '../types';

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
  _isTaken: (field: string, value: string) => boolean,
): BulkRowValidation {
  const errors: BulkFieldError[] = [];
  const nameValue = String(row["Name"] ?? '').trim();
  if (errors.length > 0) return { payload: null, errors };
  return {
    payload: {
    name: nameValue,
    },
    errors,
  };
}
