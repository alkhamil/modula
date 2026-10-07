import { t } from 'i18next';
import '../../../shared/i18n';
import type { CreateMasterDivisiPayload } from '../types';

export interface BulkFieldError {
  field: string;
  message: string;
}

export interface BulkRowValidation {
  payload: CreateMasterDivisiPayload | null;
  errors: BulkFieldError[];
}

/** Bulk template column headers (also used for row mapping). */
export const BULK_MASTERDIVISI_HEADERS = ["DivisionName","ID Ajalah"];

/** Example row in the bulk upload template. */
export const BULK_MASTERDIVISI_EXAMPLE = ["Sample DivisionName",100];

/**
 * Validasi satu baris bulk (key = header). Aturan mirror validasi form +
 * membership option + unique via `isTaken`.
 */
export function validateBulkMasterDivisiRow(
  row: Record<string, unknown>,
  _isTaken: (field: string, value: string) => boolean,
): BulkRowValidation {
  const errors: BulkFieldError[] = [];
  const divisionNameValue = String(row["DivisionName"] ?? '').trim();
  if (!divisionNameValue) errors.push({ field: "DivisionName", message: t('validation.required', { label: t('master_division.fields.divisionName.label') }) });
  if (divisionNameValue !== '' && divisionNameValue.length < 4) errors.push({ field: "DivisionName", message: t('validation.minLength', { label: t('master_division.fields.divisionName.label'), count: 4 }) });
  const idAjalahRaw = String(row["ID Ajalah"] ?? '').trim();
  const idAjalahValue = idAjalahRaw === '' ? NaN : Number(idAjalahRaw);
  if (idAjalahRaw === '' || Number.isNaN(idAjalahValue)) errors.push({ field: "ID Ajalah", message: t('validation.number', { label: t('master_division.fields.idAjalah.label') }) });
  if (errors.length > 0) return { payload: null, errors };
  return {
    payload: {
    divisionName: divisionNameValue,
    idAjalah: idAjalahValue,
    },
    errors,
  };
}
