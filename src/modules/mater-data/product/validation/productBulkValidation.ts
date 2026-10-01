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

/** Header kolom template bulk upload (dipakai juga untuk mapping baris). */
export const BULK_PRODUCT_HEADERS = ["Product Name","Product Code","Category"];

/** Contoh baris pada template bulk upload. */
export const BULK_PRODUCT_EXAMPLE = ["Contoh Product Name","Contoh Product Code","CATEGORY_1"];

/**
 * Validasi satu baris bulk (key = header). Aturan mirror validasi form +
 * membership option + unique via `isTaken`.
 */
export function validateBulkProductRow(
  row: Record<string, unknown>,
  isTaken: (field: string, value: string) => boolean,
): BulkRowValidation {
  const errors: BulkFieldError[] = [];
  const productNameValue = String(row["Product Name"] ?? '').trim();
  if (!productNameValue) errors.push({ field: "Product Name", message: "Product Name wajib diisi." });
  if (productNameValue !== '' && productNameValue.length < 3) errors.push({ field: "Product Name", message: "Product Name minimal 3 karakter." });
  if (productNameValue !== '' && productNameValue.length > 100) errors.push({ field: "Product Name", message: "Product Name maksimal 100 karakter." });
  if (productNameValue !== '' && hasEmoticon(productNameValue)) errors.push({ field: "Product Name", message: "Product Name tidak boleh mengandung emoticon." });
  if (productNameValue !== '' && isTaken('productName', productNameValue)) errors.push({ field: "Product Name", message: "Product Name sudah dipakai." });
  const productCodeValue = String(row["Product Code"] ?? '').trim();
  if (!productCodeValue) errors.push({ field: "Product Code", message: "Product Code wajib diisi." });
  if (productCodeValue !== '' && productCodeValue.length < 4) errors.push({ field: "Product Code", message: "Product Code minimal 4 karakter." });
  if (productCodeValue !== '' && productCodeValue.length > 4) errors.push({ field: "Product Code", message: "Product Code maksimal 4 karakter." });
  if (productCodeValue !== '' && hasEmoticon(productCodeValue)) errors.push({ field: "Product Code", message: "Product Code tidak boleh mengandung emoticon." });
  if (productCodeValue !== '' && isTaken('productCode', productCodeValue)) errors.push({ field: "Product Code", message: "Product Code sudah dipakai." });
  const categoryValue = String(row["Category"] ?? '').trim();
  if (!categoryValue) errors.push({ field: "Category", message: "Category wajib diisi." });
  if (categoryValue !== '' && hasEmoticon(categoryValue)) errors.push({ field: "Category", message: "Category tidak boleh mengandung emoticon." });
  if (errors.length > 0) return { payload: null, errors };
  return {
    payload: {
    productName: productNameValue,
    productCode: productCodeValue,
    category: categoryValue,
    },
    errors,
  };
}
