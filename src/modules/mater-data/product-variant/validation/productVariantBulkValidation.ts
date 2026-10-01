import type { CreateProductVariantPayload } from '../types';
import { hasEmoticon } from '../../../../shared/utils';

export interface BulkFieldError {
  field: string;
  message: string;
}

export interface BulkRowValidation {
  payload: CreateProductVariantPayload | null;
  errors: BulkFieldError[];
}

/** Header kolom template bulk upload (dipakai juga untuk mapping baris). */
export const BULK_PRODUCTVARIANT_HEADERS = ["Name","Description"];

/** Contoh baris pada template bulk upload. */
export const BULK_PRODUCTVARIANT_EXAMPLE = ["Contoh Name","Contoh Description"];

/**
 * Validasi satu baris bulk (key = header). Aturan mirror validasi form +
 * membership option + unique via `isTaken`.
 */
export function validateBulkProductVariantRow(
  row: Record<string, unknown>,
  isTaken: (field: string, value: string) => boolean,
): BulkRowValidation {
  const errors: BulkFieldError[] = [];
  const nameValue = String(row["Name"] ?? '').trim();
  if (!nameValue) errors.push({ field: "Name", message: "Name wajib diisi." });
  if (nameValue !== '' && nameValue.length < 3) errors.push({ field: "Name", message: "Name minimal 3 karakter." });
  if (nameValue !== '' && nameValue.length > 100) errors.push({ field: "Name", message: "Name maksimal 100 karakter." });
  if (nameValue !== '' && hasEmoticon(nameValue)) errors.push({ field: "Name", message: "Name tidak boleh mengandung emoticon." });
  if (nameValue !== '' && isTaken('name', nameValue)) errors.push({ field: "Name", message: "Name sudah dipakai." });
  const descriptionValue = String(row["Description"] ?? '').trim();
  if (!descriptionValue) errors.push({ field: "Description", message: "Description wajib diisi." });
  if (descriptionValue !== '' && descriptionValue.length < 10) errors.push({ field: "Description", message: "Description minimal 10 karakter." });
  if (descriptionValue !== '' && descriptionValue.length > 500) errors.push({ field: "Description", message: "Description maksimal 500 karakter." });
  if (descriptionValue !== '' && hasEmoticon(descriptionValue)) errors.push({ field: "Description", message: "Description tidak boleh mengandung emoticon." });
  if (errors.length > 0) return { payload: null, errors };
  return {
    payload: {
    name: nameValue,
    description: descriptionValue,
    },
    errors,
  };
}
