import { t } from 'i18next';
import '../../../shared/i18n';
import type { CreateRegionPayload } from '../types';
import { hasEmoticon } from '../../../shared/utils';

export interface BulkFieldError {
  field: string;
  message: string;
}

export interface BulkRowValidation {
  payload: CreateRegionPayload | null;
  errors: BulkFieldError[];
}

/** Bulk template column headers (also used for row mapping). */
export const BULK_REGION_HEADERS = ["Region Name","Description"];

/** Example row in the bulk upload template. */
export const BULK_REGION_EXAMPLE = ["Sample Region Name","Sample Description"];

/**
 * Validasi satu baris bulk (key = header). Aturan mirror validasi form +
 * membership option + unique via `isTaken`.
 */
export function validateBulkRegionRow(
  row: Record<string, unknown>,
  isTaken: (field: string, value: string) => boolean,
): BulkRowValidation {
  const errors: BulkFieldError[] = [];
  const regionNameValue = String(row["Region Name"] ?? '').trim();
  if (!regionNameValue) errors.push({ field: "Region Name", message: t('validation.required', { label: t('region.fields.regionName.label') }) });
  if (regionNameValue !== '' && regionNameValue.length < 3) errors.push({ field: "Region Name", message: t('validation.minLength', { label: t('region.fields.regionName.label'), count: 3 }) });
  if (regionNameValue !== '' && regionNameValue.length > 100) errors.push({ field: "Region Name", message: t('validation.maxLength', { label: t('region.fields.regionName.label'), count: 100 }) });
  if (regionNameValue !== '' && hasEmoticon(regionNameValue)) errors.push({ field: "Region Name", message: t('validation.noEmoticon') });
  if (regionNameValue !== '' && isTaken('regionName', regionNameValue)) errors.push({ field: "Region Name", message: t('validation.unique', { label: t('region.fields.regionName.label') }) });
  const descriptionValue = String(row["Description"] ?? '').trim();
  if (descriptionValue !== '' && descriptionValue.length < 10) errors.push({ field: "Description", message: t('validation.minLength', { label: t('region.fields.description.label'), count: 10 }) });
  if (descriptionValue !== '' && descriptionValue.length > 100) errors.push({ field: "Description", message: t('validation.maxLength', { label: t('region.fields.description.label'), count: 100 }) });
  if (descriptionValue !== '' && hasEmoticon(descriptionValue)) errors.push({ field: "Description", message: t('validation.noEmoticon') });
  if (errors.length > 0) return { payload: null, errors };
  return {
    payload: {
    regionName: regionNameValue,
    description: descriptionValue,
    },
    errors,
  };
}
