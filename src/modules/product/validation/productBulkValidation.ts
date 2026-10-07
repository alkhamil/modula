import type { CreateProductPayload } from '../types';

export interface BulkFieldError {
  field: string;
  message: string;
}

export interface BulkRowValidation {
  payload: CreateProductPayload | null;
  errors: BulkFieldError[];
}

/** Bulk template column headers (also used for row mapping). */
export const BULK_PRODUCT_HEADERS = ["Category"];

/** Example row in the bulk upload template. */
export const BULK_PRODUCT_EXAMPLE = ["CATEGORY_1"];

/**
 * Validasi satu baris bulk (key = header). Aturan mirror validasi form +
 * membership option + unique via `isTaken`.
 */
export function validateBulkProductRow(
  row: Record<string, unknown>,
  _isTaken: (field: string, value: string) => boolean,
): BulkRowValidation {
  const errors: BulkFieldError[] = [];
  const categoryValue = String(row["Category"] ?? '').trim();
  if (errors.length > 0) return { payload: null, errors };
  return {
    payload: {
    category: categoryValue,
    },
    errors,
  };
}
