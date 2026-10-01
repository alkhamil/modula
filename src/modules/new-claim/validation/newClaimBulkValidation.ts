import type { CreateNewClaimPayload } from '../types';
import { hasEmoticon } from '../../../shared/utils';

export interface BulkFieldError {
  field: string;
  message: string;
}

export interface BulkRowValidation {
  payload: CreateNewClaimPayload | null;
  errors: BulkFieldError[];
}

/** Header kolom template bulk upload (dipakai juga untuk mapping baris). */
export const BULK_NEWCLAIM_HEADERS = ["Policy Number","Policy Date"];

/** Contoh baris pada template bulk upload. */
export const BULK_NEWCLAIM_EXAMPLE = ["Contoh Policy Number","2024-01-15"];

/**
 * Validasi satu baris bulk (key = header). Aturan mirror validasi form +
 * membership option + unique via `isTaken`.
 */
export function validateBulkNewClaimRow(
  row: Record<string, unknown>,
  isTaken: (field: string, value: string) => boolean,
): BulkRowValidation {
  const errors: BulkFieldError[] = [];
  const policyNumberValue = String(row["Policy Number"] ?? '').trim();
  if (!policyNumberValue) errors.push({ field: "Policy Number", message: "Policy Number wajib diisi." });
  const policyDateValue = String(row["Policy Date"] ?? '').trim();
  if (policyDateValue !== '' && !/^\d{4}-\d{2}-\d{2}$/.test(policyDateValue)) errors.push({ field: "Policy Date", message: "Policy Date formatnya YYYY-MM-DD." });
  if (!policyDateValue) errors.push({ field: "Policy Date", message: "Policy Date wajib diisi." });
  if (errors.length > 0) return { payload: null, errors };
  return {
    payload: {
    policyNumber: policyNumberValue,
    policyDate: policyDateValue,
    },
    errors,
  };
}
