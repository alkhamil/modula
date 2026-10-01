import type { CreateProductColorPayload } from '../types';
import { hasEmoticon } from '../../../../shared/utils';

export interface BulkFieldError {
  field: string;
  message: string;
}

export interface BulkRowValidation {
  payload: CreateProductColorPayload | null;
  errors: BulkFieldError[];
}

/** Header kolom template bulk upload (dipakai juga untuk mapping baris). */
export const BULK_PRODUCTCOLOR_HEADERS = ["colorName","hexCode"];

/** Contoh baris pada template bulk upload. */
export const BULK_PRODUCTCOLOR_EXAMPLE = ["Contoh colorName","Contoh hexCode"];

/**
 * Validasi satu baris bulk (key = header). Aturan mirror validasi form +
 * membership option + unique via `isTaken`.
 */
export function validateBulkProductColorRow(
  row: Record<string, unknown>,
  isTaken: (field: string, value: string) => boolean,
): BulkRowValidation {
  const errors: BulkFieldError[] = [];
  const colorNameValue = String(row["colorName"] ?? '').trim();
  if (!colorNameValue) errors.push({ field: "colorName", message: "colorName wajib diisi." });
  if (colorNameValue !== '' && colorNameValue.length > 10) errors.push({ field: "colorName", message: "colorName maksimal 10 karakter." });
  if (colorNameValue !== '' && hasEmoticon(colorNameValue)) errors.push({ field: "colorName", message: "colorName tidak boleh mengandung emoticon." });
  if (colorNameValue !== '' && isTaken('colorName', colorNameValue)) errors.push({ field: "colorName", message: "colorName sudah dipakai." });
  const hexCodeValue = String(row["hexCode"] ?? '').trim();
  if (!hexCodeValue) errors.push({ field: "hexCode", message: "hexCode wajib diisi." });
  if (hexCodeValue !== '' && hexCodeValue.length < 6) errors.push({ field: "hexCode", message: "hexCode minimal 6 karakter." });
  if (hexCodeValue !== '' && hexCodeValue.length > 6) errors.push({ field: "hexCode", message: "hexCode maksimal 6 karakter." });
  if (hexCodeValue !== '' && hasEmoticon(hexCodeValue)) errors.push({ field: "hexCode", message: "hexCode tidak boleh mengandung emoticon." });
  if (errors.length > 0) return { payload: null, errors };
  return {
    payload: {
    colorName: colorNameValue,
    hexCode: hexCodeValue,
    },
    errors,
  };
}
