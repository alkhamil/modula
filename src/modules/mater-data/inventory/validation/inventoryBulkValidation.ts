import type { CreateInventoryPayload } from '../types';
import { hasEmoticon } from '../../../../shared/utils';

export interface BulkFieldError {
  field: string;
  message: string;
}

export interface BulkRowValidation {
  payload: CreateInventoryPayload | null;
  errors: BulkFieldError[];
}

/** Header kolom template bulk upload (dipakai juga untuk mapping baris). */
export const BULK_INVENTORY_HEADERS = ["Inventory Name"];

/** Contoh baris pada template bulk upload. */
export const BULK_INVENTORY_EXAMPLE = ["Contoh Inventory Name"];

/**
 * Validasi satu baris bulk (key = header). Aturan mirror validasi form +
 * membership option + unique via `isTaken`.
 */
export function validateBulkInventoryRow(
  row: Record<string, unknown>,
  isTaken: (field: string, value: string) => boolean,
): BulkRowValidation {
  const errors: BulkFieldError[] = [];
  const inventoryNameValue = String(row["Inventory Name"] ?? '').trim();
  if (!inventoryNameValue) errors.push({ field: "Inventory Name", message: "Inventory Name wajib diisi." });
  if (inventoryNameValue !== '' && inventoryNameValue.length < 3) errors.push({ field: "Inventory Name", message: "Inventory Name minimal 3 karakter." });
  if (inventoryNameValue !== '' && inventoryNameValue.length > 100) errors.push({ field: "Inventory Name", message: "Inventory Name maksimal 100 karakter." });
  if (inventoryNameValue !== '' && hasEmoticon(inventoryNameValue)) errors.push({ field: "Inventory Name", message: "Inventory Name tidak boleh mengandung emoticon." });
  if (inventoryNameValue !== '' && isTaken('inventoryName', inventoryNameValue)) errors.push({ field: "Inventory Name", message: "Inventory Name sudah dipakai." });
  if (errors.length > 0) return { payload: null, errors };
  return {
    payload: {
    inventoryName: inventoryNameValue,
    },
    errors,
  };
}
